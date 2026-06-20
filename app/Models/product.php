<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'barcode',
        'image',
        'unit',
        'price',
        'stock',
        'is_active',
    ];

    protected $casts = [
        'price' => 'integer',
        'stock' => 'integer',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function transactionItems(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Tambah stok (restock) dan catat pergerakan stok.
     */
    public function addStock(int $qty, ?string $note = null, ?int $userId = null): void
    {
        $this->increment('stock', $qty);

        $this->stockMovements()->create([
            'type' => 'in',
            'qty' => $qty,
            'note' => $note,
            'user_id' => $userId,
        ]);
    }

    /**
     * Kurangi stok (terjual) dan catat pergerakan stok.
     */
    public function reduceStock(int $qty, ?string $note = null, ?int $userId = null): void
    {
        $this->decrement('stock', $qty);

        $this->stockMovements()->create([
            'type' => 'out',
            'qty' => $qty,
            'note' => $note,
            'user_id' => $userId,
        ]);
    }
}
