import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

export default function Dashboard({ stats, chartData, lowStockProducts, topSellingProducts, branchRevenue }) {
    const { user } = usePage().props.auth;

    // Fallback data
    const s = stats || { totalProducts: 0, totalCategories: 0, totalSold: 0, totalRevenue: 0 };
    const chart = chartData || [];
    const lowStock = lowStockProducts || [];
    const topSelling = topSellingProducts || [];
    const branchRev = branchRevenue || [];

    const formatRupiah = (num) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    const StatCard = ({ title, value, sub, icon, color }) => (
        <div className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all`}>
            <div className={`h-14 w-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">{title}</p>
                <h4 className="text-2xl font-black text-slate-800 mt-0.5 truncate">{value}</h4>
                {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Dashboard Analitik</h2>}>
            <Head title="Dashboard" />

            {/* Welcome Banner */}
            <div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-lg shadow-blue-100 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black">
                            Selamat datang, {user.name}! 👋
                        </h3>
                        <p className="mt-1 text-blue-200 text-sm">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href={route('products.create')}
                            className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 border border-white/30"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            Tambah Produk
                        </Link>
                        <Link
                            href={route('transactions.history')}
                            className="px-4 py-2.5 bg-white text-indigo-700 font-bold text-sm rounded-xl transition-all hover:bg-blue-50 flex items-center gap-2 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Lihat Laporan
                        </Link>
                    </div>
                </div>
            </div>

            {/* Area Khusus Admin */}
            {user.role === 'admin' && (
                <div className="space-y-6">

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <StatCard
                            title="Total Produk Aktif"
                            value={`${s.totalProducts} Item`}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                            color="bg-blue-50"
                        />
                        <StatCard
                            title="Kategori Aktif"
                            value={`${s.totalCategories} Grup`}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                            color="bg-emerald-50"
                        />
                        <StatCard
                            title="Total Qty Terjual"
                            value={`${s.totalSold} Pcs`}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                            color="bg-orange-50"
                        />
                        <StatCard
                            title="Omset Bulan Ini"
                            value={formatRupiah(s.totalRevenue)}
                            sub="Total pendapatan bulan ini"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            color="bg-indigo-50"
                        />
                    </div>

                    {/* Grafik + Stok Menipis + Produk Terlaris */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Grafik Pendapatan (2/3 lebar) */}
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Grafik Pendapatan</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Pergerakan transaksi 7 hari terakhir</p>
                                </div>
                                <Link href={route('transactions.history')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                    Lihat Semua →
                                </Link>
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chart} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#4f46e5" />
                                                <stop offset="100%" stopColor="#7c3aed" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                                            tickFormatter={(v) => v >= 1000000 ? `${v / 1000000}Jt` : v >= 1000 ? `${v / 1000}K` : v}
                                        />
                                        <Tooltip
                                            formatter={(value) => [formatRupiah(value), 'Pendapatan']}
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="pendapatan"
                                            stroke="url(#lineGradient)"
                                            strokeWidth={3}
                                            fill="url(#areaGradient)"
                                            dot={{ r: 5, fill: '#4f46e5', strokeWidth: 3, stroke: '#ffffff' }}
                                            activeDot={{ r: 7, fill: '#4f46e5' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Stok Menipis (1/3 lebar) */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Stok Menipis</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Produk dengan stok ≤ 10</p>
                                </div>
                                <Link href={route('products.index')} className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors">
                                    Kelola →
                                </Link>
                            </div>

                            {lowStock.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-center">
                                    <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-600">Stok Aman!</p>
                                    <p className="text-xs text-slate-400 mt-1">Semua produk masih memiliki stok yang cukup.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {lowStock.map(product => (
                                        <div key={product.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                            <div className="h-12 w-12 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                                                {product.image ? (
                                                    <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">{product.name}</p>
                                                <p className="text-xs font-semibold text-indigo-600">{formatRupiah(product.price)}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 ${
                                                product.stock <= 3
                                                    ? 'bg-rose-100 text-rose-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {product.stock} {product.unit}
                                            </span>
                                        </div>
                                    ))}
                                    <Link
                                        href={route('products.index')}
                                        className="block mt-2 text-center text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors py-2 bg-slate-50 rounded-xl hover:bg-indigo-50"
                                    >
                                        Lihat Semua Produk →
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Produk Terlaris */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">Produk Terlaris</h3>
                                <p className="text-xs text-slate-400 mt-0.5">5 produk dengan penjualan tertinggi</p>
                            </div>
                            <Link href={route('transactions.history')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                Lihat Detail →
                            </Link>
                        </div>

                        {topSelling.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-center">
                                <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </div>
                                <p className="text-sm font-semibold text-slate-600">Belum ada data penjualan</p>
                                <p className="text-xs text-slate-400 mt-1">Mulai transaksi untuk melihat produk terlaris.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {topSelling.map((item, index) => (
                                    <div key={item.product_id} className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-2xl border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black ${
                                                index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                                index === 1 ? 'bg-slate-300 text-slate-700' :
                                                index === 2 ? 'bg-amber-600 text-amber-100' :
                                                'bg-slate-200 text-slate-600'
                                            }`}>
                                                {index + 1}
                                            </span>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                                {item.total_sold} terjual
                                            </span>
                                        </div>
                                        <div className="h-20 w-full rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center mb-3 border border-slate-200">
                                            {item.product?.image ? (
                                                <img src={`/storage/${item.product.image}`} alt={item.product_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                            )}
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 truncate">{item.product_name}</p>
                                        <p className="text-xs font-semibold text-indigo-600 mt-1">{formatRupiah(item.product?.price || 0)}</p>
                                        <p className="text-xs text-slate-400 mt-1">Total: {formatRupiah(item.total_revenue)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pendapatan per Cabang */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">Pendapatan per Cabang</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Data pendapatan bulan ini berdasarkan cabang</p>
                            </div>
                        </div>

                        {branchRev.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-center">
                                <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <p className="text-sm font-semibold text-slate-600">Belum ada data cabang</p>
                                <p className="text-xs text-slate-400 mt-1">Tambahkan cabang untuk melihat data pendapatan.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {branchRev.map((branch, index) => (
                                    <div key={index} className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-2xl border border-indigo-100 hover:shadow-md hover:-translate-y-1 transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{branch.branch_name || 'Tanpa Cabang'}</p>
                                                <p className="text-xs text-slate-500">{branch.total_transactions} transaksi</p>
                                            </div>
                                        </div>
                                        <p className="text-2xl font-black text-indigo-600">{formatRupiah(branch.total_revenue)}</p>
                                        <p className="text-xs text-slate-400 mt-1">Total pendapatan bulan ini</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
