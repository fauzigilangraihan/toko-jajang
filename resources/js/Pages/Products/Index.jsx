import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ products, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('products.index'), { search: search }, { preserveState: true });
    };

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Kelola Produk</h2>}>
            <Head title="Data Produk" />

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                {/* Header Konten & Fitur Cari */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Daftar Item Kasir</h3>
                        <p className="text-sm text-slate-500">Gunakan kolom pencarian untuk melacak produk melalui nama atau barcode.</p>
                    </div>

                    <div className="flex flex-1 md:flex-none items-center gap-3">
                        <form onSubmit={handleSearch} className="relative w-full md:w-64">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari nama / barcode..."
                                className="w-full pl-4 pr-10 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </form>

                        <Link href={route('products.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm whitespace-nowrap flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            Item Baru
                        </Link>
                    </div>
                </div>

                {/* Tabel Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 rounded-tl-xl font-semibold">Nama Produk</th>
                                <th className="p-4 font-semibold">Kategori</th>
                                <th className="p-4 font-semibold">Harga Jual</th>
                                <th className="p-4 font-semibold">Stok Saat Ini</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 rounded-tr-xl font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {products.data.length > 0 ? (
                                products.data.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                {/* Area Gambar Produk */}
                                                <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {product.image ? (
                                                        <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                {/* Teks Nama & Barcode */}
                                                <div>
                                                    <div className="font-bold text-slate-800">{product.name}</div>
                                                    <div className="text-xs text-slate-400 font-mono mt-0.5">{product.barcode || 'Tanpa Barcode'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                                {product.category?.name || 'Umum'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold text-slate-800">{formatRupiah(product.price)}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${product.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {product.stock} {product.unit}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`h-2.5 w-2.5 rounded-full inline-block ${product.is_active ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
                                            <span className="text-xs text-slate-600 ml-2">{product.is_active ? 'Aktif' : 'Nonaktif'}</span>
                                        </td>
                                        <td className="p-4 text-right space-x-3">
                                            <Link href={route('products.edit', product.id)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</Link>
                                            <button onClick={() => { if(confirm('Hapus produk?')) router.delete(route('products.destroy', product.id)) }} className="text-rose-600 hover:text-rose-900 font-medium">Hapus</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400">
                                        Data produk tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Komponen Paginasi Otomatis */}
                <div className="mt-6 flex justify-center gap-1">
                    {products.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3.5 py-2 text-xs rounded-xl transition-all ${
                                link.active
                                    ? 'bg-indigo-600 text-white font-bold'
                                    : 'text-slate-600 hover:bg-slate-100'
                            } ${!link.url && 'opacity-40 cursor-not-allowed'}`}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}   
