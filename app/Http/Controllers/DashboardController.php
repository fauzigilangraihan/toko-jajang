<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Kasir diarahkan ke riwayat penjualan
        if ($user->role === 'kasir') {
            return redirect()->route('transactions.history');
        }

        // Filter by branch for admin (cashiers are redirected above)
        $branchFilter = $user->branch_id ? ['branch_id' => $user->branch_id] : [];

        // 1. Statistik Utama (data real dari database)
        $stats = [
            'totalProducts'   => Product::where('is_active', true)
                ->when(!empty($branchFilter), function ($q) use ($branchFilter) {
                    $q->where($branchFilter);
                })
                ->count(),
            'totalCategories' => Category::count(),
            'totalSold'       => TransactionItem::whereHas('transaction', function ($q) use ($branchFilter) {
                if (!empty($branchFilter)) {
                    $q->where($branchFilter);
                }
            })->sum('qty'),
            'totalRevenue'    => Transaction::whereMonth('created_at', Carbon::now()->month)
                                    ->whereYear('created_at', Carbon::now()->year)
                                    ->when(!empty($branchFilter), function ($q) use ($branchFilter) {
                                        $q->where($branchFilter);
                                    })
                                    ->sum('total'),
        ];

        // 2. Data Grafik Pendapatan 7 Hari Terakhir (data real)
        $revenueByDay = Transaction::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as pendapatan')
            )
            ->where('created_at', '>=', Carbon::today()->subDays(6)->startOfDay())
            ->when(!empty($branchFilter), function ($q) use ($branchFilter) {
                $q->where($branchFilter);
            })
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->pluck('pendapatan', 'date');

        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $chartData[] = [
                'day'        => $date->translatedFormat('D'),
                'pendapatan' => (int) ($revenueByDay[$date->toDateString()] ?? 0),
            ];
        }

        // 3. Produk dengan Stok Menipis (stok <= 10)
        $lowStockProducts = Product::where('is_active', true)
            ->where('stock', '<=', 10)
            ->when(!empty($branchFilter), function ($q) use ($branchFilter) {
                $q->where($branchFilter);
            })
            ->orderBy('stock', 'ASC')
            ->limit(5)
            ->get(['id', 'name', 'stock', 'unit', 'image', 'price']);

        // 4. Produk Terlaris (Top 5)
        $topSellingProducts = TransactionItem::select('product_id', 'product_name', DB::raw('SUM(qty) as total_sold'), DB::raw('SUM(subtotal) as total_revenue'))
            ->with('product:id,name,image,price,unit')
            ->when(!empty($branchFilter), function ($q) use ($branchFilter) {
                $q->whereHas('transaction', function ($subQ) use ($branchFilter) {
                    $subQ->where($branchFilter);
                });
            })
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // 5. Pendapatan per Cabang
        try {
            $branchRevenue = Transaction::select('branches.name as branch_name', DB::raw('SUM(transactions.total) as total_revenue'), DB::raw('COUNT(transactions.id) as total_transactions'))
                ->leftJoin('branches', 'transactions.branch_id', '=', 'branches.id')
                ->whereMonth('transactions.created_at', Carbon::now()->month)
                ->whereYear('transactions.created_at', Carbon::now()->year)
                ->when(!empty($branchFilter), function ($q) use ($branchFilter) {
                    $q->where($branchFilter);
                })
                ->groupBy('branches.name')
                ->orderByDesc('total_revenue')
                ->get();
        } catch (\Exception $e) {
            // Handle case where branches table doesn't exist yet
            $branchRevenue = collect();
        }

        // 6. Kirim ke frontend
        return Inertia::render('Dashboard', [
            'stats'               => $stats,
            'chartData'           => $chartData,
            'lowStockProducts'    => $lowStockProducts,
            'topSellingProducts'  => $topSellingProducts,
            'branchRevenue'       => $branchRevenue,
        ]);
    }
}
