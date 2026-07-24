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
            $table->json('home_hero')->nullable()->after('hero_avatars');
            $table->json('services_hero')->nullable()->after('home_hero');
            $table->json('web_development_hero')->nullable()->after('services_hero');
            $table->json('mobile_apps_hero')->nullable()->after('web_development_hero');
            $table->json('web_system_hero')->nullable()->after('mobile_apps_hero');
            $table->json('digital_marketing_hero')->nullable()->after('web_system_hero');
            $table->json('game_development_hero')->nullable()->after('digital_marketing_hero');
            $table->json('it_equipment_hero')->nullable()->after('game_development_hero');
            $table->json('work_hero')->nullable()->after('it_equipment_hero');
            $table->json('about_hero')->nullable()->after('work_hero');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->dropColumn([
                'home_hero',
                'services_hero',
                'web_development_hero',
                'mobile_apps_hero',
                'web_system_hero',
                'digital_marketing_hero',
                'game_development_hero',
                'it_equipment_hero',
                'work_hero',
                'about_hero',
            ]);
        });
    }
};
