import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ category }) {
    const { data, setData, put, errors, processing } = useForm({
        name: category.name || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('categories.update', category.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Edit Kategori</h2>}>
            <Head title={`Edit - ${category.name}`} />

            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-6">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Perbarui Kategori</h3>
                    <p className="text-sm text-slate-500">Edit informasi nama kategori yang telah dipilih.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nama Kategori <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.name && <p className="text-rose-500 text-xs mt-1.5">{errors.name}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <Link
                            href={route('categories.index')}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing && <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            Perbarui Kategori
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
