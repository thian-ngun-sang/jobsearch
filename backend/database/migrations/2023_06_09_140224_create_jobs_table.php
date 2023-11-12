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
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('position');
            $table->string('description')->nullable();
            // $table->integer('experience_number')->nullable();
            $table->string('experience');
            $table->string('type')->nullable(); // hybrid, remote, relocate
            $table->string('location')->nullable();
            $table->string('education_level')->nullable();  // grade4, grade8, grade10, ungraduate, bachelor, master, phd, none
            $table->string('requirements')->nullable();
            $table->string('skills')->nullable();
            $table->integer('salary')->nullable();
            $table->string('payment_unit')->nullable();     // usd, mmk
            $table->string('payment_period')->nullable();   // hour, week, month, year
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
