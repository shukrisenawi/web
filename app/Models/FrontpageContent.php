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
            'about_team' => 'array',
            'about_events' => 'array',
            'payment_logo' => 'string',
            'hero_avatars' => 'array',
            'home_hero' => 'array',
            'services_hero' => 'array',
            'web_development_hero' => 'array',
            'mobile_apps_hero' => 'array',
            'web_system_hero' => 'array',
            'digital_marketing_hero' => 'array',
            'game_development_hero' => 'array',
            'it_equipment_hero' => 'array',
            'work_hero' => 'array',
            'about_hero' => 'array',
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
            'hero_avatars' => [
                ['image' => 'https://i.pravatar.cc/150?img=11'],
                ['image' => 'https://i.pravatar.cc/150?img=12'],
                ['image' => 'https://i.pravatar.cc/150?img=13'],
            ],
            'home_hero' => [
                'badge' => 'Digital solutions that drive growth',
                'title' => "We build digital products that move your business forward.",
                'subtitle' => 'Kenju Tech helps businesses grow with modern websites, powerful applications and digital strategies that deliver results.',
                'image' => '/images/hero.png',
                'primary_cta' => 'Explore Services',
                'primary_link' => '/services',
                'secondary_cta' => 'View Our Work',
                'secondary_link' => '/work',
                'trusted_text' => 'Trusted by 100+ clients',
                'trusted_subtext' => 'from startups to enterprise',
            ],
            'services_hero' => [
                'badge' => 'Our Services',
                'title' => 'Digital Solutions Built for Growth',
                'subtitle' => 'We help businesses of all sizes leverage technology to solve problems, engage customers, and accelerate growth.',
                'image' => '/images/hero.png',
                'cards' => [
                    ['icon' => 'Code', 'title' => 'Modern Technology', 'description' => 'We use the latest tools and frameworks.'],
                    ['icon' => 'Rocket', 'title' => 'Scalable Solutions', 'description' => 'Built to grow with your business.'],
                    ['icon' => 'ShieldCheck', 'title' => 'Reliable Support', 'description' => '24/7 support to keep you moving forward.'],
                ],
            ],
            'web_development_hero' => [
                'badge' => 'Web Development',
                'title' => 'High-Performance Websites \u0026 Web Applications',
                'subtitle' => 'We build responsive, fast and secure websites that represent your brand and convert visitors into customers.',
                'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format\u0026fit=crop\u0026w=1200\u0026q=80',
                'cards' => [
                    ['icon' => 'Palette', 'title' => 'Modern Design', 'description' => 'Beautiful & user-friendly'],
                    ['icon' => 'Zap', 'title' => 'Optimized Performance', 'description' => 'Fast loading & SEO ready'],
                    ['icon' => 'Shield', 'title' => 'Secure & Reliable', 'description' => 'Built with best practices'],
                ],
            ],
            'mobile_apps_hero' => [
                'badge' => 'Mobile Apps',
                'title' => 'Native \u0026 Cross-Platform Mobile Applications',
                'subtitle' => 'Our mobile app team creates intuitive iOS and Android applications that deliver great user experiences.',
                'image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format\u0026fit=crop\u0026w=1200\u0026q=80',
                'primary_cta' => 'Request Quotation',
                'primary_link' => '/request',
                'secondary_cta' => 'View Our Work',
                'secondary_link' => '/work',
                'trusted_text' => 'Trusted by 100+ clients',
                'trusted_subtext' => 'from startups to enterprise',
            ],
            'web_system_hero' => [
                'badge' => 'Web System',
                'title' => 'Secure, Scalable Web Systems',
                'subtitle' => 'We build custom web systems that power your business operations.',
                'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format\u0026fit=crop\u0026w=1200\u0026q=80',
                'cards' => [
                    ['icon' => 'Code', 'title' => 'Scalable & Flexible', 'description' => 'Built to grow with your business.'],
                    ['icon' => 'Shield', 'title' => 'Secure & Reliable', 'description' => 'Best practices for security and stability.'],
                    ['icon' => 'Zap', 'title' => 'High Performance', 'description' => 'Optimized for speed and efficiency.'],
                ],
            ],
            'digital_marketing_hero' => [
                'badge' => 'Digital Marketing',
                'title' => 'Data-Driven Strategies That Convert',
                'subtitle' => 'We develop digital marketing strategies that align with your business objectives.',
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format\u0026fit=crop\u0026w=1200\u0026q=80',
            ],
            'game_development_hero' => [
                'badge' => 'Game Development',
                'title' => 'Engaging Games Across All Platforms',
                'subtitle' => 'We create engaging, high-quality games that captivate players and deliver unforgettable experiences.',
                'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format\u0026fit=crop\u0026w=1200\u0026q=80',
                'cards' => [
                    ['icon' => 'Gamepad2', 'title' => 'Multi-Platform', 'description' => 'PC, Console, Mobile & VR'],
                    ['icon' => 'Palette', 'title' => 'Stunning Visuals', 'description' => 'Immersive art & animation'],
                    ['icon' => 'Zap', 'title' => 'High Performance', 'description' => 'Smooth gameplay at scale'],
                ],
            ],
            'it_equipment_hero' => [
                'badge' => 'IT Equipment',
                'title' => 'IT Equipment Supply \u0026 Professional Setup',
                'subtitle' => 'We supply high-quality IT equipment and provide professional setup and configuration.',
                'image' => 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format\u0026fit=crop\u0026w=1200\u0026q=80',
                'cards' => [
                    ['icon' => 'Shield', 'title' => 'Genuine Products', 'description' => '100% original and warranty included'],
                    ['icon' => 'Settings', 'title' => 'Expert Setup', 'description' => 'Professional installation and configuration'],
                    ['icon' => 'Headphones', 'title' => 'After-Sales Support', 'description' => 'Reliable support when you need it'],
                ],
            ],
            'work_hero' => [
                'badge' => 'Our Work',
                'title' => 'Real Solutions. Real Results.',
                'subtitle' => 'We take pride in building digital solutions that make a difference.',
                'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format\u0026fit=crop\u0026w=1200\u0026q=80',
            ],
            'about_hero' => [
                'badge' => 'About Us',
                'title' => 'Building Digital Solutions That Matter',
                'subtitle' => 'Kenju Tech was founded with a simple mission: to help businesses grow through technology.',
                'image' => '/images/hero.png',
            ],
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
            'cta_link' => '/request',
            'footer_tagline' => 'Building digital products that move your business forward.',
            'payment_logo' => '/images/logo-gambar.png',
            'bank_name' => 'MAYBANK BERHAD',
            'bank_account_name' => 'KENJU TECH SDN. BHD.',
            'bank_account_number' => '5622 4512 3456',
            'social_links' => [
                ['name' => 'Twitter', 'url' => 'https://twitter.com'],
                ['name' => 'LinkedIn', 'url' => 'https://linkedin.com'],
                ['name' => 'GitHub', 'url' => 'https://github.com'],
                ['name' => 'Instagram', 'url' => 'https://instagram.com'],
            ],
            'about_team_title' => 'Our Team',
            'about_team_subtitle' => 'Meet The People Behind Kenju Tech',
            'about_team' => [
                ['name' => 'Kenji Tan', 'role' => 'Founder & CEO', 'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'],
                ['name' => 'Alicia Chong', 'role' => 'UI/UX Designer', 'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'],
                ['name' => 'Marcus Lim', 'role' => 'Lead Developer', 'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'],
                ['name' => 'Nurul Afiqah', 'role' => 'Project Manager', 'image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80'],
                ['name' => 'Daniel Ariff', 'role' => 'Backend Developer', 'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'],
            ],
            'about_events_title' => 'Events',
            'about_events_subtitle' => 'Where We Connect and Grow',
            'about_events' => [
                ['day' => '15', 'month' => 'MAY', 'title' => 'Tech in Motion Summit 2025', 'description' => 'We shared insights on building scalable web applications.', 'location' => 'Kuala Lumpur, Malaysia', 'image' => 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=600&q=80'],
                ['day' => '24', 'month' => 'APR', 'title' => 'UI/UX Design Workshop', 'description' => 'A hands-on workshop on user-centered design principles.', 'location' => 'Petaling Jaya, Malaysia', 'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80'],
                ['day' => '10', 'month' => 'MAR', 'title' => 'Startup Meetup KL', 'description' => 'Connecting with founders and sharing our startup journey.', 'location' => 'Kuala Lumpur, Malaysia', 'image' => 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80'],
                ['day' => '20', 'month' => 'FEB', 'title' => 'Digital Growth Conference', 'description' => 'Exploring digital strategies for business growth in 2025 and beyond.', 'location' => 'Kuala Lumpur, Malaysia', 'image' => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80'],
            ],
        ];
    }

    public static function getCurrent(): self
    {
        return self::query()->firstOrCreate([], self::defaultRecord());
    }
}
