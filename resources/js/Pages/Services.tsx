import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, Code, Rocket, ShieldCheck, type LucideIcon } from 'lucide-react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { Clients } from '@/Components/Clients';
import { ServicesGrid } from '@/Components/ServicesGrid';
import { HeroBackground } from '@/Components/HeroBackground';

const promotions = [
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

const iconMap: Record<string, LucideIcon> = {
    Code: Code,
    Rocket: Rocket,
    ShieldCheck: ShieldCheck,
};

function ServiceIcon({ name }: { name: string }) {
    const Icon = iconMap[name];
    if (!Icon) return null;
    return <Icon className="h-5 w-5" />;
}

export default function Services() {
    const { frontpage } = usePage().props as any;
    const h = frontpage?.services_hero ?? {};
    const cards = h.cards ?? [];

    return (
        <>
            <Head title="Services" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden bg-[#050914] text-white">
                    <HeroBackground />

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
                            <div className="max-w-xl">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-500">{h.badge || 'Our Services'}</span>
                                <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
                                    {h.title || <>Digital Solutions Built for <span className="text-blue-500">Growth</span></>}
                                </h1>
                                <p className="mt-5 text-base leading-relaxed text-slate-300">
                                    {h.subtitle || 'We help businesses of all sizes leverage technology to solve problems, engage customers, and accelerate growth.'}
                                </p>

                                {cards.length > 0 && (
                                    <div className="mt-10 grid grid-cols-3 gap-4">
                                        {cards.map((card: any, idx: number) => (
                                            <div key={card.title || idx} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                                                    <ServiceIcon name={card.icon} />
                                                </div>
                                                <h3 className="mt-3 text-sm font-semibold">{card.title}</h3>
                                                <p className="mt-1 text-xs text-slate-400">{card.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative flex items-center justify-center">
                                <div className="relative w-full max-w-2xl">
                                    <img
                                        src={h.image || '/images/hero.png'}
                                        alt="Digital solutions illustration"
                                        className="relative z-10 w-full rounded-2xl shadow-2xl shadow-blue-900/20"
                                    />
                                    <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
                                    <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-600/20 blur-3xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <ServicesGrid showAll />

                {/* Promotions */}
                <section className="bg-slate-50 py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-sm">
                                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Promotions</p>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Special Offers for Your Business</h2>
                            </div>
                            <p className="max-w-md text-sm text-slate-600">Take advantage of our limited-time offers and boost your digital presence today.</p>
                            <Link href="/services" className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1 hover:underline">
                                View All Promotions
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {promotions.map((promo) => (
                                <div
                                    key={promo.title}
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
                                            {promo.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-2 text-sm text-white/80">
                                                    <Check className="h-4 w-4 shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href="/request"
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

                <Clients />

                {/* CTA */}
                <section className="py-12 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-3xl bg-[#0B1120] px-8 py-12 text-white md:px-16 md:py-16">
                            <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                                <div className="max-w-lg">
                                    <h2 className="text-3xl font-bold">
                                        Need a <span className="text-blue-500">custom solution</span> for your business?
                                    </h2>
                                    <p className="mt-3 text-sm text-slate-300">
                                        Let{'\u0027'}s discuss how we can help you achieve your goals with the right digital strategies.
                                    </p>
                                </div>
                                <Link
                                    href="/request"
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                                >
                                    Request Quotation
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
                        </div>
                    </div>
                </section>

                <LandingFooter mode="dark" />
            </div>
        </>
    );
}
