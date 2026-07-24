<?php

use App\Models\FrontpageContent;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $content = FrontpageContent::first();
        if (! $content) return;

        $servicesHero = $content->services_hero ?? [];
        $cards = [
            ['icon' => 'Code', 'title' => 'Modern Technology', 'description' => 'We use the latest tools and frameworks.'],
            ['icon' => 'Rocket', 'title' => 'Scalable Solutions', 'description' => 'Built to grow with your business.'],
            ['icon' => 'ShieldCheck', 'title' => 'Reliable Support', 'description' => '24/7 support to keep you moving forward.'],
        ];

        if (! isset($servicesHero['cards'])) {
            $servicesHero['cards'] = $cards;
            $content->update(['services_hero' => $servicesHero]);
        }
    }

    public function down(): void
    {
        $content = FrontpageContent::first();
        if (! $content) return;

        $servicesHero = $content->services_hero ?? [];
        if (isset($servicesHero['cards'])) {
            unset($servicesHero['cards']);
            $content->update(['services_hero' => $servicesHero]);
        }
    }
};
