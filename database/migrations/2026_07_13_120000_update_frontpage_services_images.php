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
        $services = $content->services ?? [];

        $imageMap = [
            'Web Development' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
            'Mobile Apps' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
            'UI/UX Design' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
            'Digital Marketing' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            'Cloud Solutions' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
            'Cybersecurity' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        ];

        foreach ($services as $key => $service) {
            if (isset($imageMap[$service['title']]) && empty($service['image'])) {
                $services[$key]['image'] = $imageMap[$service['title']];
            }
        }

        $content->update(['services' => $services]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
