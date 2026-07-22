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
            $table->string('about_team_title')->nullable()->after('social_links');
            $table->text('about_team_subtitle')->nullable()->after('about_team_title');
            $table->json('about_team')->nullable()->after('about_team_subtitle');
            $table->string('about_events_title')->nullable()->after('about_team');
            $table->text('about_events_subtitle')->nullable()->after('about_events_title');
            $table->json('about_events')->nullable()->after('about_events_subtitle');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->dropColumn([
                'about_team_title',
                'about_team_subtitle',
                'about_team',
                'about_events_title',
                'about_events_subtitle',
                'about_events',
            ]);
        });
    }
};
