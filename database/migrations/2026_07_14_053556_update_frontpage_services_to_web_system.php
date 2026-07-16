<?php

use App\Models\FrontpageContent;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $content = FrontpageContent::first();

        if ($content) {
            $services = [
                ['icon' => 'Globe', 'title' => 'Web Development', 'description' => 'High-performance websites and web applications built with modern technologies.', 'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Smartphone', 'title' => 'Mobile Apps', 'description' => 'Native and cross-platform mobile applications that users love.', 'image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Code', 'title' => 'Web System', 'description' => 'Secure, scalable, and high-performance web systems tailored to your business processes.', 'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'TrendingUp', 'title' => 'Digital Marketing', 'description' => 'Data-driven strategies to grow your audience and increase conversions.', 'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Gamepad2', 'title' => 'Game Development', 'description' => 'Engaging, high-quality games that captivate players and deliver unforgettable experiences across all platforms.', 'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Printer', 'title' => 'IT Equipment Supply & Setup', 'description' => 'High-quality IT equipment supply and professional setup to get your business running smoothly.', 'image' => 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80'],
            ];

            $content->update(['services' => $services]);
        }
    }

    public function down(): void
    {
        $content = FrontpageContent::first();

        if ($content) {
            $services = [
                ['icon' => 'Globe', 'title' => 'Web Development', 'description' => 'High-performance websites and web applications built with modern technologies.', 'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Smartphone', 'title' => 'Mobile Apps', 'description' => 'Native and cross-platform mobile applications that users love.', 'image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Palette', 'title' => 'UI/UX Design', 'description' => 'User-centered design that makes your product intuitive and delightful.', 'image' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'TrendingUp', 'title' => 'Digital Marketing', 'description' => 'Data-driven strategies to grow your audience and increase conversions.', 'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Gamepad2', 'title' => 'Game Development', 'description' => 'Engaging, high-quality games that captivate players and deliver unforgettable experiences across all platforms.', 'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Printer', 'title' => 'IT Equipment Supply & Setup', 'description' => 'High-quality IT equipment supply and professional setup to get your business running smoothly.', 'image' => 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80'],
            ];

            $content->update(['services' => $services]);
        }
    }
};
