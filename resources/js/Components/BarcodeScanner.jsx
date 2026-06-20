import { useEffect, useRef } from 'react';
// Tambahkan Html5QrcodeSupportedFormats di import
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export default function BarcodeScanner({ onScan }) {
    const isScanningRef = useRef(false);

    useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader");

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 100 },
            aspectRatio: 1.0,
            disableFlip: false,
            // TAMBAHAN BARU: Fokuskan ke barcode garis-garis (produk supermarket)
            formatsToSupport: [
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
            ]
        };

        // Jika dipakai di laptop, ia akan pakai webcam.
        // Jika dipakai di HP, ia otomatis pakai kamera belakang.
        html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                if (!isScanningRef.current) {
                    isScanningRef.current = true;
                    html5QrCode.stop().then(() => {
                        onScan(decodedText);
                    }).catch(console.error);
                }
            },
            (errorMessage) => {
                // Abaikan error background
            }
        ).catch((err) => {
            console.error("Kamera gagal diakses:", err);
            alert("Gagal mengakses kamera. Pastikan browser memiliki izin.");
        });

        return () => {
            if (html5QrCode.isScanning) {
                html5QrCode.stop().catch(console.error);
            }
        };
    }, [onScan]);

    return (
        <div className="w-full flex flex-col items-center">
            <div id="reader" className="w-full bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-[250px]">
                <span className="text-white text-sm animate-pulse z-0 absolute">
                    Menyiapkan kamera...
                </span>
            </div>

            <div className="mt-4 text-center space-y-1">
                <p className="text-sm font-semibold text-slate-700">
                    Arahkan garis merah tepat ke tengah barcode produk.
                </p>
                <p className="text-xs text-slate-500">
                    Pastikan pencahayaan cukup, tidak silau, dan gambar tidak blur.
                </p>
            </div>
        </div>
    );
}
