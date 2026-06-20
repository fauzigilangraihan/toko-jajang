import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ stats, chartData }) {
    const { user } = usePage().props.auth;

    // TODO: Hapus data dummy ini nanti jika Anda sudah mengirim data asli dari Laravel Controller
    const defaultStats = stats || {
        totalProducts: 142,
        totalCategories: 12,
        totalSold: 1254,
        totalRevenue: 15450000
    };

    const defaultChartData = chartData || [
        { day: 'Sen', pendapatan: 1200000 },
        { day: 'Sel', pendapatan: 1900000 },
        { day: 'Rab', pendapatan: 1500000 },
        { day: 'Kam', pendapatan: 2100000 },
        { day: 'Jum', pendapatan: 2800000 },
        { day: 'Sab', pendapatan: 3500000 },
        { day: 'Min', pendapatan: 2450000 },
    ];

    // Format Rupiah
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Dashboard Analitik</h2>}>
            <Head title="Dashboard" />

            <div className="mb-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">
                    Selamat datang kembali, <span className="text-indigo-600">{user.name}</span>!
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Berikut adalah ringkasan performa toko Anda. Anda masuk sebagai <span className="uppercase font-bold text-slate-700">{user.role}</span>.
                </p>
            </div>

            {/* Area Khusus Admin */}
            {user.role === 'admin' && (
                <div className="space-y-6">

                    {/* Widget Cards: Statistik Utama */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Card 1: Total Produk */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Produk</p>
                                <h4 className="text-2xl font-black text-slate-800">{defaultStats.totalProducts} <span className="text-sm font-normal text-slate-400">Item</span></h4>
                            </div>
                        </div>

                        {/* Card 2: Total Kategori */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Kategori Aktif</p>
                                <h4 className="text-2xl font-black text-slate-800">{defaultStats.totalCategories} <span className="text-sm font-normal text-slate-400">Grup</span></h4>
                            </div>
                        </div>

                        {/* Card 3: Produk Terjual */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Produk Terjual</p>
                                <h4 className="text-2xl font-black text-slate-800">{defaultStats.totalSold} <span className="text-sm font-normal text-slate-400">Pcs</span></h4>
                            </div>
                        </div>

                        {/* Card 4: Total Pendapatan */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Pendapatan (Bulan Ini)</p>
                                <h4 className="text-xl font-black text-slate-800">{formatRupiah(defaultStats.totalRevenue)}</h4>
                            </div>
                        </div>

                    </div>

                    {/* Area Grafik */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="mb-6 flex justify-between items-end">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Grafik Pendapatan</h3>
                                <p className="text-sm text-slate-500">Pergerakan transaksi penjualan selama 7 hari terakhir.</p>
                            </div>
                        </div>

                        {/* Chart Component */}
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={defaultChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(value) => `Rp ${value / 1000}k`}
                                    />
                                    <Tooltip
                                        formatter={(value) => formatRupiah(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="pendapatan"
                                        stroke="#4f46e5"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff' }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            )}
        </AuthenticatedLayout>
    );
}
