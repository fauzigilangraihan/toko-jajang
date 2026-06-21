import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import Notification from '@/Components/Notification';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, activeShift } = usePage().props;
    const { user } = auth;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Hitung durasi shift berjalan (jika ada)
    const shiftDuration = activeShift?.opened_at
        ? (() => {
            const diff = Math.floor((Date.now() - new Date(activeShift.opened_at).getTime()) / 1000 / 60);
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            return h > 0 ? `${h}j ${m}m` : `${m} menit`;
        })()
        : null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Notification />
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* ===== SIDEBAR ===== */}
            <aside className={`w-64 bg-blue-950 text-white flex flex-col fixed inset-y-0 left-0 z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Logo / Nama Toko */}
                <div className="h-16 flex items-center justify-center border-b border-blue-900 bg-blue-950 shadow-sm relative">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                                <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                        </div>
                        <span className="text-lg font-black tracking-widest text-white drop-shadow-md">TOKO JAJANG</span>
                    </div>
                    <button
                        className="md:hidden absolute right-4 text-blue-300 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Navigasi */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">

                    {/* MENU KHUSUS ADMIN */}
                    {user.role === 'admin' && (
                        <>
                            <Link
                                href={route('dashboard')}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    route().current('dashboard')
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-blue-200 hover:bg-blue-900/60 hover:text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                                <span className="font-medium text-sm">Dashboard</span>
                            </Link>

                            <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-blue-400 uppercase tracking-widest">Master Data</div>

                            <Link
                                href={route('products.index')}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    route().current('products.*')
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-blue-200 hover:bg-blue-900/60 hover:text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H14a1 1 0 100-2H8.414l1.293-1.293z" clipRule="evenodd" /></svg>
                                <span className="font-medium text-sm">Kelola Produk</span>
                            </Link>

                            <Link
                                href={route('categories.index')}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    route().current('categories.*')
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-blue-200 hover:bg-blue-900/60 hover:text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                <span className="font-medium text-sm">Kategori</span>
                            </Link>

                            <Link
                                href={route('users.index')}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    route().current('users.*')
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-blue-200 hover:bg-blue-900/60 hover:text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                <span className="font-medium text-sm">Manajemen Pengguna</span>
                            </Link>

                            <Link
                                href={route('branches.index')}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    route().current('branches.*')
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-blue-200 hover:bg-blue-900/60 hover:text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                                <span className="font-medium text-sm">Manajemen Cabang</span>
                            </Link>

                            <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-blue-400 uppercase tracking-widest">Laporan</div>

                            <Link
                                href={route('transactions.history')}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    route().current('transactions.history')
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-blue-200 hover:bg-blue-900/60 hover:text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                <span className="font-medium text-sm">Riwayat Penjualan</span>
                            </Link>
                        </>
                    )}

                    {/* MENU KHUSUS KASIR */}
                    {user.role === 'kasir' && (
                        <>
                            {/* Info Shift Aktif */}
                            {activeShift ? (
                                <div className="mx-1 mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                                        <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Shift Aktif</span>
                                    </div>
                                    <p className="text-xs text-emerald-200 mt-0.5">Berjalan: <span className="font-bold text-white">{shiftDuration}</span></p>
                                </div>
                            ) : (
                                <div className="mx-1 mb-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-orange-400 shrink-0"></span>
                                        <span className="text-xs font-bold text-orange-300">Shift Belum Dibuka</span>
                                    </div>
                                </div>
                            )}

                            <Link
                                href={route('transactions.history')}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    route().current('transactions.history')
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-blue-200 hover:bg-blue-900/60 hover:text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                <span className="font-medium text-sm">Riwayat Penjualan</span>
                            </Link>

                            <Link
                                href={route('kasir.index')}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    route().current('kasir.*')
                                        ? 'bg-emerald-500 text-white shadow-md'
                                        : 'text-blue-200 hover:bg-blue-900/60 hover:text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
                                <span className="font-medium text-sm">Buka Kasir</span>
                            </Link>

                            {/* Tombol Tutup Shift */}
                            {activeShift && (
                                <div className="pt-4">
                                    <div className="pb-2 px-4 text-[10px] font-bold text-blue-400 uppercase tracking-widest">Manajemen Shift</div>
                                    <Link
                                        href={route('shift.edit')}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-rose-300 hover:bg-rose-900/30 hover:text-rose-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium text-sm">Tutup Shift</span>
                                    </Link>
                                </div>
                            )}

                            {/* Tombol Buka Shift (jika belum ada shift aktif) */}
                            {!activeShift && (
                                <div className="pt-4">
                                    <div className="pb-2 px-4 text-[10px] font-bold text-blue-400 uppercase tracking-widest">Manajemen Shift</div>
                                    <Link
                                        href={route('shift.create')}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-emerald-300 hover:bg-emerald-900/30 hover:text-emerald-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium text-sm">Buka Shift Baru</span>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </nav>

                {/* User Profile di bawah sidebar */}
                <div className="p-4 bg-blue-900/80 border-t border-blue-800/50">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-blue-300 uppercase tracking-wider truncate">{user.role}</p>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-blue-800/60 transition-colors"
                            title="Keluar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ===== KONTEN UTAMA ===== */}
            <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        {header && <div className="hidden sm:block">{header}</div>}
                        {header && <div className="sm:hidden font-bold text-slate-800 truncate">TOKO JAJANG</div>}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Tanggal & waktu */}
                        <div className="hidden md:block text-xs text-slate-400 font-medium">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="inline-flex items-center px-3 py-2 border border-slate-200 text-sm leading-4 font-bold rounded-xl text-slate-600 bg-white hover:bg-slate-50 focus:outline-none transition ease-in-out duration-150 shadow-sm gap-2">
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:inline">{user.name}</span>
                                    <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right">
                                <Dropdown.Link href={route('profile.edit')}>Profile Saya</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Keluar</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 overflow-x-hidden bg-slate-50">
                    {flash?.success && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 shadow-sm animate-pulse-once">
                            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            <span className="font-medium text-emerald-800 text-sm">{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 shadow-sm">
                            <svg className="w-5 h-5 text-rose-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            <span className="font-medium text-rose-800 text-sm">{flash.error}</span>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
