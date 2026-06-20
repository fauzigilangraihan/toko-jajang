import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Index({ transactions, chartData, summary, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('transactions.history'), { search: search }, { preserveState: true });
    };

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Fungsi untuk Export Data ke CSV
    const handleExport = () => {
        if (transactions.data.length === 0) {
            alert('Tidak ada data untuk diexport.');
            return;
        }

        const csvRows = [];
        // Header
        csvRows.push(['No Invoice', 'Kasir', 'Total (Rp)', 'Dibayar (Rp)', 'Kembalian (Rp)', 'Tanggal']);

        // Looping data
        transactions.data.forEach(trx => {
            csvRows.push([
                trx.invoice_number,
                trx.user?.name || '-',
                trx.total,
                trx.paid,
                trx.change,
                new Date(trx.created_at).toLocaleString('id-ID')
            ]);
        });

        // Menggabungkan jadi string CSV
        const csvString = csvRows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        // Trigger Download Otomatis
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "Laporan_Penjualan_Toko_Jajang.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Laporan Penjualan</h2>}>
            <Head title="Riwayat Penjualan" />

            {/* Bagian Atas: Statistik Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Pendapatan Hari Ini</p>
                        <h4 className="text-2xl font-black text-emerald-600">{formatRupiah(summary?.today_revenue || 0)}</h4>
                    </div>
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Total Omset Toko</p>
                        <h4 className="text-2xl font-black text-slate-800">{formatRupiah(summary?.total_revenue || 0)}</h4>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Kuantitas Transaksi</p>
                        <h4 className="text-2xl font-black text-slate-800">{summary?.total_count || 0} <span className="text-base font-medium text-slate-500">Invoice</span></h4>
                    </div>
                    <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </div>
                </div>
            </div>

            {/* Bagian Tengah: Visualisasi Grafik */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Grafik Penjualan Terakhir</h3>
                    <p className="text-sm text-slate-400">Analisis tren omset keuangan harian.</p>
                </div>
                <div className="h-[260px] w-full">
                    {chartData && chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="chartRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" tickFormatter={formatDate} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                                <Tooltip
                                    formatter={(value) => [formatRupiah(value), 'Omset']}
                                    labelFormatter={formatDate}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#chartRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">Belum ada data rekaman transaksi harian.</div>
                    )}
                </div>
            </div>

            {/* Bagian Bawah: Filter Pencarian & Tabel Log */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Catatan Riwayat Penjualan</h3>
                        <p className="text-sm text-slate-400">Semua riwayat kasir terekam di sini.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari nomor invoice..."
                                className="w-full pl-4 pr-10 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </form>

                        <button
                            onClick={handleExport}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm whitespace-nowrap flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                                <th className="p-4 rounded-tl-xl font-bold">No. Invoice</th>
                                <th className="p-4 font-bold">Tanggal & Waktu</th>
                                <th className="p-4 font-bold">Kasir Pelaksana</th>
                                <th className="p-4 font-bold">Total Nilai</th>
                                <th className="p-4 rounded-tr-xl font-bold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {transactions.data.length > 0 ? (
                                transactions.data.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4 font-mono font-bold text-blue-600">#{trx.invoice_number}</td>
                                        <td className="p-4 text-slate-500">{new Date(trx.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</td>
                                        <td className="p-4 font-medium text-slate-800">{trx.user?.name || 'Sistem'}</td>
                                        <td className="p-4 font-bold text-slate-900">{formatRupiah(trx.total)}</td>
                                        <td className="p-4 text-right">
                                            <Link href={route('transactions.show', trx.id)} className="inline-block bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors shadow-sm">
                                                Lihat Struk
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                        Tidak ada data transaksi yang sesuai dengan kriteria pencarian.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bagian Paginasi Halaman */}
                {transactions.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-1">
                        {transactions.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 text-xs rounded-xl transition-all ${
                                    link.active ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                                } ${!link.url && 'opacity-40 cursor-not-allowed'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
