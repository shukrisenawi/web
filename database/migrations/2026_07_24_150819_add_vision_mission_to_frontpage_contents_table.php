<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->string('about_vision_title')->nullable()->after('about_hero');
            $table->text('about_vision_description')->nullable()->after('about_vision_title');
            $table->string('about_mission_title')->nullable()->after('about_vision_description');
            $table->text('about_mission_description')->nullable()->after('about_mission_title');
        });
    }

    public function down(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->dropColumn([
                'about_vision_title',
                'about_vision_description',
                'about_mission_title',
                'about_mission_description',
            ]);
        });
    }
};
