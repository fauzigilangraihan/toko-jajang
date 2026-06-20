<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ==========================================
// REDIRECT HALAMAN AWAL LANGSUNG KE LOGIN
// ==========================================
Route::redirect('/', '/login');

// ==========================================
// HALAMAN DASHBOARD (Diarahkan ke DashboardController)
// ==========================================
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Semua rute yang butuh login masuk ke grup ini
Route::middleware('auth')->group(function () {

    // --- Route Profile (Bawaan Breeze) ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ==========================================
    // ROUTE BERSAMA (Akses Admin & Kasir)
    // ==========================================
    // Laporan Riwayat Transaksi dikeluarkan dari grup Admin agar Kasir bisa membukanya
    Route::get('transactions/history', [TransactionController::class, 'history'])->name('transactions.history');

    // ==========================================
    // ROUTE ADMIN (Kelola Produk & Kategori)
    // ==========================================
    Route::middleware(['role:admin'])->group(function () {
        // CRUD Kategori (Hanya kecualikan 'show' karena kita tidak butuh halaman detail kategori)
        Route::resource('categories', CategoryController::class)->except(['show']);

        // CRUD Produk
        Route::resource('products', ProductController::class);

        // Custom route untuk tambah stok (Restock)
        Route::post('products/{product}/add-stock', [ProductController::class, 'addStock'])->name('products.add-stock');
    });

    // ==========================================
    // ROUTE KASIR (Transaksi, Shift)
    // ==========================================
    Route::middleware(['role:kasir'])->group(function () {
        // Manajemen Shift
        Route::get('shift/open', [ShiftController::class, 'create'])->name('shift.create');
        Route::post('shift/open', [ShiftController::class, 'store'])->name('shift.store');
        Route::get('shift/close', [ShiftController::class, 'edit'])->name('shift.edit');
        Route::put('shift/close', [ShiftController::class, 'update'])->name('shift.update');

        // Halaman Kasir / POS Utama
        Route::get('kasir', [TransactionController::class, 'index'])->name('kasir.index');

        // Proses Checkout Transaksi
        Route::post('kasir/checkout', [TransactionController::class, 'store'])->name('kasir.checkout');

        // Endpoint JSON untuk pencarian produk saat scan/ketik barcode di kasir
        Route::get('api/products/search', [ProductController::class, 'search'])->name('api.products.search');

        // Endpoint JSON untuk mengambil detail struk (dipakai untuk cetak)
        Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    });
});

require __DIR__.'/auth.php';
