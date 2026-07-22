<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->unique()->index();
            $table->string('client_id')->nullable();
            $table->text('details')->nullable();
            $table->text('defect')->nullable();
            $table->text('descbudget')->nullable();
            $table->string('valuebudget')->default(0);
            $table->string('cost')->default(0);
            $table->string('valueservice')->default(0);
            $table->string('valueparts')->default(0);
            $table->string('status')->nullable();
            $table->string('dtentry')->nullable();
            $table->string('dtdelivery')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
