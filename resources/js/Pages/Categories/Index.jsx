import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ categories }) {

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(route('categories.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Kelola Kategori</h2>}>
            <Head title="Kategori Produk" />

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Daftar Kategori</h3>
                        <p className="text-sm text-slate-500">Kelompokkan produk ritel kasir Anda.</p>
                    </div>
                    <Link
                        href={route('categories.create')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        Tambah Kategori
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                                <th className="p-4 rounded-tl-xl font-semibold w-16">No</th>
                                <th className="p-4 font-semibold">Nama Kategori</th>
                                <th className="p-4 font-semibold text-center w-40">Jumlah Item</th>
                                <th className="p-4 rounded-tr-xl font-semibold text-right w-40">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.length > 0 ? (
                                categories.map((category, index) => (
                                    <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-slate-600 font-medium">{index + 1}</td>
                                        <td className="p-4 font-bold text-slate-800">{category.name}</td>
                                        <td className="p-4 text-center">
                                            <span className="bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded-lg text-xs">
                                                {category.products_count} Produk
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-3">
                                            <Link href={route('categories.edit', category.id)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(category.id)} className="text-rose-600 hover:text-rose-900 font-medium text-sm">
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400">
                                        Data kategori belum ada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
