<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::with('branch')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        $branches = Branch::active()->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'branches' => $branches,
            'filters' => ['search' => $request->search],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:admin,kasir'],
            'branch_id' => ['nullable', 'exists:branches,id'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'branch_id' => $validated['branch_id'],
        ]);

        return redirect()->back()->with('success', 'User berhasil dibuat!');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'role' => ['required', 'in:admin,kasir'],
            'branch_id' => ['nullable', 'exists:branches,id'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'branch_id' => $validated['branch_id'],
        ]);

        return redirect()->back()->with('success', 'User berhasil diperbarui!');
    }

    public function destroy(User $user)
    {
        // Set branch_id to null for transactions and stock movements before deleting user
        $user->transactions()->update(['user_id' => null]);
        $user->stockMovements()->update(['user_id' => null]);

        $user->delete();
        return redirect()->back()->with('success', 'User berhasil dihapus!');
    }
}
