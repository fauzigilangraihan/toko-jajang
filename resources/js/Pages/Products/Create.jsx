import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ categories, branches }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        branch_id: '',
        name: '',
        barcode: '',
        image: null,
        unit: 'Pcs',
        price: '',
        stock: '',
    });

    const [imagePreview, setImagePreview] = useState(null);

    // Menangani perubahan input file gambar
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Kirim data ke backend
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('products.store'), {
            // Memaksa Inertia mengirimnya sebagai FormData agar file gambar bisa lewat
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Tambah Produk Baru</h2>}>
            <Head title="Tambah Produk" />

            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Informasi Produk</h3>
                    <p className="text-sm text-slate-500">Lengkapi data barang termasuk gambar dan barcode.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Kolom Kiri */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Nama Produk <span className="text-red-500">*</span></label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="Cth: Indomie Goreng" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Kategori</label>
                                <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500">
                                    <option value="">-- Tanpa Kategori --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Cabang</label>
                                <select value={data.branch_id} onChange={e => setData('branch_id', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500">
                                    <option value="">-- Semua Cabang --</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                                {errors.branch_id && <p className="text-red-500 text-xs mt-1">{errors.branch_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Harga Jual (Rp) <span className="text-red-500">*</span></label>
                                    <input type="number" min="0" value={data.price} onChange={e => setData('price', e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="0" />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Stok Awal <span className="text-red-500">*</span></label>
                                    <input type="number" min="0" value={data.stock} onChange={e => setData('stock', e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="0" />
                                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Satuan <span className="text-red-500">*</span></label>
                                <input type="text" value={data.unit} onChange={e => setData('unit', e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="Cth: Pcs, Dus, Kg" />
                                {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="space-y-4">

                            {/* Input Barcode Bersih (Tanpa Kamera) */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Kode Barcode</label>
                                <input
                                    type="text"
                                    value={data.barcode}
                                    onChange={e => setData('barcode', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Klik kolom ini, lalu scan dengan alat..."
                                />
                                {errors.barcode && <p className="text-red-500 text-xs mt-1">{errors.barcode}</p>}
                                <p className="text-xs text-slate-400 mt-1">Pastikan kursor berada di dalam kotak ini saat menggunakan scanner fisik.</p>
                            </div>

                            {/* Foto Produk */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Foto Produk (Opsional)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl relative bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="space-y-2 text-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="mx-auto h-32 object-cover rounded-xl shadow-sm mb-3" />
                                        ) : (
                                            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        )}
                                        <div className="flex text-sm text-slate-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                <span>Upload gambar</span>
                                                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
                                    </div>
                                </div>
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            </div>

                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                        <Link href={route('products.index')} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Batal</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-75 flex items-center gap-2">
                            {processing && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            Simpan Produk
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
