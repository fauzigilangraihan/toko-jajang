import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 px-4 py-8">
            <Head title="Register" />

            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                {/* Header Banner */}
                <div className="bg-indigo-600 px-8 py-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-indigo-600 mb-4 shadow-inner">
                        {/* Ikon User Plus */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Daftar Akun</h1>
                    <p className="text-indigo-200 mt-2 text-sm">Buat akun baru untuk sistem kasir</p>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap" className="text-gray-700 font-semibold" />

                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-2 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm py-3"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-5">
                            <InputLabel htmlFor="email" value="Email Address" className="text-gray-700 font-semibold" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-2 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm py-3"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-5">
                            <InputLabel htmlFor="password" value="Password" className="text-gray-700 font-semibold" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-2 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm py-3"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-5">
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" className="text-gray-700 font-semibold" />

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-2 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm py-3"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />

                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <Link
                                href={route('login')}
                                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline focus:outline-none"
                            >
                                Sudah punya akun?
                            </Link>

                            <PrimaryButton
                                className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-md hover:shadow-lg"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'DAFTAR SEKARANG'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
