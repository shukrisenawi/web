import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';

interface Promotion {
    label: string;
    title: string;
    discount: string;
    unit: string;
    desc: string;
    features: string[];
    image: string;
    cta: string;
    variant: string;
}

const defaultPromotions: Promotion[] = [
    {
        label: 'MOST POPULAR',
        title: 'Website Package',
        discount: '20%',
        unit: 'OFF',
        desc: 'Get a professional website with modern design and fast performance.',
        features: ['Custom Design', 'Responsive Layout', 'Basic SEO'],
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
        cta: 'Request Quotation',
        variant: 'blue',
    },
    {
        label: 'LIMITED TIME',
        title: 'Mobile App Package',
        discount: '15%',
        unit: 'OFF',
        desc: 'Build your mobile app and reach your customers anywhere.',
        features: ['iOS & Android', 'UI/UX Design', 'App Deployment'],
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80',
        cta: 'Request Quotation',
        variant: 'indigo',
    },
    {
        label: 'NEW CLIENTS ONLY',
        title: 'Digital Marketing',
        discount: '10%',
        unit: 'OFF',
        desc: 'Kickstart your brand growth with effective digital marketing.',
        features: ['Social Media Marketing', 'Google Ads Setup', 'Monthly Reporting'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
        cta: 'Request Quotation',
        variant: 'emerald',
    },
    {
        label: 'BUNDLE OFFER',
        title: 'Complete Digital Solution',
        discount: '25%',
        unit: 'OFF',
        desc: 'Get website, system and marketing in one complete package.',
        features: ['Web Development', 'Web System', 'Digital Marketing'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
        cta: 'Request Quotation',
        variant: 'blue',
    },
];

export function Promotions() {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};
    const promotions = (c.promotions || defaultPromotions) as Promotion[];

    return (
        <section className="bg-slate-50 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-sm">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Promotions</p>
                        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                            {c.promotions_title || 'Special Offers for Your Business'}
                        </h2>
                    </div>
                    <p className="max-w-md text-sm text-slate-600">
                        {c.promotions_subtitle || 'Take advantage of our limited-time offers and boost your digital presence today.'}
                    </p>
                    <Link href="/services" className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1 hover:underline">
                        View All Promotions
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {promotions.map((promo: Promotion, idx: number) => (
                        <div
                            key={promo.title + idx}
                            className={`relative flex flex-col overflow-hidden rounded-3xl text-white shadow-lg transition hover:-translate-y-1 ${
                                promo.variant === 'emerald' ? 'bg-emerald-900' : promo.variant === 'indigo' ? 'bg-indigo-900' : 'bg-[#0B1120]'
                            }`}
                        >
                            <div className="p-6">
                                <span
                                    className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                        promo.variant === 'emerald'
                                            ? 'bg-emerald-500/20 text-emerald-300'
                                            : promo.variant === 'indigo'
                                                ? 'bg-indigo-500/20 text-indigo-300'
                                                : 'bg-blue-500/20 text-blue-300'
                                    }`}
                                >
                                    {promo.label}
                                </span>
                                <h3 className="mt-4 text-lg font-semibold leading-tight">{promo.title}</h3>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold">{promo.discount}</span>
                                    <span className="text-lg font-semibold">{promo.unit}</span>
                                </div>
                                <p className="mt-3 text-sm text-white/70">{promo.desc}</p>
                                <ul className="mt-4 space-y-2">
                                    {promo.features.map((feature: string) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-white/80">
                                            <Check className="h-4 w-4 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/contact"
                                    className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
                                        promo.variant === 'emerald'
                                            ? 'bg-emerald-500 hover:bg-emerald-600'
                                            : promo.variant === 'indigo'
                                                ? 'bg-indigo-500 hover:bg-indigo-600'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {promo.cta}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="mt-auto h-40 overflow-hidden">
                                <img src={promo.image} alt={promo.title} className="h-full w-full object-cover opacity-60" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
