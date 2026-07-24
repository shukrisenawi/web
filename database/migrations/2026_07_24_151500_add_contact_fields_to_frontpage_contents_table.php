<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->string('contact_title')->nullable()->after('about_mission_description');
            $table->string('contact_email')->nullable()->after('contact_title');
            $table->string('contact_phone')->nullable()->after('contact_email');
            $table->text('contact_office')->nullable()->after('contact_phone');
        });
    }

    public function down(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->dropColumn(['contact_title', 'contact_email', 'contact_phone', 'contact_office']);
        });
    }
};
