import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function CloseShift({ auth, shift, totalSales, totalTransactions, expectedCash, flash }) {
    // Gunakan method PUT sesuai rute yang kita buat
    const { data, setData, put, processing, errors } = useForm({
        closing_cash: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('shift.update'));
    };

    // Helper untuk format rupiah
    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tutup Shift Kasir</h2>}
        >
            <Head title="Tutup Shift" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">

                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Ringkasan Shift</h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-gray-500">Waktu Buka Shift</p>
                                <p className="font-semibold">{new Date(shift.opened_at).toLocaleString('id-ID')}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-gray-500">Total Transaksi</p>
                                <p className="font-semibold">{totalTransactions} Transaksi</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-gray-500">Modal Awal</p>
                                <p className="font-semibold">{formatRp(shift.opening_cash)}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-gray-500">Total Penjualan</p>
                                <p className="font-semibold text-green-600">{formatRp(totalSales)}</p>
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-md mb-8 text-center">
                            <p className="text-indigo-800 text-sm">Kas Seharusnya (Sistem)</p>
                            <p className="text-3xl font-bold text-indigo-900 mt-1">{formatRp(expectedCash)}</p>
                        </div>

                        <form onSubmit={submit} className="border-t pt-6">
                            <p className="text-gray-600 mb-4 text-sm font-medium">
                                Silakan hitung uang tunai fisik yang ada di laci kasir saat ini dan masukkan ke bawah:
                            </p>

                            <div>
                                <InputLabel htmlFor="closing_cash" value="Kas Aktual (Uang Fisik di Laci)" />

                                <TextInput
                                    id="closing_cash"
                                    type="number"
                                    name="closing_cash"
                                    value={data.closing_cash}
                                    className="mt-1 block w-full text-lg"
                                    isFocused={true}
                                    onChange={(e) => setData('closing_cash', e.target.value)}
                                    min="0"
                                    placeholder="Masukkan jumlah uang aktual"
                                />

                                <InputError message={errors.closing_cash} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <Link href={route('dashboard')} className="text-sm text-gray-600 hover:text-gray-900 underline">
                                    Kembali ke Dashboard
                                </Link>
                                <PrimaryButton className="ml-4 bg-red-600 hover:bg-red-700 focus:bg-red-700" disabled={processing}>
                                    Akhiri & Tutup Shift
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
