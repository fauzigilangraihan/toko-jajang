import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Receipt({ transaction }) {
    const formatRp = (val) => new Intl.NumberFormat('id-ID').format(val);

    return (
        <>
            <Head title={`Struk - ${transaction.invoice_number}`} />

            {/* Tombol aksi (disembunyikan saat print) */}
            <div className="no-print flex justify-center gap-3 p-4 bg-gray-100 min-h-screen items-start pt-8">
                <div>
                    <div className="mb-4 flex justify-center gap-3">
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Cetak Struk
                        </button>
                        <Link
                            href={route('transactions.history')}
                            className="px-6 py-2.5 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm shadow border border-slate-200"
                        >
                            Kembali
                        </Link>
                    </div>

                    {/* Struk Preview */}
                    <div
                        className="bg-white text-black font-mono mx-auto shadow-2xl rounded-lg"
                        id="receipt-area"
                        style={{ width: '72mm', padding: '6mm', fontSize: '11px', lineHeight: '1.5' }}
                    >
                        {/* Header Toko */}
                        <div className="text-center mb-3">
                            <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px' }}>TOKO JAJANG</div>
                            <div style={{ fontSize: '9px', marginTop: '2px' }}>Jl. Raya Jajang No. 1, Bandung</div>
                            <div style={{ fontSize: '9px' }}>Telp: 0812-3456-7890</div>
                            <div style={{ borderBottom: '1px dashed #000', marginTop: '6px', marginBottom: '6px' }}></div>
                        </div>

                        {/* Info Transaksi */}
                        <div style={{ fontSize: '9px', marginBottom: '6px' }}>
                            <div>No  : {transaction.invoice_number}</div>
                            <div>Tgl : {new Date(transaction.created_at).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                            <div>Ksr : {transaction.user?.name || '-'}</div>
                        </div>
                        <div style={{ borderBottom: '1px dashed #000', marginBottom: '6px' }}></div>

                        {/* Daftar Item */}
                        <table style={{ width: '100%', fontSize: '9px', marginBottom: '6px' }}>
                            <tbody>
                                {transaction.items.map((item, idx) => (
                                    <React.Fragment key={item.id}>
                                        <tr>
                                            <td colSpan="3" style={{ fontWeight: 'bold', paddingTop: idx > 0 ? '4px' : '0' }}>
                                                {item.product_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '28px' }}>{item.qty}x</td>
                                            <td>{formatRp(item.price)}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatRp(item.qty * item.price)}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>

                        {/* Ringkasan Pembayaran */}
                        <div style={{ borderTop: '1px dashed #000', paddingTop: '6px', fontSize: '9px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}>
                                <span>TOTAL</span>
                                <span>Rp {formatRp(transaction.total)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>TUNAI</span>
                                <span>Rp {formatRp(transaction.paid)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>KEMBALI</span>
                                <span>Rp {formatRp(transaction.paid - transaction.total)}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ borderTop: '1px dashed #000', marginTop: '8px', paddingTop: '6px', textAlign: 'center', fontSize: '9px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>*** TERIMA KASIH ***</div>
                            <div>Barang yang sudah dibeli</div>
                            <div>tidak dapat dikembalikan.</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Style untuk print */}
            <style>{`
                @media print {
                    .no-print { background: white !important; padding: 0 !important; min-height: auto !important; align-items: flex-start !important; }
                    .no-print > div > div:first-child { display: none !important; }
                    #receipt-area { box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; }
                    body { background: white; margin: 0; padding: 0; }
                    @page { margin: 0; size: 72mm auto; }
                }
            `}</style>
        </>
    );
}
