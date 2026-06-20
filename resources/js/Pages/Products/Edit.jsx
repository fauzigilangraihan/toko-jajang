import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Edit({ product, categories }) {
    // Perhatikan penggunaan 'post' alih-alih 'put', dan penambahan '_method: put'
    const { data, setData, post, errors, processing } = useForm({
        name: product.name || '',
        barcode: product.barcode || '',
        category_id: product.category_id || '',
        unit: product.unit || '',
        price: product.price || '',
        is_active: product.is_active,
        image: null,
        _method: 'put', // Wajib untuk upload file pada proses update di Laravel
    });

    // Tampilkan gambar dari database jika ada, jika tidak null
    const [imagePreview, setImagePreview] = useState(
        product.image ? `/storage/${product.image}` : null
    );
    const [isScanning, setIsScanning] = useState(false);

    // Menangani perubahan input file gambar
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Efek untuk menyalakan kamera saat mode scanning aktif
    useEffect(() => {
        let scanner = null;
        if (isScanning) {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 150 } },
                false
            );

            scanner.render(
                (decodedText) => {
                    // Jika barcode berhasil terbaca
                    setData('barcode', decodedText);
                    setIsScanning(false);
                    scanner.clear();
                },
                (errorMessage) => {
                    // Berjalan di background saat belum ketemu barcode
                }
            );
        }

        // Cleanup: matikan kamera jika komponen ditutup
        return () => {
            if (scanner) {
                scanner.clear().catch(error => console.error("Gagal mematikan scanner", error));
            }
        };
    }, [isScanning]);

    const submit = (e) => {
        e.preventDefault();
        // Gunakan post dengan forceFormData agar gambar terkirim
        post(route('products.update', product.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Edit Produk</h2>}>
            <Head title={`Edit - ${product.name}`} />

            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mt-6">
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Perbarui Data Produk</h3>
                        <p className="text-sm text-slate-500">Edit informasi produk. Catatan: Stok hanya dapat ditambah melalui menu Restock.</p>
                    </div>

                    {/* Status Toggle Aktif/Nonaktif */}
                    <label className="flex items-center cursor-pointer bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                            />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${data.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.is_active ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                        <div className="ml-3 text-sm font-bold text-slate-700">
                            {data.is_active ? 'Aktif' : 'Nonaktif'}
                        </div>
                    </label>
                </div>

                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Kolom Kiri */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk <span className="text-rose-500">*</span></label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                                {errors.name && <p className="text-rose-500 text-xs mt-1.5">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                                <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-rose-500 text-xs mt-1.5">{errors.category_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Harga Jual (Rp) <span className="text-rose-500">*</span></label>
                                    <input type="number" min="0" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                                    {errors.price && <p className="text-rose-500 text-xs mt-1.5">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Satuan <span className="text-rose-500">*</span></label>
                                    <input type="text" value={data.unit} onChange={e => setData('unit', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                                    {errors.unit && <p className="text-rose-500 text-xs mt-1.5">{errors.unit}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="space-y-4">

                            {/* Input Barcode + Tombol Kamera */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kode Barcode</label>
                                <div className="flex gap-2">
                                    <input type="text" value={data.barcode} onChange={e => setData('barcode', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ketik atau scan barcode..." />
                                    <button type="button" onClick={() => setIsScanning(true)} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a2 2 0 012-2h2a1 1 0 010 2H5v2a1 1 0 01-2 0V4zm14 0a2 2 0 00-2-2h-2a1 1 0 100 2h2v2a1 1 0 102 0V4zM3 16a2 2 0 002 2h2a1 1 0 100-2H5v-2a1 1 0 10-2 0v2zm14 0a2 2 0 01-2 2h-2a1 1 0 110-2h2v-2a1 1 0 112 0v2z" clipRule="evenodd" /><path d="M7 6a1 1 0 012 0v8a1 1 0 11-2 0V6zM11 6a1 1 0 10-2 0v8a1 1 0 102 0V6zM15 6a1 1 0 10-2 0v8a1 1 0 102 0V6z" /></svg>
                                    </button>
                                </div>
                                {errors.barcode && <p className="text-rose-500 text-xs mt-1.5">{errors.barcode}</p>}
                            </div>

                            {/* Foto Produk */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Ubah Foto Produk</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl relative bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="space-y-2 text-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="mx-auto h-32 object-cover rounded-xl shadow-sm mb-3" />
                                        ) : (
                                            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        )}
                                        <div className="flex text-sm text-slate-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                <span>Upload gambar baru</span>
                                                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-500">Biarkan kosong jika tidak ingin mengubah gambar.</p>
                                    </div>
                                </div>
                                {errors.image && <p className="text-rose-500 text-xs mt-1.5">{errors.image}</p>}
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <Link href={route('products.index')} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2">
                            {processing && <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            Perbarui Produk
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal Scanner Kamera */}
            {isScanning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
                        <h3 className="text-lg font-bold mb-4 text-center text-slate-800">Scan Barcode Produk</h3>
                        <div id="reader" className="w-full overflow-hidden rounded-xl border-2 border-indigo-100"></div>
                        <button onClick={() => setIsScanning(false)} className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors">
                            Tutup Kamera
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
