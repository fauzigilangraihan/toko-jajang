import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function OpenShift({ auth, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        opening_cash: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('shift.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buka Shift Kasir</h2>}
        >
            <Head title="Buka Shift" />

            <div className="py-12">
                <div className="max-w-md mx-auto sm:px-6 lg:px-8">

                    {/* Pesan Error Global (misal jika sudah punya shift aktif) */}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <p className="text-gray-600 mb-6 text-sm">
                            Silakan masukkan jumlah uang tunai (modal awal) yang ada di laci kasir sebelum Anda mulai melayani transaksi.
                        </p>

                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="opening_cash" value="Modal Awal (Rp)" />

                                <TextInput
                                    id="opening_cash"
                                    type="number"
                                    name="opening_cash"
                                    value={data.opening_cash}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) => setData('opening_cash', e.target.value)}
                                    min="0"
                                    placeholder="Contoh: 100000"
                                />

                                <InputError message={errors.opening_cash} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Buka Shift Sekarang
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
