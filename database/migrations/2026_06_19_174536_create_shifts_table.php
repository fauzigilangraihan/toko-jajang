<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('opening_cash'); // modal awal kasir
            $table->unsignedBigInteger('closing_cash')->nullable(); // kas fisik dihitung saat tutup
            $table->bigInteger('expected_cash')->nullable(); // kas seharusnya (sistem) saat tutup
            $table->bigInteger('cash_difference')->nullable(); // selisih (closing - expected)
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
