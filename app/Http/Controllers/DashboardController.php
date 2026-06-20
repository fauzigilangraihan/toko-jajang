<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Transaction; // Aktifkan jika model transaksi sudah ada
use App\Models\TransactionItem; // Aktifkan jika model detail transaksi sudah ada
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // TENDANG KASIR: Jika role-nya kasir, langsung pindahkan ke riwayat penjualan
        if ($request->user()->role === 'kasir') {
            return redirect()->route('transactions.history');
        }

        // 1. Hitung Statistik Utama (HANYA ADMIN)
        $stats = [
            'totalProducts' => Product::count(),
            'totalCategories' => Category::count(),

            // TODO: Buka komentar di bawah jika tabel transaksi sudah siap
            'totalSold' => 0, // TransactionItem::sum('quantity'),
            'totalRevenue' => 0, // Transaction::whereMonth('created_at', Carbon::now()->month)->sum('total_price'),
        ];

        // 2. Siapkan Data Grafik (7 Hari Terakhir)
        $chartData = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);

            $chartData[] = [
                'day' => $date->translatedFormat('D'),
                'pendapatan' => 0, // TODO: Ganti 0 dengan query pendapatan harian
            ];
        }

        // 3. Kirim ke React/Inertia
        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
        ]);
    }
}
