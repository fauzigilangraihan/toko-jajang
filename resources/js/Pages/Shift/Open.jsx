import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function OpenShift({ auth, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        opening_cash: '',
    });

    const formatRp = (val) => new Intl.NumberFormat('id-ID').format(val);

    const handleInput = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        setData('opening_cash', val);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('shift.store'));
    };

    const QUICK_AMOUNTS = [50000, 100000, 200000, 300000, 500000];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Buka Shift Kasir</h2>}
        >
            <Head title="Buka Shift" />

            <div className="max-w-lg mx-auto">

                {/* Ilustrasi & Judul */}
                <div className="text-center mb-8">
                    <div className="h-24 w-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-slate-800">Mulai Shift Kerja</h1>
                    <p className="text-slate-500 text-sm mt-2">Hitung dan masukkan uang tunai awal di laci kasir Anda sebelum memulai transaksi.</p>
                </div>

                {/* Info Waktu */}
                <div className="bg-white rounded-2xl p-4 mb-6 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Waktu Saat Ini</p>
                        <p className="text-sm font-bold text-slate-700">{new Date().toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>

                {/* Flash Error */}
                {flash?.error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-medium flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {flash.error}
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Modal Awal (Uang di Laci Kasir)
                                <span className="text-rose-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-4 flex items-center text-slate-500 font-bold">Rp</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={data.opening_cash ? formatRp(parseInt(data.opening_cash)) : ''}
                                    onChange={handleInput}
                                    className="w-full pl-12 pr-4 py-4 text-2xl font-black text-emerald-600 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                                    placeholder="0"
                                    autoFocus
                                />
                            </div>
                            {errors.opening_cash && (
                                <p className="text-rose-500 text-xs mt-2 font-medium">{errors.opening_cash}</p>
                            )}

                            {/* Tombol nominal cepat */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {QUICK_AMOUNTS.map(amount => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => setData('opening_cash', String(amount))}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                            parseInt(data.opening_cash) === amount
                                                ? 'bg-emerald-500 text-white border-emerald-500'
                                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-600'
                                        }`}
                                    >
                                        Rp {formatRp(amount)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-sm text-amber-700">Pastikan jumlah uang sudah dihitung dengan benar. Nominal ini akan digunakan sebagai acuan saat penutupan shift.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={processing || !data.opening_cash}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-lg rounded-2xl transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-3"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Membuka Shift...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Buka Shift Sekarang
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
