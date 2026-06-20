import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import BarcodeScanner from '@/Components/BarcodeScanner'; // <-- Import komponen kamera

export default function Kasir({ auth, activeShift }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [cash, setCash] = useState(0);
    const searchInputRef = useRef(null);

    // State baru untuk mengatur apakah kamera menyala atau tidak
    const [showScanner, setShowScanner] = useState(false);

    // Alur 1: Cari/Scan Barang (Debounce 300ms agar tidak berat ke server)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search.length > 1) {
                fetchProducts();
            } else {
                setProducts([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(route('api.products.search', { query: search }));
            setProducts(res.data);

            // Logic Auto-Add: Jika hasil scan barcode hanya 1 barang yang cocok, langsung masuk keranjang
            if (res.data.length === 1 && res.data[0].barcode === search) {
                addToCart(res.data[0]);
                setSearch(''); // Reset search bar
                setProducts([]);
            }
        } catch (err) {
            console.error("Gagal mencari produk", err);
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            // Jika sudah ada, tambah qty
            updateQty(product.id, 1);
        } else {
            // Jika baru, masukkan ke array
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                return newQty > 0 ? { ...item, qty: newQty } : item;
            }
            return item;
        }).filter(item => item.qty > 0));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    // Alur 2: Total = Σ (harga × qty)
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // Alur 4: Sistem hitung kembalian
    const change = cash > 0 ? cash - total : 0;

    const handleCheckout = () => {
        if (cart.length === 0) return alert("Keranjang masih kosong!");
        if (cash < total) return alert("Uang pembayaran kurang!");

        // Alur 5: Kirim ke server untuk potong stok & simpan transaksi
        router.post(route('kasir.checkout'), {
            items: cart.map(item => ({
                product_id: item.id,
                qty: item.qty
            })),
            paid: cash
        }, {
            onSuccess: (page) => {
                // Reset form setelah sukses
                setCart([]);
                setCash(0);
                // Di sini nanti bisa memicu window.print() untuk struk
                if (page.props.flash.print_receipt_id) {
                    console.log("Mencetak struk ID:", page.props.flash.print_receipt_id);
                }
            }
        });
    };

    const formatRp = (val) => new Intl.NumberFormat('id-ID').format(val);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Terminal Kasir</h2>}
        >
            <Head title="Kasir" />

            <div className="py-6 h-[calc(100vh-70px)]">
                <div className="max-w-[1600px] mx-auto sm:px-6 lg:px-8 h-full">
                    <div className="flex gap-6 h-full">

                        {/* SISI KIRI: PENCARIAN & DAFTAR PRODUK */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="bg-white p-4 shadow rounded-lg flex flex-col gap-4">
                                <div className="flex gap-2">
                                    <TextInput
                                        ref={searchInputRef}
                                        className="w-full text-lg"
                                        placeholder="Scan Barcode atau Ketik Nama Produk..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        autoFocus
                                    />
                                    {/* Tombol Buka/Tutup Kamera */}
                                    <PrimaryButton
                                        type="button"
                                        onClick={() => setShowScanner(!showScanner)}
                                        className={showScanner ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800'}
                                    >
                                        {showScanner ? 'Tutup Kamera' : 'Buka Kamera'}
                                    </PrimaryButton>
                                </div>

                                {/* Menampilkan Scanner Kamera jika state showScanner bernilai true */}
                                {showScanner && (
                                    <div className="p-4 border-2 border-dashed border-indigo-200 rounded-lg bg-indigo-50">
                                        <div className="text-center text-sm text-indigo-600 mb-2 font-semibold">Arahkan barcode produk ke kamera</div>
                                        <BarcodeScanner onScan={(decodedText) => {
                                            // Memasukkan hasil scan ke kolom pencarian
                                            setSearch(decodedText);
                                        }} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 bg-white shadow rounded-lg overflow-hidden flex flex-col">
                                <div className="p-4 border-b bg-gray-50 font-bold">Hasil Pencarian</div>
                                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    {products.map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => addToCart(product)}
                                            className="p-4 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition text-left"
                                        >
                                            <div className="font-bold text-gray-800">{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.barcode || 'No Barcode'}</div>
                                            <div className="mt-2 text-indigo-600 font-bold">Rp {formatRp(product.price)}</div>
                                            <div className="text-xs text-gray-400">Stok: {product.stock} {product.unit}</div>
                                        </button>
                                    ))}
                                    {search && products.length === 0 && <div className="col-span-full text-center py-10 text-gray-400">Produk tidak ditemukan...</div>}
                                </div>
                            </div>
                        </div>

                        {/* SISI KANAN: KERANJANG & PEMBAYARAN */}
                        <div className="w-96 flex flex-col gap-4">
                            <div className="flex-1 bg-white shadow rounded-lg flex flex-col overflow-hidden">
                                <div className="p-4 border-b bg-indigo-600 text-white font-bold flex justify-between">
                                    <span>Keranjang</span>
                                    <span>{cart.length} Item</span>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {cart.map(item => (
                                        <div key={item.id} className="p-3 border-b flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="text-sm font-bold truncate w-40">{item.name}</div>
                                                <div className="text-xs text-gray-500">Rp {formatRp(item.price)}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateQty(item.id, -1)} className="px-2 bg-gray-200 rounded">-</button>
                                                <span className="font-bold">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="px-2 bg-gray-200 rounded">+</button>
                                            </div>
                                            <div className="w-20 text-right font-bold text-sm">
                                                {formatRp(item.price * item.qty)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-gray-50 border-t space-y-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>TOTAL</span>
                                        <span className="text-indigo-700">Rp {formatRp(total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Alur 3: Input uang & Alur 4: Kembalian */}
                            <div className="bg-white shadow rounded-lg p-4 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Uang Tunai (F8)</label>
                                    <TextInput
                                        type="number"
                                        className="w-full text-2xl font-bold text-green-600"
                                        value={cash}
                                        onChange={(e) => setCash(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                    <span className="text-xs font-bold text-red-500 uppercase">Kembalian</span>
                                    <span className="text-xl font-bold text-red-600">Rp {formatRp(change)}</span>
                                </div>
                                <PrimaryButton
                                    onClick={handleCheckout}
                                    className="w-full justify-center py-4 bg-indigo-600 hover:bg-indigo-700 text-xl"
                                    disabled={cart.length === 0 || cash < total}
                                >
                                    PROSES BAYAR
                                </PrimaryButton>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
