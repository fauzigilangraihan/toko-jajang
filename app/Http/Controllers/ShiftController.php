<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShiftController extends Controller
{
    /**
     * Halaman buka shift. Jika user sudah punya shift aktif, redirect ke kasir.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        $activeShift = $request->user()->activeShift();

        if ($activeShift) {
            return redirect()->route('kasir.index');
        }

        return Inertia::render('Shift/Open');
    }

    /**
     * Buka shift baru dengan modal awal kas.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->activeShift()) {
            return redirect()->route('kasir.index')
                ->with('error', 'Anda sudah punya shift yang sedang berjalan.');
        }

        $validated = $request->validate([
            'opening_cash' => ['required', 'integer', 'min:0'],
        ]);

        Shift::create([
            'user_id' => $request->user()->id,
            'opening_cash' => $validated['opening_cash'],
            'opened_at' => now(),
        ]);

        return redirect()->route('kasir.index')
            ->with('success', 'Shift berhasil dibuka. Selamat berjualan!');
    }

    /**
     * Halaman tutup shift, tampilkan ringkasan penjualan & kas seharusnya.
     */
    public function edit(Request $request): Response|RedirectResponse
    {
        $shift = $request->user()->activeShift();

        if (!$shift) {
            return redirect()->route('shift.create')
                ->with('error', 'Tidak ada shift aktif untuk ditutup.');
        }

        $shift->load(['transactions' => function ($query) {
            $query->orderByDesc('created_at');
        }]);

        return Inertia::render('Shift/Close', [
            'shift' => $shift,
            'totalSales' => $shift->total_sales,
            'totalTransactions' => $shift->transactions->count(),
            'expectedCash' => $shift->calculateExpectedCash(),
        ]);
    }

    /**
     * Proses tutup shift, hitung selisih kas fisik vs sistem.
     */
    public function update(Request $request): RedirectResponse
    {
        $shift = $request->user()->activeShift();

        if (!$shift) {
            return redirect()->route('shift.create')
                ->with('error', 'Tidak ada shift aktif untuk ditutup.');
        }

        $validated = $request->validate([
            'closing_cash' => ['required', 'integer', 'min:0'],
        ]);

        $expectedCash = $shift->calculateExpectedCash();
        $difference = $validated['closing_cash'] - $expectedCash;

        $shift->update([
            'closing_cash' => $validated['closing_cash'],
            'expected_cash' => $expectedCash,
            'cash_difference' => $difference,
            'closed_at' => now(),
        ]);

        return redirect()->route('shift.create')
            ->with('success', 'Shift berhasil ditutup.' .
                ($difference !== 0 ? " Selisih kas: Rp " . number_format(abs($difference), 0, ',', '.') . ($difference < 0 ? ' (kurang)' : ' (lebih)') : ' Kas sesuai.'));
    }
}
