<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Tampilkan halaman utama POS/Kasir.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $activeShift = $user->activeShift();

        if (!$activeShift) {
            return redirect()->route('shift.create')
                ->with('error', 'Anda harus membuka shift terlebih dahulu sebelum melakukan transaksi.');
        }

        return Inertia::render('Kasir/Index', [
            'activeShift' => $activeShift,
        ]);
    }

    /**
     * Proses Simpan Transaksi (Checkout).
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $activeShift = $user->activeShift();

        if (!$activeShift) {
            return redirect()->route('shift.create')
                ->with('error', 'Shift tidak ditemukan atau sudah ditutup. Silahkan buka shift baru.');
        }

        $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'paid' => ['required', 'integer', 'min:0'],
        ]);

        $cartItems = $request->input('items');
        $paid = $request->input('paid');

        try {
            $transaction = DB::transaction(function () use ($cartItems, $paid, $activeShift, $user) {
                $total = 0;
                $processedItems = [];

                foreach ($cartItems as $item) {
                    $product = Product::findOrFail($item['product_id']);

                    if (!$product->is_active) {
                        throw new \Exception("Produk '{$product->name}' sedang tidak aktif.");
                    }

                    if ($product->stock < $item['qty']) {
                        throw new \Exception("Stok untuk produk '{$product->name}' tidak mencukupi. (Tersisa: {$product->stock})");
                    }

                    $subtotal = $product->price * $item['qty'];
                    $total += $subtotal;

                    $processedItems[] = [
                        'product' => $product,
                        'qty' => $item['qty'],
                        'subtotal' => $subtotal,
                    ];
                }

                if ($paid < $total) {
                    throw new \Exception("Uang yang dibayarkan kurang dari total belanja.");
                }

                $change = $paid - $total;
                $invoiceNumber = Transaction::generateInvoiceNumber();

                $transaction = Transaction::create([
                    'invoice_number' => $invoiceNumber,
                    'shift_id' => $activeShift->id,
                    'user_id' => $user->id,
                    'total' => $total,
                    'paid' => $paid,
                    'change' => $change,
                ]);

                foreach ($processedItems as $data) {
                    $product = $data['product'];

                    $transaction->items()->create([
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'price' => $product->price,
                        'qty' => $data['qty'],
                        'subtotal' => $data['subtotal'],
                    ]);

                    $product->reduceStock(
                        qty: $data['qty'],
                        note: "Penjualan transaksi #{$invoiceNumber}",
                        userId: $user->id
                    );
                }

                return $transaction;
            }); // <-- Perbaikan dilakukan di sini (sebelumnya ]); )

            return redirect()->back()->with([
                'success' => 'Transaksi berhasil diproses!',
                'print_receipt_id' => $transaction->id
            ]);

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memproses transaksi: ' . $e->getMessage());
        }
    }

    /**
     * Tampilkan riwayat semua transaksi dengan Pencarian, Paginasi, dan Grafik Omset.
     */
    public function history(Request $request): Response
    {
        $search = $request->input('search');

        $transactions = Transaction::query()
            ->with(['user:id,name', 'shift:id'])
            ->when($search, function ($query, $search) {
                $query->where('invoice_number', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $chartData = Transaction::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(id) as total_sales')
            )
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->limit(7)
            ->get();

        $summary = [
            'total_revenue' => Transaction::sum('total'),
            'today_revenue' => Transaction::whereDate('created_at', today())->sum('total'),
            'total_count'   => Transaction::count(),
        ];

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'chartData'    => $chartData,
            'summary'      => $summary,
            'filters'      => ['search' => $search],
        ]);
    }

    /**
     * Menampilkan detail struk untuk dicetak.
     */
    public function show(Transaction $transaction): Response
    {
        $transaction->load(['items', 'user:id,name']);

        return Inertia::render('Transactions/Receipt', [
            'transaction' => $transaction
        ]);
    }
}
