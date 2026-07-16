import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Globe, Smartphone, TrendingUp, Shield, Code, Megaphone, BarChart, Layers, Monitor, Cloud } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
    Globe,
    Smartphone,
    TrendingUp,
    Shield,
    Code,
    Megaphone,
    BarChart,
    Layers,
    Monitor,
    Cloud,
};

const colorClasses = [
    { color: 'text-blue-600', bg: 'bg-blue-50' },
    { color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { color: 'text-amber-600', bg: 'bg-amber-50' },
    { color: 'text-rose-600', bg: 'bg-rose-50' },
    { color: 'text-cyan-600', bg: 'bg-cyan-50' },
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
    'cloud-solutions': {
        description: 'Scalable cloud infrastructure and DevOps practices for reliability.',
        content: 'We design and manage scalable cloud infrastructure that keeps your applications reliable and cost-effective. From architecture and migration to CI/CD and monitoring, our DevOps practices help your team deploy faster and recover quickly.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    },
    'cybersecurity': {
        description: 'Protect your business with modern security assessments and best practices.',
        content: 'We help protect your business with practical security assessments, hardening guidance and best practices. From vulnerability reviews to staff awareness, our approach makes security manageable for growing teams.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
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

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(showAll ? services : services).map((service: any, idx: number) => {
                        const Icon = iconMap[service.icon] || Globe;
                        const style = colorClasses[idx % colorClasses.length];
                        const slug = slugify(service.title);
                        const image = service.image || servicesData[slug]?.image;
                        return (
                            <Link
                                key={service.title + idx}
                                href={`/services/${slug}`}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img
                                        src={image}
                                        alt={service.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                                    <p className="mt-2 flex-1 text-sm text-slate-600">{service.description}</p>
                                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                                        Learn More
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
