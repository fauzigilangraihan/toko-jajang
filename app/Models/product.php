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
        'branch_id',
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

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
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

        // Trigger notification for barang masuk
        session()->flash('stock_notification', [
            'type' => 'barang_masuk',
            'message' => "Stok bertambah {$qty} {$this->unit}",
            'product_name' => $this->name,
            'price' => $this->price,
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

        // Trigger notification for barang keluar
        session()->flash('stock_notification', [
            'type' => 'barang_keluar',
            'message' => "Stok berkurang {$qty} {$this->unit}",
            'product_name' => $this->name,
            'price' => $this->price,
        ]);

        // Check if stock is empty and trigger stok habis notification
        if ($this->stock <= 0) {
            session()->flash('stock_notification', [
                'type' => 'stok_habis',
                'message' => "Stok produk ini telah habis!",
                'product_name' => $this->name,
                'price' => $this->price,
            ]);
        }
    }
}
