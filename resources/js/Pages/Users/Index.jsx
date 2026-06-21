import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Index({ users, branches, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);

    const { data: createForm, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: createReset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'kasir',
        branch_id: '',
    });

    const { data: editForm, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors } = useForm({
        name: '',
        email: '',
        role: 'kasir',
        branch_id: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('users.index'), { search }, { preserveState: true });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createPost(route('users.store'), {
            onSuccess: () => {
                createReset();
                setShowCreateModal(false);
            },
        });
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setEditData({
            name: user.name,
            email: user.email,
            role: user.role,
            branch_id: user.branch_id || '',
        });
        setShowEditModal(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editPut(route('users.update', editUser.id), {
            onSuccess: () => {
                setShowEditModal(false);
                setEditUser(null);
            },
        });
    };

    const confirmDelete = (user) => {
        setDeleteTarget({ id: user.id, name: user.name });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(route('users.destroy', deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Manajemen Pengguna</h2>}>
            <Head title="Manajemen Pengguna" />

            {/* Modal Konfirmasi Hapus */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Hapus Pengguna?"
                message={`Pengguna "${deleteTarget?.name}" akan dihapus secara permanen.`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                variant="danger"
            />

            {/* Modal Tambah Pengguna */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Tambah Pengguna Baru</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                                <input
                                    type="text"
                                    value={createForm.name}
                                    onChange={e => setCreateData('name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Nama lengkap"
                                />
                                {createErrors.name && <p className="text-rose-500 text-xs mt-1">{createErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={createForm.email}
                                    onChange={e => setCreateData('email', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="email@example.com"
                                />
                                {createErrors.email && <p className="text-rose-500 text-xs mt-1">{createErrors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={createForm.password}
                                    onChange={e => setCreateData('password', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Minimal 8 karakter"
                                />
                                {createErrors.password && <p className="text-rose-500 text-xs mt-1">{createErrors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select
                                    value={createForm.role}
                                    onChange={e => setCreateData('role', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="kasir">Kasir</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {createErrors.role && <p className="text-rose-500 text-xs mt-1">{createErrors.role}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cabang</label>
                                <select
                                    value={createForm.branch_id}
                                    onChange={e => setCreateData('branch_id', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Pilih Cabang</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                                {createErrors.branch_id && <p className="text-rose-500 text-xs mt-1">{createErrors.branch_id}</p>}
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createProcessing}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {createProcessing ? 'Memproses...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit Pengguna */}
            {showEditModal && editUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Edit Pengguna</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditData('name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {editErrors.name && <p className="text-rose-500 text-xs mt-1">{editErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditData('email', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {editErrors.email && <p className="text-rose-500 text-xs mt-1">{editErrors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select
                                    value={editForm.role}
                                    onChange={e => setEditData('role', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="kasir">Kasir</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {editErrors.role && <p className="text-rose-500 text-xs mt-1">{editErrors.role}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cabang</label>
                                <select
                                    value={editForm.branch_id}
                                    onChange={e => setEditData('branch_id', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Pilih Cabang</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                                {editErrors.branch_id && <p className="text-rose-500 text-xs mt-1">{editErrors.branch_id}</p>}
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {editProcessing ? 'Memproses...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Daftar Pengguna</h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {users.total} pengguna terdaftar
                        </p>
                    </div>

                    <div className="flex flex-1 md:flex-none items-center gap-3">
                        <form onSubmit={handleSearch} className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari nama / email..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </form>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm whitespace-nowrap flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            Tambah User
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-4 py-3.5 rounded-tl-2xl font-semibold">Nama</th>
                                <th className="px-4 py-3.5 font-semibold">Email</th>
                                <th className="px-4 py-3.5 font-semibold">Role</th>
                                <th className="px-4 py-3.5 font-semibold">Cabang</th>
                                <th className="px-4 py-3.5 rounded-tr-2xl font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {users.data.length > 0 ? (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-slate-800">{user.name}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-slate-600">{user.email}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                                                user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {user.role === 'admin' ? 'Admin' : 'Kasir'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-slate-600">{user.branch?.name || '-'}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-all"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(user)}
                                                    className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 rounded-lg transition-all"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-16 text-center">
                                        <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        </div>
                                        <p className="text-slate-400 font-semibold">Data pengguna tidak ditemukan</p>
                                        <p className="text-slate-300 text-sm mt-1">Tambahkan pengguna baru untuk memulai.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {users.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-1">
                        {users.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3.5 py-2 text-xs rounded-xl transition-all font-medium ${
                                    link.active
                                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100'
                                } ${!link.url && 'opacity-40 cursor-not-allowed pointer-events-none'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
