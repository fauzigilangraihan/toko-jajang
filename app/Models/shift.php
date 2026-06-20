<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'opening_cash',
        'closing_cash',
        'expected_cash',
        'cash_difference',
        'opened_at',
        'closed_at',
    ];

    protected $casts = [
        'opening_cash' => 'integer',
        'closing_cash' => 'integer',
        'expected_cash' => 'integer',
        'cash_difference' => 'integer',
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function isOpen(): bool
    {
        return is_null($this->closed_at);
    }

    /**
     * Total uang masuk dari penjualan selama shift ini berjalan.
     */
    public function getTotalSalesAttribute(): int
    {
        return $this->transactions()->sum('total');
    }

    /**
     * Kas yang seharusnya ada di laci: modal awal + total penjualan.
     */
    public function calculateExpectedCash(): int
    {
        return $this->opening_cash + $this->getTotalSalesAttribute();
    }
}
