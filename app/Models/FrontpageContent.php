<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FrontpageContent extends Model
{
    /** @use HasFactory<\Database\Factories\FrontpageContentFactory> */
    use HasFactory;

    protected $table = 'frontpage_contents';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'services' => 'array',
            'projects' => 'array',
            'stats' => 'array',
            'clients' => 'array',
            'social_links' => 'array',
        ];
    }

    public static function defaultRecord(): array
    {
        return [
            'hero_badge' => 'Digital solutions that drive growth',
            'hero_title' => "We build digital products that move your business forward.",
            'hero_subtitle' => 'Kenju Tech helps businesses grow with modern websites, powerful applications and digital strategies that deliver results.',
            'hero_primary_cta' => 'Explore Services',
            'hero_primary_link' => '/services',
            'hero_secondary_cta' => 'View Our Work',
            'hero_secondary_link' => '/work',
            'hero_trusted_text' => 'Trusted by 100+ clients',
            'hero_trusted_subtext' => 'from startups to enterprise',
            'hero_image' => '/images/hero.png',
            'services_title' => 'Services We Provide',
            'services_subtitle' => 'From strategy to deployment, we deliver end-to-end digital solutions tailored to your business goals.',
            'services' => [
                ['icon' => 'Globe', 'title' => 'Web Development', 'description' => 'High-performance websites and web applications built with modern technologies.', 'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Smartphone', 'title' => 'Mobile Apps', 'description' => 'Native and cross-platform mobile applications that users love.', 'image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Code', 'title' => 'Web System', 'description' => 'Secure, scalable, and high-performance web systems tailored to your business processes.', 'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'TrendingUp', 'title' => 'Digital Marketing', 'description' => 'Data-driven strategies to grow your audience and increase conversions.', 'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Gamepad2', 'title' => 'Game Development', 'description' => 'Engaging, high-quality games that captivate players and deliver unforgettable experiences across all platforms.', 'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'],
                ['icon' => 'Printer', 'title' => 'IT Equipment Supply & Setup', 'description' => 'High-quality IT equipment supply and professional setup to get your business running smoothly.', 'image' => 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80'],
            ],
            'projects_title' => 'Featured Work',
            'projects_subtitle' => 'A selection of projects that showcase our expertise across industries.',
            'projects' => [
                ['title' => 'FinTrack Dashboard', 'category' => 'Fintech', 'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 'link' => '/work'],
                ['title' => 'E-Commerce Platform', 'category' => 'Retail', 'image' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80', 'link' => '/work'],
                ['title' => 'Healthcare Portal', 'category' => 'Healthcare', 'image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', 'link' => '/work'],
                ['title' => 'SaaS Analytics Tool', 'category' => 'SaaS', 'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 'link' => '/work'],
            ],
            'clients_title' => 'GREAT COMPANIES',
            'clients' => [
                ['name' => 'AirAsia', 'logo' => '/images/logos/airasia.png'],
                ['name' => 'Maybank', 'logo' => '/images/logos/maybank.jpg'],
                ['name' => 'Grab', 'logo' => '/images/logos/grab.jpg'],
                ['name' => 'Lazada', 'logo' => '/images/logos/lazada.png'],
                ['name' => 'Shopee', 'logo' => '/images/logos/shopee.png'],
            ],
            'stats' => [
                ['value' => '150+', 'label' => 'Projects Delivered'],
                ['value' => '98%', 'label' => 'Client Satisfaction'],
                ['value' => '12+', 'label' => 'Years Experience'],
                ['value' => '24/7', 'label' => 'Support Available'],
            ],
            'cta_title' => "Let's build something great together.",
            'cta_subtitle' => 'Have a project in mind? Let\'s talk about how we can help you achieve your goals.',
            'cta_button' => 'Start a New Project',
            'cta_link' => '/contact',
            'footer_tagline' => 'Building digital products that move your business forward.',
            'social_links' => [
                ['name' => 'Twitter', 'url' => 'https://twitter.com'],
                ['name' => 'LinkedIn', 'url' => 'https://linkedin.com'],
                ['name' => 'GitHub', 'url' => 'https://github.com'],
                ['name' => 'Instagram', 'url' => 'https://instagram.com'],
            ],
        ];
    }

    public static function getCurrent(): self
    {
        return self::query()->firstOrCreate([], self::defaultRecord());
    }
}
