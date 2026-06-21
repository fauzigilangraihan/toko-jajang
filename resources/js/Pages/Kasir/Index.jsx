import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Kasir({ auth, activeShift }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [cash, setCash] = useState(0);
    const [cashStr, setCashStr] = useState('');
    const searchInputRef = useRef(null);

    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Load produk saat pertama kali mount
    useEffect(() => {
        fetchAllProducts();
    }, []);

    // Debounce pencarian produk
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search.length > 0) {
                fetchProducts();
            } else {
                fetchAllProducts();
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchAllProducts = async () => {
        try {
            const res = await axios.get(route('api.products.search', { query: '' }));
            setProducts(res.data);
        } catch (err) {
            console.error('Gagal memuat produk', err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(route('api.products.search', { query: search }));
            setProducts(res.data);

            // Auto-add jika scan barcode hanya 1 produk cocok
            if (res.data.length === 1 && res.data[0].barcode === search) {
                addToCart(res.data[0]);
                setSearch('');
                searchInputRef.current?.focus();
            }
        } catch (err) {
            console.error('Gagal mencari produk', err);
        }
    };

    const addToCart = (product) => {
        if (product.stock <= 0) return;
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            updateQty(product.id, 1);
        } else {
            setCart(prev => [...prev, { ...product, qty: 1 }]);
        }
        setSearch('');
        searchInputRef.current?.focus();
    };

    const updateQty = (id, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                if (newQty > item.stock) return item; // tidak boleh melebihi stok
                return newQty > 0 ? { ...item, qty: newQty } : item;
            }
            return item;
        }).filter(item => item.qty > 0));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
        setCash(0);
        setCashStr('');
        searchInputRef.current?.focus();
    };

    // Total belanja
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // Kembalian
    const change = cash > 0 && cash >= total ? cash - total : 0;

    // Input uang tunai
    const handleCashChange = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        setCashStr(val);
        setCash(parseInt(val) || 0);
    };

    // Tambah nominal ke uang tunai
    const addCash = (amount) => {
        const newCash = cash + amount;
        setCash(newCash);
        setCashStr(String(newCash));
    };

    // Bayar pas
    const payExact = () => {
        setCash(total);
        setCashStr(String(total));
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        if (cash < total) return;
        setShowCheckoutModal(true);
    };

    const processCheckout = () => {
        setIsProcessing(true);
        router.post(route('kasir.checkout'), {
            items: cart.map(item => ({
                product_id: item.id,
                qty: item.qty,
            })),
            paid: cash,
        }, {
            onError: () => setIsProcessing(false),
        });
    };

    const formatRp = (val) => new Intl.NumberFormat('id-ID').format(val);

    const NOMINAL_BUTTONS = [5000, 10000, 20000, 50000, 100000];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Terminal Kasir</h2>}
        >
            <Head title="Kasir" />

            {/* Modal Konfirmasi Checkout */}
            <ConfirmModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                onConfirm={processCheckout}
                title="Konfirmasi Pembayaran"
                confirmText="✓ Proses Bayar"
                cancelText="Batal"
                variant="success"
            >
                <div className="space-y-2 text-sm">
                    <div className="bg-slate-50 rounded-xl p-4 space-y-1.5">
                        <div className="flex justify-between text-slate-600">
                            <span>Jumlah item:</span>
                            <span className="font-bold text-slate-800">{cart.reduce((a, i) => a + i.qty, 0)} pcs</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Total belanja:</span>
                            <span className="font-bold text-slate-800">Rp {formatRp(total)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Dibayar:</span>
                            <span className="font-bold text-emerald-600">Rp {formatRp(cash)}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-1.5 flex justify-between">
                            <span className="font-bold text-slate-700">Kembalian:</span>
                            <span className="font-black text-blue-600">Rp {formatRp(change)}</span>
                        </div>
                    </div>
                    <p className="text-slate-400 text-xs text-center">Pastikan nominal sudah benar sebelum diproses.</p>
                </div>
            </ConfirmModal>

            {/* Modal Konfirmasi Kosongkan Keranjang */}
            <ConfirmModal
                isOpen={showClearModal}
                onClose={() => setShowClearModal(false)}
                onConfirm={clearCart}
                title="Kosongkan Keranjang?"
                message={`Semua ${cart.length} item dalam keranjang akan dihapus. Aksi ini tidak dapat dibatalkan.`}
                confirmText="Ya, Kosongkan"
                cancelText="Batal"
                variant="danger"
            />

            {/* Layout Utama Kasir (Full Height) */}
            <div className="h-[calc(100vh-4rem)] -m-4 sm:-m-6 flex overflow-hidden">

                {/* ============ SISI KIRI: PENCARIAN & DAFTAR PRODUK ============ */}
                <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden">

                    {/* Search Bar */}
                    <div className="p-4 bg-white border-b border-slate-200 shadow-sm">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <input
                                    ref={searchInputRef}
                                    className="w-full pl-12 pr-4 py-3 text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="Ketik nama produk atau scan barcode dengan alat scanner..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>

                    {/* Area Produk */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                                {products.map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock <= 0}
                                        className={`bg-white p-4 rounded-2xl shadow-sm border-2 transition-all text-left group ${
                                            product.stock <= 0
                                                ? 'border-slate-100 opacity-50 cursor-not-allowed'
                                                : 'border-transparent hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5'
                                        }`}
                                    >
                                        {/* Gambar / Placeholder */}
                                        <div className="h-20 w-full rounded-xl bg-slate-100 mb-3 overflow-hidden flex items-center justify-center">
                                            {product.image ? (
                                                <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                            )}
                                        </div>
                                        <div className="font-bold text-slate-800 text-sm truncate">{product.name}</div>
                                        <div className="text-indigo-600 font-black text-sm mt-1">Rp {formatRp(product.price)}</div>
                                        <div className={`text-xs mt-1 font-medium ${product.stock <= 5 ? 'text-rose-500' : 'text-slate-400'}`}>
                                            Stok: {product.stock} {product.unit}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center py-16">
                                <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                                    <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-slate-500 font-semibold">Produk tidak ditemukan</p>
                                <p className="text-slate-400 text-sm mt-1">Coba kata kunci lain atau scan barcode.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ============ SISI KANAN: KERANJANG & PEMBAYARAN ============ */}
                <div className="w-80 lg:w-96 flex flex-col bg-white border-l border-slate-200 shadow-xl">

                    {/* Header Keranjang */}
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-600">
                        <div className="flex items-center gap-2 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            <span className="font-bold text-base">Keranjang</span>
                            {cart.length > 0 && (
                                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {cart.reduce((a, i) => a + i.qty, 0)} item
                                </span>
                            )}
                        </div>
                        {cart.length > 0 && (
                            <button
                                onClick={() => setShowClearModal(true)}
                                className="text-indigo-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                                title="Kosongkan keranjang"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Kosongkan
                            </button>
                        )}
                    </div>

                    {/* Daftar Item Keranjang */}
                    <div className="flex-1 overflow-y-auto">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                                    <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <p className="text-slate-400 font-semibold text-sm">Keranjang kosong</p>
                                <p className="text-slate-300 text-xs mt-1">Tambahkan produk dari pencarian</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="p-3 border-b border-slate-50 flex items-center gap-3 hover:bg-slate-50/70 transition-colors">
                                    {/* Gambar kecil */}
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                                        {item.image ? (
                                            <img src={`/storage/${item.image}`} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <svg className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-slate-800 truncate">{item.name}</div>
                                        <div className="text-xs text-slate-400">Rp {formatRp(item.price)} / {item.unit}</div>
                                    </div>

                                    {/* Kontrol Qty */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            onClick={() => updateQty(item.id, -1)}
                                            className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors text-sm"
                                        >−</button>
                                        <span className="w-6 text-center font-black text-slate-800 text-sm">{item.qty}</span>
                                        <button
                                            onClick={() => updateQty(item.id, 1)}
                                            disabled={item.qty >= item.stock}
                                            className="h-7 w-7 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold flex items-center justify-center transition-colors text-sm disabled:opacity-40"
                                        >+</button>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="w-20 text-right shrink-0">
                                        <div className="text-sm font-black text-slate-800">{formatRp(item.price * item.qty)}</div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-[10px] text-rose-400 hover:text-rose-600 font-medium transition-colors"
                                        >Hapus</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Area Total & Pembayaran */}
                    <div className="border-t border-slate-100 bg-slate-50">
                        {/* Total */}
                        <div className="px-4 py-3 flex justify-between items-center border-b border-slate-200">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total</span>
                            <span className="text-2xl font-black text-slate-800">Rp {formatRp(total)}</span>
                        </div>

                        {/* Input Uang Tunai */}
                        <div className="px-4 pt-3 pb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Uang Tunai</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 font-bold text-sm">Rp</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className="w-full pl-10 pr-4 py-3 text-xl font-black text-emerald-600 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
                                    value={cashStr}
                                    onChange={handleCashChange}
                                    placeholder="0"
                                />
                            </div>

                            {/* Tombol Nominal Cepat */}
                            <div className="mt-2 grid grid-cols-5 gap-1.5">
                                {NOMINAL_BUTTONS.map(nominal => (
                                    <button
                                        key={nominal}
                                        type="button"
                                        onClick={() => addCash(nominal)}
                                        className="py-1.5 text-xs font-bold bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded-lg transition-all"
                                    >
                                        {nominal >= 1000 ? `${nominal / 1000}K` : nominal}
                                    </button>
                                ))}
                            </div>

                            {/* Tombol Bayar Pas */}
                            {total > 0 && (
                                <button
                                    type="button"
                                    onClick={payExact}
                                    className="mt-2 w-full py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100"
                                >
                                    💰 Bayar Pas (Rp {formatRp(total)})
                                </button>
                            )}
                        </div>

                        {/* Kembalian */}
                        <div className={`mx-4 mb-3 px-4 py-2.5 rounded-xl flex justify-between items-center ${
                            cash > 0 && cash < total
                                ? 'bg-rose-50 border border-rose-200'
                                : 'bg-blue-50 border border-blue-100'
                        }`}>
                            <span className={`text-xs font-bold uppercase tracking-wider ${cash > 0 && cash < total ? 'text-rose-500' : 'text-blue-500'}`}>
                                {cash > 0 && cash < total ? '⚠ Kurang' : 'Kembalian'}
                            </span>
                            <span className={`text-xl font-black ${cash > 0 && cash < total ? 'text-rose-600' : 'text-blue-700'}`}>
                                {cash > 0 && cash < total
                                    ? `Rp ${formatRp(total - cash)}`
                                    : `Rp ${formatRp(change)}`
                                }
                            </span>
                        </div>

                        {/* Tombol Proses Bayar */}
                        <div className="px-4 pb-4">
                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || cash < total || isProcessing}
                                className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                                    cart.length === 0 || cash < total
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        PROSES BAYAR
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
