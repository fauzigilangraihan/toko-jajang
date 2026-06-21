import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function CloseShift({ auth, shift, totalSales, totalTransactions, expectedCash, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        closing_cash: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('shift.update'));
    };

    const formatRp = (angka) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

    const handleInput = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        setData('closing_cash', val);
    };

    const closingCashNum = parseInt(data.closing_cash) || 0;
    const selisih = closingCashNum - expectedCash;
    const isOver = selisih > 0;
    const isUnder = selisih < 0;

    // Hitung durasi shift
    const shiftDuration = shift?.opened_at
        ? (() => {
            const diff = Math.floor((Date.now() - new Date(shift.opened_at).getTime()) / 1000 / 60);
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            return h > 0 ? `${h} jam ${m} menit` : `${m} menit`;
        })()
        : '-';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Tutup Shift Kasir</h2>}
        >
            <Head title="Tutup Shift" />

            <div className="max-w-2xl mx-auto space-y-6">

                {/* Ilustrasi & Judul */}
                <div className="text-center">
                    <div className="h-20 w-20 bg-gradient-to-br from-rose-400 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-slate-800">Akhiri Shift Kerja</h1>
                    <p className="text-slate-500 text-sm mt-1">Periksa ringkasan shift dan masukkan kas aktual sebelum menutup.</p>
                </div>

                {/* Flash Success */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-medium flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {flash.success}
                    </div>
                )}

                {/* Ringkasan Shift */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                        Ringkasan Shift
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Waktu Buka</p>
                            <p className="text-sm font-bold text-slate-700">{new Date(shift.opened_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Durasi Shift</p>
                            <p className="text-sm font-bold text-slate-700">{shiftDuration}</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Modal Awal</p>
                            <p className="text-sm font-bold text-slate-700">{formatRp(shift.opening_cash)}</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Total Transaksi</p>
                            <p className="text-sm font-bold text-slate-700">{totalTransactions} Transaksi</p>
                        </div>
                    </div>

                    {/* Total Penjualan (menonjol) */}
                    <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Total Penjualan Shift Ini</p>
                            <p className="text-2xl font-black text-emerald-700 mt-0.5">{formatRp(totalSales)}</p>
                        </div>
                        <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                    </div>
                </div>

                {/* Kas Sistem vs Aktual */}
                <div className="bg-indigo-900 rounded-3xl p-6 text-white text-center shadow-lg">
                    <p className="text-indigo-300 text-sm font-semibold uppercase tracking-wider mb-1">Kas Seharusnya (Sistem)</p>
                    <p className="text-4xl font-black">{formatRp(expectedCash)}</p>
                    <p className="text-indigo-400 text-xs mt-2">Modal Awal + Total Penjualan</p>
                </div>

                {/* Form Tutup Shift */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-400"></span>
                        Input Kas Aktual
                    </h3>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Uang Fisik di Laci Saat Ini
                                <span className="text-rose-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-4 flex items-center text-slate-500 font-bold">Rp</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={data.closing_cash ? new Intl.NumberFormat('id-ID').format(parseInt(data.closing_cash)) : ''}
                                    onChange={handleInput}
                                    className="w-full pl-12 pr-4 py-4 text-2xl font-black text-slate-800 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                                    placeholder="0"
                                    autoFocus
                                />
                            </div>
                            {errors.closing_cash && (
                                <p className="text-rose-500 text-xs mt-2 font-medium">{errors.closing_cash}</p>
                            )}
                        </div>

                        {/* Indikator Selisih Real-time */}
                        {data.closing_cash && (
                            <div className={`rounded-2xl p-4 flex items-center justify-between ${
                                selisih === 0
                                    ? 'bg-emerald-50 border border-emerald-100'
                                    : isOver
                                    ? 'bg-blue-50 border border-blue-100'
                                    : 'bg-rose-50 border border-rose-100'
                            }`}>
                                <span className={`text-sm font-bold ${selisih === 0 ? 'text-emerald-600' : isOver ? 'text-blue-600' : 'text-rose-600'}`}>
                                    {selisih === 0 ? '✓ Kas Sesuai' : isOver ? '↑ Kas Lebih' : '↓ Kas Kurang'}
                                </span>
                                <span className={`text-lg font-black ${selisih === 0 ? 'text-emerald-700' : isOver ? 'text-blue-700' : 'text-rose-700'}`}>
                                    {selisih === 0 ? 'Pas!' : (isOver ? '+' : '') + formatRp(selisih)}
                                </span>
                            </div>
                        )}

                        {/* Peringatan */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <p className="text-sm text-amber-700">Setelah shift ditutup, Anda tidak dapat melakukan transaksi. Pastikan semua data sudah benar.</p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Link
                                href={route('kasir.index')}
                                className="flex-1 py-3.5 text-center text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
                            >
                                Kembali ke Kasir
                            </Link>
                            <button
                                type="submit"
                                disabled={processing || !data.closing_cash}
                                className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-rose-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                )}
                                Tutup Shift
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
