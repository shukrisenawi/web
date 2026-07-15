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

        foreach ($projects as $key => $project) {
            if ($project['title'] === 'E-Commerce Platform') {
                $projects[$key]['image'] = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80';
            }
        }

        $content->update(['projects' => $projects]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
