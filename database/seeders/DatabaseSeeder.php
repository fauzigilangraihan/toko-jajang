<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Admin & Kasir
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@toko.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Kasir Shift 1',
            'email' => 'kasir@toko.com',
            'password' => Hash::make('password'),
            'role' => 'kasir',
        ]);

        // 2. Buat Kategori (Tanpa kolom description agar tidak error)
        $makanan = Category::create(['name' => 'Makanan']);
        $minuman = Category::create(['name' => 'Minuman']);

        // 3. Buat Produk
        Product::create([
            'category_id' => $makanan->id,
            'name' => 'Indomie Goreng',
            'barcode' => '89686010', // Contoh barcode
            'price' => 3500,
            'stock' => 100,
            'unit' => 'Bungkus'
        ]);

        Product::create([
            'category_id' => $minuman->id,
            'name' => 'Aqua Botol 600ml',
            'barcode' => '8886008101053',
            'price' => 4000,
            'stock' => 50,
            'unit' => 'Botol'
        ]);

        Product::create([
            'category_id' => $makanan->id,
            'name' => 'Roti Aoka Coklat',
            'barcode' => '8991234567890',
            'price' => 3000,
            'stock' => 30,
            'unit' => 'Pcs'
        ]);
    }
}
