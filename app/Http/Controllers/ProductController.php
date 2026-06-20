<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Tampilkan daftar produk (halaman admin).
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $products = Product::query()
            ->with('category:id,name')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Form tambah produk baru.
     */
    public function create(): Response
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Simpan produk baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'barcode' => ['nullable', 'string', 'max:100', 'unique:products,barcode'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'], // Validasi file gambar maksimal 2MB
            'unit' => ['required', 'string', 'max:50'],
            'price' => ['required', 'integer', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
        ]);

        // Proses upload gambar jika ada
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($validated);

        if ($validated['stock'] > 0) {
            $product->stockMovements()->create([
                'type' => 'in',
                'qty' => $validated['stock'],
                'note' => 'Stok awal saat produk dibuat',
                'user_id' => $request->user()->id,
            ]);
        }

        return redirect()->route('products.index')
            ->with('success', "Produk '{$product->name}' berhasil ditambahkan.");
    }

    /**
     * Form edit produk.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update data produk.
     * Catatan: perubahan stok lewat form ini TIDAK tercatat sebagai stock movement,
     * karena ini untuk koreksi data, bukan transaksi stok. Untuk restock gunakan
     * endpoint addStock terpisah.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'barcode' => ['nullable', 'string', 'max:100', 'unique:products,barcode,' . $product->id],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'unit' => ['required', 'string', 'max:50'],
            'price' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        // Proses upload gambar baru jika kasir mengganti gambar
        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($product->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($product->image)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        return redirect()->route('products.index')
            ->with('success', "Produk '{$product->name}' berhasil diperbarui.");
    }

    /**
     * Hapus produk.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $name = $product->name;
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', "Produk '{$name}' berhasil dihapus.");
    }

    /**
     * Tambah stok produk (restock dari supplier).
     */
    public function addStock(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'qty' => ['required', 'integer', 'min:1'],
            'note' => ['nullable', 'string', 'max:255'],
        ]);

        $product->addStock(
            qty: $validated['qty'],
            note: $validated['note'] ?? 'Restock manual',
            userId: $request->user()->id,
        );

        return redirect()->back()
            ->with('success', "Stok '{$product->name}' bertambah {$validated['qty']} {$product->unit}.");
    }

    /**
     * Cari produk via barcode/nama untuk halaman kasir (dipakai via fetch/Inertia partial reload).
     */
    public function search(Request $request)
    {
        $query = $request->input('query', '');

        $products = Product::query()
            ->where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('barcode', $query);
            })
            ->orderBy('name')
            ->limit(20)
            ->get(['id', 'name', 'barcode', 'price', 'stock', 'unit']);

        return response()->json($products);
    }
}
