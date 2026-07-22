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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('brand')->nullable();
            $table->string('title');
            $table->string('slug');
            $table->text('summary')->nullable();
            $table->text('content')->nullable();
            $table->string('featured')->nullable();
            $table->integer('active');
            $table->string('url')->nullable();
            $table->string('home')->nullable();
            $table->decimal('valnormal', 6, 2)->nullable();
            $table->decimal('valpromo', 6, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
