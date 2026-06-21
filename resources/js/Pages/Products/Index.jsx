import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Index({ products, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('products.index'), { search }, { preserveState: true });
    };

    const confirmDelete = (product) => {
        setDeleteTarget({ id: product.id, name: product.name });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(route('products.destroy', deleteTarget.id));
        setDeleteTarget(null);
    };

    const formatRupiah = (num) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    // Hitung produk stok menipis
    const lowStockCount = products.data.filter(p => p.stock <= 5).length;

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Kelola Produk</h2>}>
            <Head title="Data Produk" />

            {/* Modal Konfirmasi Hapus */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Hapus Produk?"
                message={`Produk "${deleteTarget?.name}" akan dihapus secara permanen. Riwayat transaksi yang sudah ada tidak akan terpengaruh.`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                variant="danger"
            />

            {/* Alert Stok Menipis */}
            {lowStockCount > 0 && (
                <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="text-sm text-amber-700 font-medium">
                        <span className="font-black">{lowStockCount} produk</span> memiliki stok sangat menipis (≤ 5). Pertimbangkan untuk segera melakukan restock.
                    </p>
                </div>
            )}

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                {/* Header & Pencarian */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Daftar Item Kasir</h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {products.total} produk terdaftar
                            {lowStockCount > 0 && <span className="ml-2 text-amber-600 font-semibold">• {lowStockCount} stok menipis</span>}
                        </p>
                    </div>

                    <div className="flex flex-1 md:flex-none items-center gap-3">
                        <form onSubmit={handleSearch} className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari nama / barcode..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </form>

                        <Link
                            href={route('products.create')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm whitespace-nowrap flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            Item Baru
                        </Link>
                    </div>
                </div>

                {/* Tabel Data */}
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-4 py-3.5 rounded-tl-2xl font-semibold">Nama Produk & Harga</th>
                                <th className="px-4 py-3.5 font-semibold">Kategori</th>
                                <th className="px-4 py-3.5 font-semibold">Stok</th>
                                <th className="px-4 py-3.5 font-semibold">Status</th>
                                <th className="px-4 py-3.5 rounded-tr-2xl font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {products.data.length > 0 ? (
                                products.data.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-11 w-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {product.image ? (
                                                        <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{product.name}</div>
                                                    <div className="text-xs text-slate-400 font-mono mt-0.5">{product.barcode || 'Tanpa Barcode'}</div>
                                                    <div className="text-sm font-bold text-indigo-600 mt-1">{formatRupiah(product.price)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                {product.category?.name || 'Umum'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                                                    product.stock <= 0
                                                        ? 'bg-rose-100 text-rose-700'
                                                        : product.stock <= 5
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    {product.stock} {product.unit}
                                                </span>
                                                {product.stock <= 5 && product.stock > 0 && (
                                                    <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-md font-bold">MENIPIS</span>
                                                )}
                                                {product.stock <= 0 && (
                                                    <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded-md font-bold">HABIS</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`h-2 w-2 rounded-full ${product.is_active ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
                                                <span className="text-xs text-slate-600 font-medium">{product.is_active ? 'Aktif' : 'Nonaktif'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('products.edit', product.id)}
                                                    className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-all"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(product)}
                                                    className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 rounded-lg transition-all"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-16 text-center">
                                        <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        </div>
                                        <p className="text-slate-400 font-semibold">Data produk tidak ditemukan</p>
                                        <p className="text-slate-300 text-sm mt-1">Coba kata kunci pencarian lain atau tambah produk baru.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginasi */}
                {products.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-1">
                        {products.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3.5 py-2 text-xs rounded-xl transition-all font-medium ${
                                    link.active
                                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100'
                                } ${!link.url && 'opacity-40 cursor-not-allowed pointer-events-none'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
