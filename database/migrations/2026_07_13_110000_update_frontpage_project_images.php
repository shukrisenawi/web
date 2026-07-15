<?php

use App\Models\FrontpageContent;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $content = FrontpageContent::getCurrent();
        $projects = $content->projects ?? [];

        $imageMap = [
            'FinTrack Dashboard' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            'E-Commerce Platform' => 'https://images.unsplash.com/photo-1472851294608-4151b6653fbb?auto=format&fit=crop&w=800&q=80',
            'Healthcare Portal' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
            'SaaS Analytics Tool' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        ];

        foreach ($projects as $key => $project) {
            if (isset($imageMap[$project['title']])) {
                $projects[$key]['image'] = $imageMap[$project['title']];
            }
        }

        $content->update(['projects' => $projects]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reversible manually through the admin if needed.
    }
};
