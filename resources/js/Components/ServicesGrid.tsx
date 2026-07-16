import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, ArrowUpRight, Globe, Smartphone, Palette, TrendingUp, Gamepad2, Shield, Code, Megaphone, BarChart, Layers, Monitor, Printer } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
    Globe,
    Smartphone,
    Palette,
    TrendingUp,
    Gamepad2,
    Shield,
    Code,
    Megaphone,
    BarChart,
    Layers,
    Monitor,
    Printer,
};

const colorClasses = [
    { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    { color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
];

interface ServicesGridProps {
    showAll?: boolean;
}

const servicesData: Record<string, { description: string; content: string; image: string }> = {
    'web-development': {
        description: 'High-performance websites and web applications built with modern technologies.',
        content: 'We build responsive, fast and secure websites that represent your brand and convert visitors into customers. From marketing sites to complex web applications, our development process focuses on performance, accessibility and user experience.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    },
    'mobile-apps': {
        description: 'Native and cross-platform mobile applications that users love.',
        content: 'Our mobile app team creates intuitive iOS and Android applications that deliver great user experiences. We handle everything from user research and design to development, testing and app store deployment.',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    },
    'web-system': {
        description: 'Secure, scalable, and high-performance web systems tailored to your business processes.',
        content: 'We build custom web systems that power your business operations. From internal management platforms to customer portals, our solutions are secure, scalable and optimized for performance.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    },
    'digital-marketing': {
        description: 'Data-driven strategies to grow your audience and increase conversions.',
        content: 'We develop digital marketing strategies that align with your business objectives. From SEO and content marketing to paid advertising and analytics, we help you reach the right audience and measure real results.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    },
    'game-development': {
        description: 'Engaging, high-quality games that captivate players and deliver unforgettable experiences across all platforms.',
        content: 'We create engaging, high-quality games that captivate players and deliver unforgettable experiences across all platforms. From concept and art to development and launch, we handle the full game production pipeline.',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    },
    'it-equipment-supply-setup': {
        description: 'High-quality IT equipment supply and professional setup to get your business running smoothly.',
        content: 'We supply high-quality IT equipment and provide professional setup and configuration to get your business running smoothly. From laptops and desktops to networking devices and printers, we deliver end-to-end solutions.',
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80',
    },
};

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function ServicesGrid({ showAll = false }: ServicesGridProps) {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};
    const services = (c.services || []);

    return (
        <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">What We Do</p>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{c.services_title || 'Services We Provide'}</h2>
                    </div>
                    {!showAll && (
                        <div className="max-w-sm">
                            <p className="text-sm text-slate-600">
                                {c.services_subtitle || 'End-to-end digital solutions to help your business succeed in the digital world.'}
                            </p>
                        </div>
                    )}
                    <Link href="/services" className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1 hover:underline">
                        View All Services
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {services.map((service: any, idx: number) => {
                        const Icon = iconMap[service.icon] || Globe;
                        const style = colorClasses[idx % colorClasses.length];
                        const slug = slugify(service.title);
                        return (
                            <Link
                                key={service.title + idx}
                                href={`/services/${slug}`}
                                className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex flex-1 flex-col">
                                    <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${style.bg} ${style.border}`}>
                                        <Icon className={`h-5 w-5 ${style.color}`} />
                                    </div>
                                    <h3 className="text-base font-semibold leading-tight text-slate-900">{service.title}</h3>
                                    <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600">{service.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-blue-600">Learn More</span>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-100 bg-white text-blue-600 transition-colors group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export { servicesData, slugify };
