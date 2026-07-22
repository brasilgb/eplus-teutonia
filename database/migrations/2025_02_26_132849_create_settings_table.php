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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('logo')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->text('url')->nullable();
            $table->text('opening')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->string('neighborhood')->nullable();
            $table->string('street')->nullable();
            $table->string('number')->nullable();
            $table->string('complement')->nullable();
            $table->text('maps')->nullable();
            $table->string('telephone')->nullable();
            $table->string('celular')->nullable();
            $table->text('email')->nullable();
            $table->text('whatsapp')->nullable();
            $table->text('instagram')->nullable();
            $table->text('facebook')->nullable();
            $table->text('redex')->nullable();
            $table->text('youtube')->nullable();
            $table->text('metatitle')->nullable();
            $table->text('metakeyword')->nullable();
            $table->text('metadescription')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
