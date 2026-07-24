<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->string('about_vision_icon')->nullable()->after('about_vision_description');
            $table->string('about_mission_icon')->nullable()->after('about_mission_description');
        });
    }

    public function down(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->dropColumn(['about_vision_icon', 'about_mission_icon']);
        });
    }
};
