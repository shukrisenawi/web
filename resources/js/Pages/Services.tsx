import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowRight, Check, Code, Rocket, ShieldCheck } from 'lucide-react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const promotions = [
    {
        label: 'MOST POPULAR',
        title: 'Website Package',
        discount: '20%',
        unit: 'OFF',
        desc: 'Get a professional website with modern design and fast performance.',
        features: ['Custom Design', 'Responsive Layout', 'Basic SEO'],
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
        cta: 'Get This Deal',
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
        cta: 'Get This Deal',
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
        cta: 'Get This Deal',
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
        cta: 'Get This Deal',
        variant: 'blue',
    },
];

function ClientLogo({ name, logo }: { name: string; logo: string }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <span className="text-lg font-bold tracking-tight text-slate-900">
                {name}
            </span>
        );
    }

    return (
        <img
            src={logo}
            alt={name}
            onError={() => setFailed(true)}
            className="h-9 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
        />
    );
}

export default function Services() {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};
    const services = c.services || [];

    return (
        <>
            <Head title="Services" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden bg-[#050914] text-white">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
                        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
                        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
                            <div className="max-w-xl">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-500">Our Services</span>
                                <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
                                    Digital Solutions Built for <span className="text-blue-500">Growth</span>
                                </h1>
                                <p className="mt-5 text-base leading-relaxed text-slate-300">
                                    We help businesses of all sizes leverage technology to solve problems, engage customers, and accelerate growth.
                                </p>

                                <div className="mt-10 grid grid-cols-3 gap-4">
                                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                                            <Code className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-3 text-sm font-semibold">Modern Technology</h3>
                                        <p className="mt-1 text-xs text-slate-400">We use the latest tools and frameworks.</p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                                            <Rocket className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-3 text-sm font-semibold">Scalable Solutions</h3>
                                        <p className="mt-1 text-xs text-slate-400">Built to grow with your business.</p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-3 text-sm font-semibold">Reliable Support</h3>
                                        <p className="mt-1 text-xs text-slate-400">24/7 support to keep you moving forward.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-center">
                                <div className="relative w-full max-w-2xl">
                                    <img
                                        src="/images/hero.png"
                                        alt="Digital solutions illustration"
                                        className="relative z-10 w-full rounded-2xl shadow-2xl shadow-blue-900/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-20 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">What We Do</p>
                                <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Our Services</h2>
                            </div>
                            <p className="max-w-md text-sm text-slate-600">
                                {c.services_subtitle || 'End-to-end digital solutions to help your business succeed in the digital world.'}
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service: any, idx: number) => {
                                const slug = slugify(service.title);
                                return (
                                    <Link
                                        key={service.title + idx}
                                        href={`/services/${slug}`}
                                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="aspect-[16/10] overflow-hidden">
                                            <img
                                                src={service.image}
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

                {/* Clients */}
                <section className="border-y border-slate-100 bg-white py-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                            <div className="text-center md:text-left">
                                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Trusted By</p>
                                <p className="font-bold text-slate-900">GREAT COMPANIES</p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                                {(c.clients || []).map((client: any, idx: number) => {
                                    const name = client?.name || client;
                                    const logo = client?.logo || null;
                                    return logo ? (
                                        <ClientLogo key={name + idx} name={name} logo={logo} />
                                    ) : (
                                        <span
                                            key={name + idx}
                                            className="text-lg font-bold tracking-tight text-slate-900"
                                        >
                                            {name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

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
                                    href="/contact"
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                                >
                                    Let's Talk
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
