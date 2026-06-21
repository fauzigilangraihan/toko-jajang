import { useEffect } from 'react';

/**
 * Komponen Modal Konfirmasi yang elegan.
 *
 * @param {boolean} isOpen - Apakah modal ditampilkan
 * @param {function} onClose - Callback saat modal ditutup / dibatalkan
 * @param {function} onConfirm - Callback saat tombol konfirmasi diklik
 * @param {string} title - Judul modal
 * @param {string} message - Pesan / deskripsi modal
 * @param {string} confirmText - Teks tombol konfirmasi (default: "Ya, Lanjutkan")
 * @param {string} cancelText - Teks tombol batal (default: "Batal")
 * @param {string} variant - Warna tombol konfirmasi: 'danger' | 'success' | 'primary' (default: 'danger')
 * @param {React.ReactNode} children - Konten tambahan di dalam modal (opsional)
 */
export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi Aksi',
    message = 'Apakah Anda yakin ingin melanjutkan?',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    variant = 'danger',
    children,
}) {
    // Tutup modal saat tekan Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Kunci scroll body saat modal terbuka
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const variantClasses = {
        danger: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
        success: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
        primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    };

    const variantIconClasses = {
        danger: 'bg-rose-100 text-rose-600',
        success: 'bg-emerald-100 text-emerald-600',
        primary: 'bg-indigo-100 text-indigo-600',
    };

    const icons = {
        danger: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        primary: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel Modal */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                style={{ animation: 'slideUp 0.2s ease-out' }}
            >
                <div className="flex items-start gap-4">
                    {/* Ikon */}
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${variantIconClasses[variant]}`}>
                        {icons[variant]}
                    </div>

                    {/* Konten */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-800 leading-tight">{title}</h3>
                        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{message}</p>
                        {children && <div className="mt-4">{children}</div>}
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[variant]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            {/* Animasi CSS inline */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
