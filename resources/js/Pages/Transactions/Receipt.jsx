import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Receipt({ transaction }) {
    // Otomatis memicu dialog print browser saat halaman selesai dimuat
    useEffect(() => {
        window.print();
    }, []);

    const formatRp = (val) => new Intl.NumberFormat('id-ID').format(val);

    return (
        <div className="bg-white text-black font-mono mx-auto" style={{ width: '58mm', padding: '5mm', fontSize: '12px' }}>
            <Head title={`Struk - ${transaction.invoice_number}`} />

            {/* Header Toko */}
            <div className="text-center mb-4">
                <h1 className="font-bold text-lg uppercase">Toko Kita React</h1>
                <p className="text-[10px]">Jl. Laravel Web. No. 11</p>
                <p className="text-[10px]">Telp: 0812-3456-7890</p>
            </div>

            {/* Info Transaksi */}
            <div className="border-b border-dashed border-black pb-2 mb-2 text-[10px]">
                <p>No  : {transaction.invoice_number}</p>
                <p>Tgl : {new Date(transaction.created_at).toLocaleString('id-ID')}</p>
                <p>Ksr : {transaction.user.name}</p>
            </div>

            {/* Daftar Item */}
            <table className="w-full text-[10px] mb-2">
                <tbody>
                    {transaction.items.map(item => (
                        <React.Fragment key={item.id}>
                            <tr>
                                <td colSpan="3" className="font-bold">{item.product_name}</td>
                            </tr>
                            <tr>
                                <td className="w-8">{item.qty}x</td>
                                <td>{formatRp(item.price)}</td>
                                <td className="text-right">{formatRp(item.qty * item.price)}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Ringkasan Pembayaran */}
            <div className="border-t border-dashed border-black pt-2 text-[10px]">
                <div className="flex justify-between font-bold">
                    <span>TOTAL</span>
                    <span>Rp {formatRp(transaction.total)}</span>
                </div>
                <div className="flex justify-between">
                    <span>TUNAI</span>
                    <span>Rp {formatRp(transaction.paid)}</span>
                </div>
                <div className="flex justify-between">
                    <span>KEMBALI</span>
                    <span>Rp {formatRp(transaction.paid - transaction.total)}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-[10px]">
                <p>Terima Kasih!</p>
                <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
            </div>

            {/* Style khusus untuk menyembunyikan elemen lain saat nge-print */}
            <style jsx global>{`
                @media print {
                    body { background: white; margin: 0; padding: 0; }
                    @page { margin: 0; }
                }
            `}</style>
        </div>
    );
}
