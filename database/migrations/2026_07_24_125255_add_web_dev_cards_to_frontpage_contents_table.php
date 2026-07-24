<?php

use App\Models\FrontpageContent;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $content = FrontpageContent::first();
        if (! $content) return;

        $heroKeys = ['services_hero', 'web_development_hero', 'web_system_hero', 'game_development_hero', 'it_equipment_hero'];
        $defaults = FrontpageContent::defaultRecord();

        foreach ($heroKeys as $key) {
            $hero = $content->{$key} ?? [];
            if (! isset($hero['cards']) && isset($defaults[$key]['cards'])) {
                $hero['cards'] = $defaults[$key]['cards'];
                $content->update([$key => $hero]);
            }
        }
    }

    public function down(): void
    {
        $content = FrontpageContent::first();
        if (! $content) return;

        foreach (['services_hero', 'web_development_hero', 'web_system_hero', 'game_development_hero', 'it_equipment_hero'] as $key) {
            $hero = $content->{$key} ?? [];
            if (isset($hero['cards'])) {
                unset($hero['cards']);
                $content->update([$key => $hero]);
            }
        }
    }
};
