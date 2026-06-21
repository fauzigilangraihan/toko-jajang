import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function Notification() {
    const { flash } = usePage().props;
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (flash?.stock_notification) {
            setNotifications(prev => [...prev, {
                id: Date.now(),
                type: flash.stock_notification.type,
                message: flash.stock_notification.message,
                productName: flash.stock_notification.product_name,
                price: flash.stock_notification.price,
            }]);
        }
    }, [flash]);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`p-4 rounded-xl shadow-lg border-2 animate-slide-in ${
                        notification.type === 'barang_masuk'
                            ? 'bg-emerald-50 border-emerald-300'
                            : notification.type === 'barang_keluar'
                            ? 'bg-blue-50 border-blue-300'
                            : notification.type === 'stok_habis'
                            ? 'bg-rose-50 border-rose-300'
                            : 'bg-slate-50 border-slate-300'
                    }`}
                >
                    <div className="flex items-start gap-3">
                        <div className="shrink-0">
                            {notification.type === 'barang_masuk' && (
                                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                            {notification.type === 'barang_keluar' && (
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                            )}
                            {notification.type === 'stok_habis' && (
                                <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`font-bold text-sm ${
                                notification.type === 'barang_masuk'
                                    ? 'text-emerald-800'
                                    : notification.type === 'barang_keluar'
                                    ? 'text-blue-800'
                                    : 'text-rose-800'
                            }`}>
                                {notification.type === 'barang_masuk' && '📦 Barang Masuk'}
                                {notification.type === 'barang_keluar' && '🛒 Barang Keluar'}
                                {notification.type === 'stok_habis' && '⚠️ Stok Habis'}
                            </p>
                            <p className="text-sm text-slate-700 mt-1">
                                {notification.productName} - <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(notification.price)}</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
