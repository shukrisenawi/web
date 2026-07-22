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
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->string('payment_logo')->nullable()->after('footer_tagline');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->dropColumn('payment_logo');
        });
    }
};
