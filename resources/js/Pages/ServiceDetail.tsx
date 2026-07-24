import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Calendar,
    Check,
    Code,
    Cpu,
    Database,
    DollarSign,
    FileText,
    Filter,
    Gamepad2,
    Globe,
    Headphones,
    Layers,
    Lightbulb,
    LineChart,
    Megaphone,
    MessageCircle,
    Palette,
    Printer,
    Rocket,
    ScanLine,
    Search,
    Server,
    Settings,
    Shield,
    ShieldCheck,
    Smartphone,
    Sparkles,
    TrendingUp,
    Truck,
    Users,
    Wifi,
    Wrench,
    Zap,
} from "lucide-react";
import { LandingHeader } from "@/Layouts/LandingHeader";
import { LandingFooter } from "@/Layouts/LandingFooter";
import { servicesData, slugify } from "@/Components/ServicesGrid";
import { usePage } from "@inertiajs/react";
import { HeroBackground } from "@/Components/HeroBackground";

interface ServiceDetailProps {
    slug: string;
}

export default function ServiceDetail({ slug }: ServiceDetailProps) {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};
    const services = c.services || [];
    const service = services.find((s: any) => slugify(s.title) === slug);
    const extra = servicesData[slug];

    const isDigitalMarketing = slug === "digital-marketing";
    const isWebSystem = slug === "web-system";
    const isMobileApps = slug === "mobile-apps";
    const isWebDevelopment = slug === "web-development";
    const isCloudSolutions = slug === "cloud-solutions";
    const isCybersecurity = slug === "cybersecurity";

    if (!service || !extra) {
        return (
            <>
                <Head title="Service Not Found" />
                <div className="min-h-screen bg-white">
                    <LandingHeader />
                    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                        <h1 className="text-4xl font-bold text-slate-900">
                            Service Not Found
                        </h1>
                        <p className="mt-4 text-slate-600">
                            The service you are looking for does not exist.
                        </p>
                        <Link
                            href="/services"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Services
                        </Link>
                    </div>
                    <LandingFooter mode="dark" />
                </div>
            </>
        );
    }

    if (isDigitalMarketing) {
        return <DigitalMarketingDetail service={service} />;
    }

    if (isWebSystem) {
        return <WebSystemDetail service={service} />;
    }

    if (isMobileApps) {
        return <MobileAppsDetail service={service} />;
    }

    if (isWebDevelopment) {
        return <WebDevelopmentDetail service={service} />;
    }

    const isGameDevelopment = slug === "game-development";
    const isITEquipment = slug === "it-equipment-supply-setup";

    if (isGameDevelopment) {
        return <GameDevelopmentDetail service={service} />;
    }

    if (isITEquipment) {
        return <ITEquipmentDetail service={service} />;
    }

    const features = [
        "Tailored solutions for your business needs",
        "Modern technology stack and best practices",
        "Scalable architecture for future growth",
        "Ongoing support and maintenance options",
    ];

    return (
        <>
            <Head title={service.title} />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                <div className="relative overflow-hidden bg-[#050914] py-16 text-white sm:py-20">
                    <HeroBackground />
                    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Services
                        </Link>
                        <span className="mt-6 block text-sm font-semibold uppercase tracking-wider text-blue-500">
                            What We Do
                        </span>
                        <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
                            {service.title}
                        </h1>
                        <p className="mt-4 text-lg text-slate-300">
                            {service.description}
                        </p>
                    </div>
                </div>

                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-start">
                            <div className="aspect-[16/10] overflow-hidden rounded-2xl">
                                <img
                                    src={service.image || extra.image}
                                    alt={service.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    About {service.title}
                                </h2>
                                <p className="leading-relaxed text-slate-600">
                                    {extra.content}
                                </p>

                                <ul className="space-y-3">
                                    {features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3"
                                        >
                                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                                <Check className="h-3.5 w-3.5" />
                                            </span>
                                            <span className="text-sm text-slate-700">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                    <Link
                                        href="/request"
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                    >
                                        Request Quotation
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <MarketingCta />

                <LandingFooter />
            </div>
        </>
    );
}

function DigitalMarketingDetail({ service }: { service: any }) {
    const { frontpage } = usePage().props as any;
    const h = frontpage?.digital_marketing_hero ?? {};
    const growthItems = [
        {
            icon: Megaphone,
            title: "Increase Brand Visibility",
            desc: "Reach the right audience across the right channels to build awareness.",
        },
        {
            icon: Users,
            title: "Generate Quality Leads",
            desc: "Attract potential customers and nurture them into loyal clients.",
        },
        {
            icon: TrendingUp,
            title: "Boost Website Traffic",
            desc: "Drive more targeted traffic that leads to engagement and conversions.",
        },
        {
            icon: Filter,
            title: "Improve Conversion Rates",
            desc: "Optimize user experience and campaigns to turn visitors into customers.",
        },
        {
            icon: DollarSign,
            title: "Maximize ROI",
            desc: "Continuous tracking, testing and optimization to get the best results.",
        },
    ];

    const packages = [
        {
            name: "Starter",
            tagline: "Perfect for small businesses getting started online.",
            price: "RM 3,500",
            features: [
                "Social Media Management 8 Posts / Month",
                "Google Ads Management (Up to RM1,500 Ad Spend)",
                "Basic SEO Optimization",
                "Monthly Performance Report",
                "Email Support",
            ],
            popular: false,
        },
        {
            name: "Growth",
            tagline: "Ideal for growing businesses looking for more leads.",
            price: "RM 6,500",
            features: [
                "Social Media Management 16 Posts / Month",
                "Google & Meta Ads Management (Up to RM3,000)",
                "Advanced SEO",
                "Landing Page Optimization",
                "Monthly Performance Report",
                "Priority Support",
            ],
            popular: true,
        },
        {
            name: "Pro",
            tagline: "For businesses that want maximum growth.",
            price: "RM 10,500",
            features: [
                "Social Media Management 30 Posts / Month",
                "Google, Meta, TikTok Ads (Up to RM6,000)",
                "Advanced SEO + Content Strategy",
                "Conversion Rate Optimization",
                "Monthly Strategy Call & Report",
                "Dedicated Account Manager",
            ],
            popular: false,
        },
    ];

    const dataSteps = [
        {
            icon: Database,
            title: "Data Collection",
            desc: "We gather data from your website, ads and multiple marketing channels using Google tools.",
        },
        {
            icon: BarChart3,
            title: "Data Analysis",
            desc: "We analyze user behavior, traffic sources, campaign performance and conversion metrics.",
        },
        {
            icon: Lightbulb,
            title: "Insight Generation",
            desc: "We turn complex data into clear insights and actionable recommendations.",
        },
        {
            icon: Rocket,
            title: "Growth Optimization",
            desc: "We implement strategies, optimize campaigns and continuously improve results.",
        },
    ];

    const dataChecks = [
        "Track user behavior and conversion paths",
        "Monitor campaign performance in real-time",
        "Identify top traffic sources and opportunities",
        "Create custom dashboards with Looker Studio",
        "Provide insights that drive continuous growth",
    ];

    return (
        <>
            <Head title="Digital Marketing Services" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden bg-[#050914] text-white">
                    <HeroBackground />

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
                            <div className="max-w-md">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-500">
                                    {h.badge || 'Our Services'}
                                </span>
                                <h1 className="mt-4 text-[2.85rem] font-bold leading-[1.05] sm:text-[3.45rem] lg:text-[3.6rem]">
                                    {h.title || 'Digital Marketing That Drives Results'}
                                </h1>
                                <p className="mt-5 text-base leading-relaxed text-slate-300">
                                    {h.subtitle || 'Data-driven strategies, creative campaigns and performance optimization to grow your brand, attract the right audience and increase conversions.'}
                                </p>
                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <Link
                                        href={h.primary_link || '/request'}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                    >
                                        {h.primary_cta || 'Request Quotation'}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    {h.secondary_cta && h.secondary_link && (
                                        <Link
                                            href={h.secondary_link}
                                            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                                        >
                                            {h.secondary_cta}
                                        </Link>
                                    )}
                                </div>
                                <div className="mt-10 flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {(h.trusted_avatars || [
                                            { image: 'https://i.pravatar.cc/150?img=11' },
                                            { image: 'https://i.pravatar.cc/150?img=12' },
                                            { image: 'https://i.pravatar.cc/150?img=13' },
                                        ]).map((avatar: any, idx: number) => (
                                            <img
                                                key={`dm-avatar-${avatar.image ? avatar.image.slice(-12) : idx}`}
                                                src={avatar.image || `https://i.pravatar.cc/150?img=${11 + idx}`}
                                                alt="Client"
                                                className="h-10 w-10 rounded-full border-2 border-[#050914] object-cover"
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-semibold">
                                            {h.trusted_text || 'Trusted by 100+ clients'}
                                        </p>
                                        <p className="text-slate-400">
                                            {h.trusted_subtext || 'from startups to enterprise'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative lg:scale-105">
                                <AnalyticsDashboard />
                                <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-blue-600/15 blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-600/15 blur-3xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Growth Strategies */}
                <section className="bg-white py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-12 lg:flex-row">
                            <div className="max-w-sm shrink-0">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    How We Help Your Business Grow
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    We Build Strategies That Deliver Real Growth
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                    Our data-driven approach ensures every
                                    marketing dollar you spend brings measurable
                                    impact.
                                </p>
                            </div>
                            <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                {growthItems.map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-3 text-sm font-semibold text-slate-900">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Packages */}
                <section className="bg-slate-50 py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-[0.42fr_1fr]">
                            <div>
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    Our Packages
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Digital Marketing Packages
                                </h2>
                                <div className="mt-8 rounded-2xl border border-slate-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
                                    <MarketingIllustration />
                                </div>
                            </div>

                            <div className="grid flex-1 gap-4 md:grid-cols-3">
                                {packages.map((pkg) => (
                                    <div
                                        key={pkg.name}
                                        className={`relative flex flex-col rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                                            pkg.popular
                                                ? "border-blue-600 bg-white shadow-md"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >
                                        {pkg.popular && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                                                Most Popular
                                            </span>
                                        )}
                                        <h3 className="text-xl font-semibold text-slate-900">
                                            {pkg.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {pkg.tagline}
                                        </p>
                                        <div className="mt-5 flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-blue-600">
                                                {pkg.price}
                                            </span>
                                            <span className="text-sm text-slate-500">
                                                /month
                                            </span>
                                        </div>
                                        <ul className="mt-6 flex-1 space-y-3">
                                            {pkg.features.map((f, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start gap-3 text-sm text-slate-700"
                                                >
                                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href="/request"
                                            className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                                                pkg.popular
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                                            }`}
                                        >
                                            Request Quotation
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Analysis */}
                <section className="bg-white py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-[0.6fr_1fr]">
                            <div>
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    How We Use Google Data Analysis
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Smarter Decisions With Powerful Data
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                    We use Google Analytics 4, Google Search
                                    Console and Looker Studio to track
                                    performance, understand user behavior and
                                    make data-driven decisions.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    {dataChecks.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-sm text-slate-700"
                                        >
                                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                                <Check className="h-3.5 w-3.5" />
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:p-10">
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                                    {dataSteps.map((step, idx) => (
                                        <div
                                            key={step.title}
                                            className="relative"
                                        >
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <step.icon className="h-7 w-7" />
                                            </div>
                                            <h3 className="mt-4 text-base font-semibold text-slate-900">
                                                {step.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-600">
                                                {step.desc}
                                            </p>
                                            {idx < dataSteps.length - 1 && (
                                                <div className="hidden lg:absolute lg:-right-4 lg:top-7 lg:block">
                                                    <ArrowRight className="h-5 w-5 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <MarketingCta />

                <LandingFooter mode="dark" />
            </div>
        </>
    );
}

function MarketingCta() {
    return (
        <section className="bg-[#050914] py-16 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 md:px-16 md:py-16">
                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-lg">
                            <h2 className="text-3xl font-bold">
                                Ready to{" "}
                                <span className="text-blue-500">grow</span> your
                                business with{" "}
                                <span className="text-blue-500">
                                    data-driven
                                </span>{" "}
                                marketing?
                            </h2>
                            <p className="mt-3 text-sm text-slate-300">
                                Let&apos;s create a strategy tailored for your
                                business and achieve measurable results
                                together.
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
                    <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
                </div>
            </div>
        </section>
    );
}

function MarketingIllustration() {
    return (
        <svg
            viewBox="0 0 400 320"
            className="w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="3D digital marketing megaphone illustration"
        >
            <defs>
                <linearGradient id="megBody" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="megCone" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#93C5FD" />
                </linearGradient>
            </defs>

            {/* Chart card behind */}
            <rect
                x="160"
                y="40"
                width="200"
                height="130"
                rx="16"
                fill="white"
                stroke="#E2E8F0"
                strokeWidth="1.5"
            />
            <rect x="180" y="65" width="70" height="8" rx="4" fill="#E2E8F0" />
            <rect x="180" y="85" width="50" height="6" rx="3" fill="#CBD5E1" />
            <rect
                x="180"
                y="100"
                width="140"
                height="50"
                rx="8"
                fill="#F1F5F9"
            />
            <path
                d="M190 140 L220 120 L250 128 L280 105 L310 115"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <circle cx="310" cy="115" r="4" fill="#3B82F6" />
            <rect
                x="270"
                y="60"
                width="80"
                height="60"
                rx="10"
                fill="#F8FAFC"
            />
            <circle
                cx="310"
                cy="90"
                r="22"
                stroke="#3B82F6"
                strokeWidth="5"
                strokeDasharray="80 60"
                transform="rotate(-90 310 90)"
            />
            <circle cx="310" cy="90" r="4" fill="#3B82F6" />

            {/* Bar chart */}
            <rect
                x="40"
                y="210"
                width="28"
                height="80"
                rx="6"
                fill="url(#barGrad)"
            />
            <rect
                x="80"
                y="190"
                width="28"
                height="100"
                rx="6"
                fill="url(#barGrad)"
            />
            <rect
                x="120"
                y="170"
                width="28"
                height="120"
                rx="6"
                fill="url(#barGrad)"
            />
            <rect
                x="160"
                y="150"
                width="28"
                height="140"
                rx="6"
                fill="url(#barGrad)"
            />

            {/* Megaphone body */}
            <path d="M60 120 L140 90 L140 170 L60 140 Z" fill="url(#megCone)" />
            <path
                d="M60 120 L140 90 L140 170 L60 140 Z"
                fill="url(#megBody)"
                opacity="0.3"
            />
            <rect
                x="130"
                y="105"
                width="40"
                height="50"
                rx="8"
                fill="#2563EB"
            />
            <rect x="165" y="95" width="12" height="70" rx="6" fill="#1E40AF" />

            {/* Social floating badges */}
            <circle cx="360" cy="40" r="18" fill="#1877F2" />
            <path
                d="M360 30 h6 v4 h-4 v3 h4 v4 h-4 v9 h-5 v-20 z"
                fill="white"
                transform="translate(-1 0)"
            />

            <circle cx="40" cy="80" r="18" fill="#4285F4" />
            <path
                d="M40 74 h5 v4 h-4 v2 h4 v4 h-4 v8 h-5 v-18 z"
                fill="white"
                transform="translate(-1 0)"
            />

            <circle cx="320" cy="250" r="18" fill="#E1306C" />
            <rect
                x="312"
                y="244"
                width="16"
                height="16"
                rx="5"
                stroke="white"
                strokeWidth="2"
            />
            <circle cx="320" cy="252" r="4" stroke="white" strokeWidth="2" />
            <circle cx="325" cy="248" r="1.5" fill="white" />

            <circle cx="80" cy="280" r="18" fill="#000" />
            <path
                d="M74 272 q6 4 12 0 q-3 6 -6 12 q-3 -6 -6 -12 z"
                fill="white"
            />

            <circle cx="360" cy="200" r="18" fill="#FF0000" />
            <path d="M354 195 l12 5 l-12 5 z" fill="white" />
        </svg>
    );
}

function WebSystemDetail({ service }: { service: any }) {
    const { frontpage } = usePage().props as any;
    const fp = frontpage ?? {};
    const h = frontpage?.web_system_hero ?? {};
    const allProjects = fp.projects || [];
    const webProjects = allProjects
        .filter((p: any) => {
            const cat = (p.category || '').toLowerCase();
            return cat === 'web system' || cat === 'web systems';
        })
        .slice(0, 4)
        .map((p: any) => ({
            title: p.title,
            category: p.category,
            desc: p.description || '',
            image: p.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
            tags: p.tags || [],
        }));

    const highlights = [
        {
            icon: Code,
            title: "Scalable \u0026 Flexible",
            desc: "Built to grow with your business.",
        },
        {
            icon: Shield,
            title: "Secure \u0026 Reliable",
            desc: "Best practices for security and stability.",
        },
        {
            icon: Zap,
            title: "High Performance",
            desc: "Optimized for speed and efficiency.",
        },
    ];

    const techStack = [
        {
            name: "PHP",
            version: "8.2+",
            color: "#777BB4",
            logo: "/images/logos/tech/php.png",
        },
        {
            name: "Laravel",
            version: "11.x",
            color: "#FF2D20",
            logo: "/images/logos/tech/laravel.png",
        },
        {
            name: "Vue.js",
            version: "3.x",
            color: "#42B883",
            logo: "/images/logos/tech/vue.jpg",
        },
        {
            name: "React",
            version: "18.x",
            color: "#61DAFB",
            logo: "/images/logos/tech/react.png",
        },
        {
            name: "TypeScript",
            version: "5.x",
            color: "#3178C6",
            logo: "/images/logos/tech/typescript.png",
        },
        {
            name: "MySQL",
            version: "8.0+",
            color: "#4479A1",
            logo: "/images/logos/tech/mysql.png",
        },
        {
            name: "PostgreSQL",
            version: "15+",
            color: "#4169E1",
            logo: "/images/logos/tech/postgresql.png",
        },
        {
            name: "Redis",
            version: "7.x",
            color: "#DC382D",
            logo: "/images/logos/tech/redis.jpg",
        },
    ];

    const frameworkLogos: Record<string, string> = {
        Laravel: "/images/logos/tech/laravel.png",
        "Vue.js / React": "/images/logos/tech/vue.jpg",
        "Livewire / Inertia.js": "/images/logos/tech/livewire.png",
        "Tailwind CSS": "/images/logos/tech/tailwind.png",
        Filament: "/images/logos/tech/filament.png",
        Docker: "/images/logos/tech/docker.png",
        GitHub: "/images/logos/tech/github.png",
        "AWS / DigitalOcean": "/images/logos/tech/aws.png",
    };

    const frameworks = [
        { name: "Laravel", role: "Backend Framework" },
        { name: "Vue.js / React", role: "Frontend Framework" },
        { name: "Livewire / Inertia.js", role: "Full-stack Experience" },
        { name: "Tailwind CSS", role: "UI Framework" },
        { name: "Filament", role: "Admin Panel" },
        { name: "Docker", role: "Containerization" },
        { name: "GitHub", role: "Version Control" },
        { name: "AWS / DigitalOcean", role: "Cloud Hosting" },
    ];

    const quotationFeatures = [
        "Custom Requirement Analysis",
        "UI/UX Design",
        "Development \u0026 Testing",
        "Deployment \u0026 Training",
        "Support \u0026 Maintenance",
    ];

    const promotions = [
        {
            title: "15% OFF",
            subtitle: "Early Bird Discount",
            desc: "Book your project 30 days in advance.",
            icon: Calendar,
        },
        {
            title: "FREE",
            subtitle: "UI/UX Design",
            desc: "Get professional UI/UX design for your web system.",
            icon: Palette,
        },
        {
            title: "FREE",
            subtitle: "1 Month Support",
            desc: "After launch support and bug fixing.",
            icon: Headphones,
        },
        {
            title: "10% OFF",
            subtitle: "Maintenance Package",
            desc: "Get 10% off on annual maintenance package.",
            icon: Wrench,
        },
    ];

    return (
        <>
            <Head title="Web System Development" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden bg-[#050914] text-white">
                    <HeroBackground />

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
                            <Link href="/" className="hover:text-white">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href="/services" className="hover:text-white">
                                Services
                            </Link>
                            <span>/</span>
                            <span className="text-white">
                                {h.title || 'Web System Development'}
                            </span>
                        </div>

                        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
                            <div className="max-w-xl">
                                {h.badge && (
                                    <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-blue-500">
                                        {h.badge}
                                    </span>
                                )}
                                <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
                                    {h.title || 'Web System Development'}
                                </h1>
                                <p className="mt-4 text-2xl font-light leading-snug text-slate-300">
                                    {h.subtitle || (
                                        <>
                                            Custom Web Systems That Power{" "}
                                            <span className="font-semibold text-blue-500">
                                                Your Business
                                            </span>
                                        </>
                                    )}
                                </p>
                                <p className="mt-5 text-base leading-relaxed text-slate-400">
                                    {h.description || 'We build secure, scalable, and high-performance web systems tailored to your business processes and needs.'}
                                </p>

                                <div className="mt-8 grid grid-cols-3 gap-4">
                                    {highlights.map((item) => (
                                        <div
                                            key={item.title}
                                            className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <h3 className="mt-3 text-sm font-semibold">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                {h.image ? (
                                    <img
                                        src={h.image}
                                        alt="Web system illustration"
                                        className="w-full rounded-2xl object-cover"
                                    />
                                ) : (
                                    <WebSystemHeroIllustration />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="bg-white py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-sm">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    Technology We Use
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Modern Technologies for Modern Solutions
                                </h2>
                            </div>
                            <p className="max-w-md text-sm text-slate-600">
                                We use the latest technologies to build robust,
                                secure and future-ready web systems.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {techStack.map((tech) => (
                                <div
                                    key={tech.name}
                                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    {tech.logo ? (
                                        <img
                                            src={tech.logo}
                                            alt={tech.name}
                                            className="h-12 w-12 shrink-0 object-contain"
                                        />
                                    ) : (
                                        <div
                                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                                            style={{
                                                backgroundColor: tech.color,
                                            }}
                                        >
                                            {tech.name.slice(0, 2)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {tech.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {tech.version}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Frameworks */}
                <section className="bg-slate-50 py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-sm">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    Frameworks {"&"} Tools
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Our Frameworks {"&"} Tools
                                </h2>
                            </div>
                            <p className="max-w-md text-sm text-slate-600">
                                We leverage powerful frameworks and tools to
                                accelerate development and deliver outstanding
                                results.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {frameworks.map((fw) => (
                                <div
                                    key={fw.name}
                                    className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    {frameworkLogos[fw.name] ? (
                                        <img
                                            src={frameworkLogos[fw.name]}
                                            alt={fw.name}
                                            className="mx-auto h-12 w-12 shrink-0 object-contain"
                                        />
                                    ) : (
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                            <Code className="h-6 w-6" />
                                        </div>
                                    )}
                                    <h3 className="mt-3 text-sm font-semibold text-slate-900">
                                        {fw.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {fw.role}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Previous Projects */}
                <section className="bg-white py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    Previous Projects
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Web Systems We{"\u0027"}ve Built
                                </h2>
                            </div>
                            <Link
                                href="/work"
                                className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1 hover:underline"
                            >
                                View All Projects
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {webProjects.map((project: any) => (
                                <div
                                    key={project.title}
                                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-base font-semibold text-slate-900">
                                            {project.title}
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                            {project.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Quotation */}
                <section className="bg-[#050914] py-16 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-10 rounded-3xl bg-slate-900 p-8 md:grid-cols-2 lg:p-12">
                            <div className="border-b border-white/10 pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-10">
                                <span className="text-sm font-semibold text-blue-400">
                                    Request a Quotation
                                </span>
                                <h2 className="mt-3 text-3xl font-bold">
                                    Starting From
                                </h2>
                                <p className="mt-2 text-5xl font-bold text-blue-500">
                                    RM10,000
                                </p>
                                <p className="mt-4 text-sm text-slate-400">
                                    Custom pricing based on your requirements
                                    and project scope.
                                </p>
                            </div>
                            <div className="flex flex-col justify-between">
                                <ul className="space-y-3">
                                    {quotationFeatures.map((f, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center gap-3 text-sm text-slate-300"
                                        >
                                            <Check className="h-4 w-4 text-blue-500" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold">
                                        Ready to build your custom web system?
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Tell us about your project and we
                                        {"\u0027"}ll get back to you with the
                                        best solution.
                                    </p>
                                    <Link
                                    href="/request"
                                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Request Quotation
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Promotions */}
                <section className="bg-white py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-sm">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    Promotions
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Special Offers for Web System Projects
                                </h2>
                            </div>
                            <p className="max-w-md text-sm text-slate-600">
                                Limited-time offers to help you kickstart your
                                digital transformation.
                            </p>
                            <Link
                                href="/services"
                                className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1 hover:underline"
                            >
                                View All Promotions
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {promotions.map((promo) => (
                                <div
                                    key={promo.title + promo.subtitle}
                                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <promo.icon className="h-10 w-10" />
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                                        {promo.title}
                                    </h3>
                                    <p className="text-sm font-semibold text-blue-600">
                                        {promo.subtitle}
                                    </p>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                        {promo.desc}
                                    </p>
                                    <p className="mt-3 text-[10px] text-slate-400">
                                        Valid until 31 May 2025
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <WebSystemCta />
                <LandingFooter mode="dark" />
            </div>
        </>
    );
}

function WebSystemCta() {
    return (
        <section className="bg-[#050914] py-16 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 md:px-16 md:py-16">
                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-lg">
                            <h2 className="text-3xl font-bold">
                                Ready to build your{" "}
                                <span className="text-blue-500">
                                    custom web system
                                </span>
                                ?
                            </h2>
                            <p className="mt-3 text-sm text-slate-300">
                                Let{"\u0027"}s discuss your requirements and
                                create a tailored solution for your business.
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
                    <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
                </div>
            </div>
        </section>
    );
}

function WebSystemHeroIllustration() {
    return (
        <svg
            viewBox="0 0 520 360"
            className="w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Web system dashboard illustration"
        >
            <defs>
                <linearGradient id="laptopGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="100%" stopColor="#172554" />
                </linearGradient>
                <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
            </defs>

            {/* Laptop base */}
            <rect
                x="120"
                y="40"
                width="320"
                height="220"
                rx="16"
                fill="url(#laptopGrad)"
                stroke="#334155"
                strokeWidth="2"
            />
            <rect
                x="135"
                y="55"
                width="290"
                height="175"
                rx="8"
                fill="url(#screenGrad)"
            />

            {/* Dashboard UI */}
            <rect
                x="150"
                y="70"
                width="80"
                height="45"
                rx="6"
                fill="#1E40AF"
                opacity="0.7"
            />
            <rect
                x="245"
                y="70"
                width="80"
                height="45"
                rx="6"
                fill="#1E40AF"
                opacity="0.7"
            />
            <rect
                x="340"
                y="70"
                width="70"
                height="45"
                rx="6"
                fill="#1E40AF"
                opacity="0.7"
            />

            <rect
                x="150"
                y="125"
                width="170"
                height="85"
                rx="6"
                fill="#1E3A8A"
                opacity="0.5"
            />
            <path
                d="M160 190 L180 170 L200 178 L230 150 L260 165 L300 140"
                stroke="#60A5FA"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />

            <rect
                x="335"
                y="125"
                width="75"
                height="85"
                rx="6"
                fill="#1E3A8A"
                opacity="0.5"
            />
            <circle
                cx="372"
                cy="160"
                r="22"
                stroke="#60A5FA"
                strokeWidth="5"
                strokeDasharray="80 50"
                transform="rotate(-90 372 160)"
            />
            <circle cx="372" cy="160" r="4" fill="#60A5FA" />

            {/* Floating icons */}
            <circle cx="80" cy="100" r="28" fill="#2563EB" opacity="0.9" />
            <rect
                x="68"
                y="88"
                width="24"
                height="24"
                rx="5"
                stroke="white"
                strokeWidth="2"
            />
            <path d="M74 100 H86 M80 94 V106" stroke="white" strokeWidth="2" />

            <circle cx="440" cy="80" r="28" fill="#1E40AF" opacity="0.9" />
            <rect
                x="428"
                y="70"
                width="24"
                height="20"
                rx="3"
                stroke="white"
                strokeWidth="2"
            />
            <circle cx="440" cy="92" r="6" stroke="white" strokeWidth="2" />

            <circle cx="460" cy="230" r="28" fill="#3B82F6" opacity="0.9" />
            <rect
                x="448"
                y="220"
                width="24"
                height="20"
                rx="3"
                stroke="white"
                strokeWidth="2"
            />
            <path
                d="M452 226 L468 226 M452 232 L464 232"
                stroke="white"
                strokeWidth="2"
            />

            <circle cx="70" cy="240" r="28" fill="#1D4ED8" opacity="0.9" />
            <path
                d="M58 240 L70 228 L82 240 M70 228 V252"
                stroke="white"
                strokeWidth="2"
            />

            {/* Database cylinder */}
            <ellipse cx="170" cy="280" rx="40" ry="14" fill="#3B82F6" />
            <rect x="130" y="280" width="80" height="45" fill="#2563EB" />
            <ellipse cx="170" cy="325" rx="40" ry="14" fill="#1D4ED8" />
            <line
                x1="130"
                y1="290"
                x2="130"
                y2="315"
                stroke="#1E40AF"
                strokeWidth="2"
            />
            <line
                x1="210"
                y1="290"
                x2="210"
                y2="315"
                stroke="#1E40AF"
                strokeWidth="2"
            />

            {/* Cloud */}
            <path
                d="M380 280 C360 260 390 240 415 255 C430 235 465 245 465 270 C485 270 490 300 465 305 H385 C360 305 360 280 380 280 Z"
                fill="#60A5FA"
                opacity="0.8"
            />
        </svg>
    );
}

function MobileAppsDetail({ service }: { service: any }) {
    const { frontpage } = usePage().props as any;
    const fp = frontpage ?? {};
    const h = frontpage?.mobile_apps_hero ?? {};
    const allProjects = fp.projects || [];
    const mobileProjects = allProjects
        .filter((p: any) => {
            const cat = (p.category || '').toLowerCase();
            return cat === 'mobile app' || cat === 'mobile apps';
        })
        .slice(0, 4)
        .map((p: any) => ({
            title: p.title,
            category: p.category,
            desc: p.description || '',
            image: p.image || 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
            tags: p.tags || [],
        }));

    const techStack = [
        {
            name: "Flutter",
            role: "Cross-platform",
            logo: "/images/logos/tech/flutter.svg",
        },
        {
            name: "React Native",
            role: "Cross-platform",
            logo: "/images/logos/tech/react-native.svg",
        },
        {
            name: "Swift",
            role: "iOS Development",
            logo: "/images/logos/tech/swift.svg",
        },
        {
            name: "Kotlin",
            role: "Android Development",
            logo: "/images/logos/tech/kotlin.svg",
        },
        {
            name: "Firebase",
            role: "Backend Services",
            logo: "/images/logos/tech/firebase.svg",
        },
        {
            name: "GraphQL",
            role: "API Integration",
            logo: "/images/logos/tech/graphql.svg",
        },
    ];

    const quotationFeatures = [
        "Free Consultation",
        "Project Planning",
        "Transparent Pricing",
        "Timely Delivery",
    ];

    const whyUs = [
        {
            icon: TrendingUp,
            title: "Scalable Solutions",
            desc: "Built to grow with your business.",
        },
        {
            icon: Shield,
            title: "Secure & Reliable",
            desc: "We follow best security practices.",
        },
        {
            icon: Headphones,
            title: "Ongoing Support",
            desc: "We're with you after launch.",
        },
    ];

    return (
        <>
            <Head title="Mobile Apps Development" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden bg-[#050914] text-white">
                    <HeroBackground />

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
                            <div className="max-w-md">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-500">
                                    {h.badge || 'Our Services'}
                                </span>
                                <h1 className="mt-4 text-[2.85rem] font-bold leading-[1.05] sm:text-[3.45rem] lg:text-[3.6rem]">
                                    {h.title || 'Mobile Apps Development'}
                                </h1>
                                <p className="mt-5 text-base leading-relaxed text-slate-300">
                                    {h.subtitle || 'We build high-performance mobile apps that engage users and drive business growth.'}
                                </p>
                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <Link
                                        href={h.primary_link || '/request'}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                    >
                                        {h.primary_cta || 'Request Quotation'}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    {h.secondary_cta && h.secondary_link && (
                                        <Link
                                            href={h.secondary_link}
                                            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                                        >
                                            {h.secondary_cta}
                                        </Link>
                                    )}
                                </div>
                                <div className="mt-10 flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {(h.trusted_avatars || [
                                            { image: 'https://i.pravatar.cc/150?img=11' },
                                            { image: 'https://i.pravatar.cc/150?img=12' },
                                            { image: 'https://i.pravatar.cc/150?img=13' },
                                        ]).map((avatar: any, idx: number) => (
                                            <img
                                                key={`ma-avatar-${avatar.image ? avatar.image.slice(-12) : idx}`}
                                                src={avatar.image || `https://i.pravatar.cc/150?img=${11 + idx}`}
                                                alt="Client"
                                                className="h-10 w-10 rounded-full border-2 border-[#050914] object-cover"
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-semibold">
                                            {h.trusted_text || 'Trusted by 100+ clients'}
                                        </p>
                                        <p className="text-slate-400">
                                            {h.trusted_subtext || 'from startups to enterprise'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                {h.image ? (
                                    <img
                                        src={h.image}
                                        alt="Mobile apps illustration"
                                        className="w-full rounded-2xl object-cover"
                                    />
                                ) : (
                                    <MobileAppsHeroIllustration />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="bg-white py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-sm">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    Technologies We Use
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Modern Technologies for Robust Mobile
                                    Solutions
                                </h2>
                            </div>
                            <p className="max-w-md text-sm text-slate-600">
                                We use the latest frameworks and tools to
                                deliver fast, secure and future-ready mobile
                                applications.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {techStack.map((tech) => (
                                <div
                                    key={tech.name}
                                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <img
                                        src={tech.logo}
                                        alt={tech.name}
                                        className="h-12 w-12 shrink-0 object-contain"
                                    />
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {tech.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {tech.role}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Projects */}
                <section className="bg-slate-50 py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    Our Work
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Recent Mobile Apps Projects
                                </h2>
                            </div>
                            <Link
                                href="/work"
                                className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1 hover:underline"
                            >
                                View All Projects
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {mobileProjects.map((project: any) => (
                                <div
                                    key={project.title}
                                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-base font-semibold text-slate-900">
                                            {project.title}
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                            {project.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Quotation */}
                <section className="bg-white py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 rounded-3xl bg-slate-950 p-8 md:grid-cols-3 lg:p-12">
                            <div className="text-white">
                                <span className="text-sm font-semibold text-blue-400">
                                    Ready To Start?
                                </span>
                                <h2 className="mt-3 text-3xl font-bold">
                                    Request a Quotation
                                </h2>
                                <p className="mt-3 text-sm text-slate-400">
                                    Get a custom solution tailored to your
                                    business needs.
                                </p>
                                <ul className="mt-6 space-y-2 text-sm text-slate-300">
                                    {quotationFeatures.map((f, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center gap-2"
                                        >
                                            <Check className="h-4 w-4 text-blue-500" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col justify-center rounded-2xl bg-white p-6 text-center">
                                <p className="text-sm text-slate-600">
                                    Starting from
                                </p>
                                <p className="mt-2 text-5xl font-bold text-blue-600">
                                    RM 50,000
                                </p>
                                <p className="mt-3 text-xs text-slate-500">
                                    Price may vary based on project requirements
                                    and complexity.
                                </p>
                                <Link
                                    href="/request"
                                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Request Quotation
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {whyUs.map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-white"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <MobileAppsCta />
                <LandingFooter mode="dark" />
            </div>
        </>
    );
}

function MobileAppsCta() {
    return (
        <section className="bg-[#050914] py-16 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 md:px-16 md:py-16">
                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-lg">
                            <h2 className="text-3xl font-bold">
                                Let{"\u0027"}s build something great{" "}
                                <span className="text-blue-500">together.</span>
                            </h2>
                            <p className="mt-3 text-sm text-slate-300">
                                Have a project in mind? Let{"\u0027"}s talk
                                about how we can help you achieve your goals.
                            </p>
                        </div>
                        <Link
                            href="/request"
                            className="inline-flex items-center gap-2 rounded-lg border border-white bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                        >
                            Request Quotation
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
                </div>
            </div>
        </section>
    );
}

function MobileAppsHeroIllustration() {
    return (
        <svg
            viewBox="0 0 500 420"
            className="w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Mobile app dashboard illustration"
        >
            <defs>
                <linearGradient id="phoneFrame" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="phoneScreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="100%" stopColor="#172554" />
                </linearGradient>
                <linearGradient id="lineGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Phone */}
            <rect
                x="160"
                y="20"
                width="180"
                height="360"
                rx="28"
                fill="url(#phoneFrame)"
                stroke="#334155"
                strokeWidth="2"
            />
            <rect
                x="172"
                y="40"
                width="156"
                height="300"
                rx="16"
                fill="url(#phoneScreen)"
            />
            <rect x="220" y="28" width="60" height="6" rx="3" fill="#334155" />

            {/* Dashboard UI */}
            <text x="190" y="70" fill="white" fontSize="10" fontWeight="bold">
                Dashboard
            </text>
            <text x="190" y="90" fill="#94A3B8" fontSize="8">
                Total Revenue
            </text>
            <text x="190" y="110" fill="white" fontSize="18" fontWeight="bold">
                RM 120,430
            </text>
            <text x="190" y="125" fill="#22C55E" fontSize="8">
                +12.5%
            </text>

            <path
                d="M190 250 L220 230 L250 240 L280 210 L310 220"
                stroke="#60A5FA"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M190 250 L220 230 L250 240 L280 210 L310 220 L310 300 L190 300 Z"
                fill="url(#lineGrad2)"
            />

            <text x="190" y="270" fill="#94A3B8" fontSize="8">
                Analytics
            </text>
            <circle
                cx="250"
                cy="290"
                r="22"
                stroke="#3B82F6"
                strokeWidth="5"
                strokeDasharray="70 40"
                transform="rotate(-90 250 290)"
            />
            <text x="242" y="294" fill="white" fontSize="9" fontWeight="bold">
                68%
            </text>

            {/* Floating icons */}
            <circle cx="80" cy="120" r="30" fill="#2563EB" opacity="0.9" />
            <rect
                x="65"
                y="105"
                width="30"
                height="30"
                rx="6"
                stroke="white"
                strokeWidth="2"
            />
            <path
                d="M73 120 L87 120 M80 113 V127"
                stroke="white"
                strokeWidth="2"
            />

            <circle cx="420" cy="100" r="30" fill="#61DAFB" opacity="0.9" />
            <circle cx="420" cy="100" r="10" stroke="white" strokeWidth="2" />
            <circle cx="420" cy="100" r="4" fill="white" />

            <circle cx="100" cy="280" r="30" fill="#02569B" opacity="0.9" />
            <path
                d="M85 275 L95 265 L105 275 L115 265"
                stroke="white"
                strokeWidth="2"
                fill="none"
            />
            <path
                d="M85 285 L95 295 L105 285 L115 295"
                stroke="white"
                strokeWidth="2"
                fill="none"
            />

            <circle cx="410" cy="300" r="30" fill="#F05138" opacity="0.9" />
            <path
                d="M400 285 Q415 280 415 300 Q415 320 400 315"
                stroke="white"
                strokeWidth="2"
                fill="none"
            />
            <path d="M400 285 L400 315" stroke="white" strokeWidth="2" />
        </svg>
    );
}

function WebDevelopmentDetail({ service }: { service: any }) {
    const { frontpage } = usePage().props as any;
    const h = frontpage?.web_development_hero ?? {};
    const heroHighlights = [
        {
            icon: Palette,
            title: "Modern Design",
            desc: "Beautiful & user-friendly",
        },
        {
            icon: Zap,
            title: "Optimized Performance",
            desc: "Fast loading & SEO ready",
        },
        {
            icon: Shield,
            title: "Secure & Reliable",
            desc: "Built with best practices",
        },
    ];

    const packages = [
        {
            name: "Startup",
            tagline:
                "Perfect for startups and small businesses looking to establish their online presence.",
            price: "RM1200",
            features: [
                "Up to 5 Pages Website",
                "Responsive Design",
                "Basic SEO Setup",
                "Contact Form",
                "Social Media Integration",
                "1 Round of Revisions",
                "1 Month Support",
            ],
            popular: false,
        },
        {
            name: "Enterprise",
            tagline:
                "Ideal for growing businesses that need more features and scalability.",
            price: "RM2500",
            features: [
                "Up to 15 Pages Website",
                "Custom Design",
                "Advanced SEO Setup",
                "CMS Integration (WordPress)",
                "Blog / News Section",
                "Social Media Integration",
                "3 Rounds of Revisions",
                "3 Months Support",
            ],
            popular: true,
        },
        {
            name: "Pro",
            tagline:
                "For businesses that need custom solutions and advanced functionality.",
            price: "Quotes",
            features: [
                "Unlimited Pages",
                "Custom Web Development",
                "Advanced Features & Integrations",
                "E-commerce Functionality",
                "API & Third-party Integrations",
                "Priority Support",
                "6 Months Support",
            ],
            popular: false,
        },
    ];

    const promotions = [
        {
            icon: Calendar,
            title: "15% OFF",
            subtitle: "Early Bird Discount",
            desc: "Book your project 7 days in advance.",
        },
        {
            icon: Globe,
            title: "FREE",
            subtitle: "Domain Name",
            desc: "Free .com domain with any package.",
        },
        {
            icon: Wrench,
            title: "30% OFF",
            subtitle: "Website Maintenance",
            desc: "30% off for the first 3 months.",
        },
        {
            icon: Shield,
            title: "FREE",
            subtitle: "SSL Certificate",
            desc: "Free SSL to keep your website secure.",
        },
    ];

    const whyUs = [
        {
            icon: Sparkles,
            title: "Custom & Modern Design",
            desc: "Unique designs that represent your brand",
        },
        {
            icon: Search,
            title: "SEO Friendly",
            desc: "Built with SEO best practices in mind",
        },
        {
            icon: Smartphone,
            title: "Mobile Responsive",
            desc: "Perfect experience on all devices",
        },
        {
            icon: ShieldCheck,
            title: "Fast & Secure",
            desc: "Optimized for speed and security",
        },
    ];

    const processSteps = [
        {
            step: "01",
            icon: Search,
            title: "Discover",
            desc: "We learn about your business and goals.",
        },
        {
            step: "02",
            icon: FileText,
            title: "Plan",
            desc: "We plan the structure, content and features.",
        },
        {
            step: "03",
            icon: Palette,
            title: "Design",
            desc: "We design a modern and user-friendly UI.",
        },
        {
            step: "04",
            icon: Code,
            title: "Develop",
            desc: "We build your website with clean code.",
        },
        {
            step: "05",
            icon: Rocket,
            title: "Launch",
            desc: "We test and launch your website.",
        },
    ];

    return (
        <>
            <Head title="Website Development" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden bg-[#050914] text-white">
                    <HeroBackground />

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
                            <Link href="/" className="hover:text-white">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href="/services" className="hover:text-white">
                                Services
                            </Link>
                            <span>/</span>
                            <span className="text-white">
                                {h.title || 'Website Development'}
                            </span>
                        </div>

                        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
                            <div className="max-w-xl">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-500">
                                    {h.badge || 'Our Services'}
                                </span>
                                <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
                                    {h.title || (
                                        <>
                                            Website Development That Drives{" "}
                                            <span className="text-blue-500">
                                                Results
                                            </span>
                                        </>
                                    )}
                                </h1>
                                <p className="mt-5 text-base leading-relaxed text-slate-300">
                                    {h.subtitle || 'We build modern, fast, and secure websites that not only look great but also help your business grow online.'}
                                </p>

                                <div className="mt-8 grid grid-cols-3 gap-4">
                                    {heroHighlights.map((item) => (
                                        <div
                                            key={item.title}
                                            className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <h3 className="mt-3 text-sm font-semibold">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                {h.image ? (
                                    <img
                                        src={h.image}
                                        alt="Website development illustration"
                                        className="w-full rounded-2xl object-cover"
                                    />
                                ) : (
                                    <WebDevelopmentHeroIllustration />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Packages */}
                <section className="bg-slate-50 py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-[0.42fr_1fr]">
                            <div>
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    Packages
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Choose The Right Package for Your Business
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                    Flexible packages designed to fit your goals
                                    and budget. All packages include responsive
                                    design and basic SEO setup.
                                </p>
                                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
                                    <Shield className="h-4 w-4" />
                                    100% Money Back Guarantee
                                </div>
                            </div>

                            <div className="grid flex-1 gap-4 md:grid-cols-3">
                                {packages.map((pkg) => (
                                    <div
                                        key={pkg.name}
                                        className={`relative flex flex-col rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                                            pkg.popular
                                                ? "border-blue-600 bg-white shadow-md"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >
                                        {pkg.popular && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                                                Most Popular
                                            </span>
                                        )}
                                        <h3 className="text-xl font-semibold text-slate-900">
                                            {pkg.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {pkg.tagline}
                                        </p>
                                        <div className="mt-5">
                                            <span className="text-xs text-slate-500">
                                                Starting from
                                            </span>
                                            <p
                                                className={`text-3xl font-bold ${pkg.price === "Quotes" ? "text-blue-600" : "text-slate-900"}`}
                                            >
                                                {pkg.price}
                                            </p>
                                        </div>
                                        <ul className="mt-6 flex-1 space-y-3">
                                            {pkg.features.map((f, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start gap-3 text-sm text-slate-700"
                                                >
                                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href="/request"
                                            className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                                                pkg.popular
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                                            }`}
                                        >
                                            {pkg.price === "Quotes"
                                                ? "Request Quotation"
                                                : `Request Quotation`}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Promotions */}
                <section className="bg-white py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="rounded-3xl bg-[#050914] p-8 text-white md:p-12">
                            <div className="grid gap-10 lg:grid-cols-[0.35fr_1fr]">
                                <div>
                                    <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                        Promotions
                                    </span>
                                    <h2 className="mt-3 text-3xl font-bold">
                                        Limited-Time Offers
                                    </h2>
                                    <p className="mt-4 text-sm text-slate-400">
                                        Take advantage of our special offers and
                                        save more on your website project today!
                                    </p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {promotions.map((promo) => (
                                        <div
                                            key={promo.subtitle}
                                            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                                                <promo.icon className="h-5 w-5" />
                                            </div>
                                            <h3 className="mt-4 text-xl font-bold">
                                                {promo.title}
                                            </h3>
                                            <p className="text-sm font-semibold text-blue-400">
                                                {promo.subtitle}
                                            </p>
                                            <p className="mt-2 text-xs leading-relaxed text-slate-400">
                                                {promo.desc}
                                            </p>
                                            <p className="mt-3 text-[10px] text-slate-500">
                                                Valid until 31 May 2025
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="bg-white py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-[0.35fr_1fr]">
                            <div>
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    Why Choose Us
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Built with Purpose, Designed for Growth
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                    We combine creativity, technology, and
                                    strategy to deliver websites that help your
                                    business succeed online.
                                </p>
                            </div>
                            <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {whyUs.map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-3 text-sm font-semibold text-slate-900">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Process */}
                <section className="bg-slate-50 py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 max-w-lg">
                            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Our Process
                            </span>
                            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                How We Work
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                A simple and transparent process to bring your
                                website to life.
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                            {processSteps.map((step) => (
                                <div
                                    key={step.title}
                                    className="relative flex flex-col rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                        {step.step}
                                    </div>
                                    <div className="mx-auto mt-2 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <step.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-3 text-sm font-semibold text-slate-900">
                                        {step.title}
                                    </h3>
                                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <WebDevelopmentCta />
                <LandingFooter mode="dark" />
            </div>
        </>
    );
}

function WebDevelopmentCta() {
    return (
        <section className="bg-[#050914] py-16 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 md:px-16 md:py-16">
                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-lg">
                            <h2 className="text-3xl font-bold">
                                Ready to Build Your{" "}
                                <span className="text-blue-500">
                                    Dream Website
                                </span>
                                ?
                            </h2>
                            <p className="mt-3 text-sm text-slate-300">
                                Let&apos;s create a website that helps your
                                business stand out and grow online.
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
                    <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
                </div>
            </div>
        </section>
    );
}

function WebDevelopmentHeroIllustration() {
    return (
        <svg
            viewBox="0 0 520 360"
            className="w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Website development dashboard illustration"
        >
            <defs>
                <linearGradient id="wdLaptopGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="wdScreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="100%" stopColor="#172554" />
                </linearGradient>
                <linearGradient id="wdBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
            </defs>

            {/* Laptop base */}
            <rect
                x="120"
                y="40"
                width="320"
                height="220"
                rx="16"
                fill="url(#wdLaptopGrad)"
                stroke="#334155"
                strokeWidth="2"
            />
            <rect
                x="135"
                y="55"
                width="290"
                height="175"
                rx="8"
                fill="url(#wdScreenGrad)"
            />

            {/* Dashboard UI */}
            <rect
                x="150"
                y="70"
                width="80"
                height="45"
                rx="6"
                fill="#1E40AF"
                opacity="0.7"
            />
            <rect
                x="245"
                y="70"
                width="80"
                height="45"
                rx="6"
                fill="#1E40AF"
                opacity="0.7"
            />
            <rect
                x="340"
                y="70"
                width="70"
                height="45"
                rx="6"
                fill="#1E40AF"
                opacity="0.7"
            />

            <rect
                x="150"
                y="125"
                width="170"
                height="85"
                rx="6"
                fill="#1E3A8A"
                opacity="0.5"
            />
            <path
                d="M160 190 L180 170 L200 178 L230 150 L260 165 L300 140"
                stroke="#60A5FA"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />

            <rect
                x="335"
                y="125"
                width="75"
                height="85"
                rx="6"
                fill="#1E3A8A"
                opacity="0.5"
            />
            <circle
                cx="372"
                cy="160"
                r="22"
                stroke="#60A5FA"
                strokeWidth="5"
                strokeDasharray="80 50"
                transform="rotate(-90 372 160)"
            />
            <circle cx="372" cy="160" r="4" fill="#60A5FA" />

            {/* Code brackets */}
            <circle cx="80" cy="100" r="28" fill="#2563EB" opacity="0.9" />
            <path
                d="M68 92 L60 100 L68 108"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M92 92 L100 100 L92 108"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M78 116 L82 84"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Phone mockup */}
            <rect
                x="380"
                y="140"
                width="70"
                height="130"
                rx="14"
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="2"
            />
            <rect
                x="386"
                y="152"
                width="58"
                height="106"
                rx="8"
                fill="#172554"
            />
            <rect
                x="392"
                y="168"
                width="46"
                height="6"
                rx="3"
                fill="#60A5FA"
                opacity="0.7"
            />
            <rect
                x="392"
                y="180"
                width="34"
                height="6"
                rx="3"
                fill="#60A5FA"
                opacity="0.5"
            />
            <rect
                x="392"
                y="198"
                width="46"
                height="30"
                rx="4"
                fill="#1E40AF"
                opacity="0.6"
            />

            {/* Bar chart */}
            <rect
                x="40"
                y="260"
                width="24"
                height="60"
                rx="4"
                fill="url(#wdBar)"
            />
            <rect
                x="74"
                y="240"
                width="24"
                height="80"
                rx="4"
                fill="url(#wdBar)"
            />
            <rect
                x="108"
                y="220"
                width="24"
                height="100"
                rx="4"
                fill="url(#wdBar)"
            />
            <rect
                x="142"
                y="200"
                width="24"
                height="120"
                rx="4"
                fill="url(#wdBar)"
            />
        </svg>
    );
}

function GameDevelopmentDetail({ service }: { service: any }) {
    const { frontpage } = usePage().props as any;
    const fp = frontpage ?? {};
    const h = frontpage?.game_development_hero ?? {};
    const allProjects = fp.projects || [];
    const gamingProjects = allProjects
        .filter((p: any) => {
            const cat = (p.category || '').toLowerCase();
            return cat === 'game development' || cat === 'game';
        })
        .slice(0, 4)
        .map((p: any) => ({
            title: p.title,
            category: p.category || '',
            platforms: p.platforms || '',
            tags: p.tags || [],
            image: p.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
            desc: p.description || '',
        }));

    const heroHighlights = [
        {
            icon: Gamepad2,
            title: "Multi-Platform",
            desc: "PC, Console, Mobile & VR",
        },
        {
            icon: Palette,
            title: "Stunning Visuals",
            desc: "Immersive art & animation",
        },
        {
            icon: Zap,
            title: "High Performance",
            desc: "Smooth gameplay at scale",
        },
    ];

    const techStack = [
        {
            name: "Unity",
            role: "Game Engine",
            logo: "/images/logos/tech/unity.png",
        },
        {
            name: "Unreal Engine",
            role: "Game Engine",
            logo: "/images/logos/tech/unreal-engine.png",
        },
        {
            name: "C#",
            role: "Programming",
            logo: "/images/logos/tech/csharp.svg",
        },
        {
            name: "Blender",
            role: "3D Modeling",
            logo: "/images/logos/tech/blender.svg",
        },
        {
            name: "Firebase",
            role: "Backend Services",
            logo: "/images/logos/tech/firebase.svg",
        },
        {
            name: "PlayFab",
            role: "Live Operations",
            logo: "/images/logos/tech/playfab.svg",
        },
    ];

    const platforms = ["PC", "Console", "Mobile", "WebGL", "VR / AR"];

    const quotationFeatures = [
        "Free Consultation",
        "Game Design & Planning",
        "Transparent Pricing",
        "On-time Delivery",
    ];

    const whyUs = [
        {
            icon: Rocket,
            title: "Scalable Solutions",
            desc: "Built to grow with your game.",
        },
        {
            icon: Shield,
            title: "Secure & Reliable",
            desc: "We follow best security practices.",
        },
        {
            icon: Headphones,
            title: "Ongoing Support",
            desc: "We're with you after launch.",
        },
    ];

    return (
        <>
            <Head title="Game Development Services" />

            <div className="min-h-screen bg-[#050914]">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden text-white">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
                        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
                        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
                            <Link href="/" className="hover:text-white">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href="/services" className="hover:text-white">
                                Services
                            </Link>
                            <span>/</span>
                            <span className="text-white">{h.title || 'Game Development'}</span>
                        </div>

                        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
                            <div className="max-w-xl">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-500">
                                    {h.badge || 'Our Services'}
                                </span>
                                <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
                                    {h.title || 'Game Development Services'}
                                </h1>
                                <p className="mt-5 text-base leading-relaxed text-slate-300">
                                    {h.subtitle || 'We create engaging, high-quality games that captivate players and deliver unforgettable experiences across all platforms.'}
                                </p>

                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <Link
                                        href={h.primary_link || '/request'}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                    >
                                        {h.primary_cta || 'Request Quotation'}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    {h.secondary_cta && h.secondary_link && (
                                        <Link
                                            href={h.secondary_link}
                                            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                                        >
                                            {h.secondary_cta}
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-10 flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {(h.trusted_avatars || [
                                            { image: 'https://i.pravatar.cc/150?img=11' },
                                            { image: 'https://i.pravatar.cc/150?img=12' },
                                            { image: 'https://i.pravatar.cc/150?img=13' },
                                        ]).map((avatar: any, idx: number) => (
                                            <img
                                                key={`gd-avatar-${avatar.image ? avatar.image.slice(-12) : idx}`}
                                                src={avatar.image || `https://i.pravatar.cc/150?img=${11 + idx}`}
                                                alt="Client"
                                                className="h-10 w-10 rounded-full border-2 border-[#050914] object-cover"
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-semibold">
                                            {h.trusted_text || 'Trusted by 100+ clients'}
                                        </p>
                                        <p className="text-slate-400">
                                            {h.trusted_subtext || 'from startups to enterprise'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <img
                                    src={h.image || '/images/game-hero.png'}
                                    alt="Game Development by Kenju Tech"
                                    className="w-full rounded-2xl object-cover"
                                />
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-3 gap-4 lg:max-w-2xl">
                            {heroHighlights.map((h) => (
                                <div
                                    key={h.title}
                                    className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                                        <h.icon className="h-10 w-10" />
                                    </div>
                                    <h3 className="mt-3 text-sm font-semibold">
                                        {h.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {h.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="bg-[#050914] py-16 lg:py-24 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-[0.35fr_1fr]">
                            <div>
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                    Technologies We Use
                                </span>
                                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                    Powerful Technologies for Epic Games
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                                    We leverage industry-leading tools and
                                    engines to build immersive, high-performance
                                    games for any platform.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {techStack.map((tech) => (
                                        <div
                                            key={tech.name}
                                            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:-translate-y-1"
                                        >
                                            <img
                                                src={tech.logo}
                                                alt={tech.name}
                                                className="h-12 w-12 shrink-0 rounded-lg bg-white p-1.5 object-contain"
                                            />
                                            <div>
                                                <p className="font-semibold">
                                                    {tech.name}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {tech.role}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {platforms.map((platform) => (
                                        <span
                                            key={platform}
                                            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-slate-300"
                                        >
                                            {platform}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects */}
                <section className="bg-[#050914] py-16 lg:py-24 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                    Our Work
                                </span>
                                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                    Recent Gaming Projects
                                </h2>
                            </div>
                            <Link
                                href="/work"
                                className="text-sm font-semibold text-blue-400 inline-flex items-center gap-1 hover:underline"
                            >
                                View All Projects
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {gamingProjects.map((project: any) => (
                                <div
                                    key={project.title}
                                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1"
                                >
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-base font-semibold">
                                            {project.title}
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                                            {project.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Quotation */}
                <section className="bg-[#050914] py-16 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:grid-cols-2 lg:p-12">
                            <div className="border-b border-white/10 pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-10">
                                <span className="text-sm font-semibold text-blue-400">
                                    Ready to Start?
                                </span>
                                <h2 className="mt-3 text-3xl font-bold">
                                    Request a Quotation
                                </h2>
                                <p className="mt-4 text-sm text-slate-400">
                                    Tell us about your game idea and we'll help
                                    you bring it to life.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    {quotationFeatures.map((f, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center gap-3 text-sm text-slate-300"
                                        >
                                            <Check className="h-4 w-4 text-blue-500" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-sm text-slate-400">
                                    Starting from
                                </span>
                                <p className="text-5xl font-bold text-blue-500">
                                    RM 50,000
                                </p>
                                <p className="mt-4 text-sm text-slate-400">
                                    Price may vary based on project requirements
                                    and complexity.
                                </p>
                                <Link
                                    href="/request"
                                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Request Quotation
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Us */}
                <section className="bg-[#050914] py-16 lg:py-24 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-[0.5fr_1fr]">
                            <div>
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                    Why Choose Us
                                </span>
                                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                    Let's build something great together.
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                                    Have a project in mind? Let's talk about how
                                    we can help you achieve your goals.
                                </p>
                                <Link
                                    href="/request"
                                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Request Quotation
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                {whyUs.map((item) => (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                                    >
                                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                                            <item.icon className="h-10 w-10" />
                                        </div>
                                        <h3 className="mt-4 text-base font-semibold">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <GameDevelopmentCta />
                <LandingFooter mode="dark" />
            </div>
        </>
    );
}

function GameDevelopmentCta() {
    return (
        <section className="bg-[#050914] py-16 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 md:px-16 md:py-16">
                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-lg">
                            <h2 className="text-3xl font-bold">
                                Ready to create your next{" "}
                                <span className="text-blue-500">hit game</span>?
                            </h2>
                            <p className="mt-3 text-sm text-slate-300">
                                Let's bring your game idea to life with stunning
                                visuals, smooth gameplay and powerful
                                technology.
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
                    <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
                </div>
            </div>
        </section>
    );
}

function GameDevelopmentHeroIllustration() {
    return (
        <svg
            viewBox="0 0 520 360"
            className="w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Game development illustration"
        >
            <defs>
                <linearGradient id="gdScreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="100%" stopColor="#172554" />
                </linearGradient>
                <linearGradient id="gdBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
            </defs>

            {/* Monitor */}
            <rect
                x="100"
                y="40"
                width="320"
                height="200"
                rx="16"
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="2"
            />
            <rect
                x="115"
                y="55"
                width="290"
                height="170"
                rx="8"
                fill="url(#gdScreen)"
            />

            {/* Game scene on screen */}
            <circle cx="260" cy="140" r="45" fill="#2563EB" opacity="0.3" />
            <path
                d="M230 160 L250 130 L270 145 L300 110"
                stroke="#60A5FA"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />
            <circle cx="300" cy="110" r="5" fill="#60A5FA" />
            <rect
                x="140"
                y="170"
                width="80"
                height="10"
                rx="5"
                fill="#1E40AF"
                opacity="0.7"
            />
            <rect
                x="140"
                y="190"
                width="50"
                height="8"
                rx="4"
                fill="#1E40AF"
                opacity="0.5"
            />

            {/* Floating game engine icons */}
            <rect
                x="60"
                y="80"
                width="50"
                height="50"
                rx="12"
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="1.5"
            />
            <text
                x="85"
                y="112"
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                fontFamily="sans-serif"
            >
                U
            </text>

            <rect
                x="430"
                y="60"
                width="55"
                height="55"
                rx="12"
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="1.5"
            />
            <text
                x="457"
                y="95"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                fontFamily="sans-serif"
            >
                UE
            </text>

            <rect
                x="440"
                y="200"
                width="50"
                height="50"
                rx="12"
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="1.5"
            />
            <text
                x="465"
                y="232"
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                fontFamily="sans-serif"
            >
                C#
            </text>

            <rect
                x="50"
                y="240"
                width="50"
                height="50"
                rx="12"
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="1.5"
            />
            <text
                x="75"
                y="272"
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                fontFamily="sans-serif"
            >
                B
            </text>

            {/* Controller */}
            <rect
                x="180"
                y="270"
                width="160"
                height="55"
                rx="18"
                fill="#334155"
            />
            <circle cx="215" cy="297" r="14" fill="#0F172A" />
            <circle cx="305" cy="297" r="10" fill="#0F172A" />
            <circle cx="320" cy="287" r="5" fill="#2563EB" />
            <circle cx="320" cy="307" r="5" fill="#2563EB" />
            <circle cx="330" cy="297" r="5" fill="#2563EB" />
            <circle cx="310" cy="297" r="5" fill="#2563EB" />

            {/* Bar chart */}
            <rect
                x="50"
                y="150"
                width="16"
                height="50"
                rx="4"
                fill="url(#gdBar)"
            />
            <rect
                x="74"
                y="130"
                width="16"
                height="70"
                rx="4"
                fill="url(#gdBar)"
            />
            <rect
                x="98"
                y="110"
                width="16"
                height="90"
                rx="4"
                fill="url(#gdBar)"
            />
        </svg>
    );
}

function ITEquipmentDetail({ service }: { service: any }) {
    const { frontpage } = usePage().props as any;
    const h = frontpage?.it_equipment_hero ?? {};
    const staticProducts = [
        {
            name: "Dell Latitude 5440",
            spec: '14" FHD, Intel i5, 16GB RAM, 512GB SSD, Windows 11 Pro',
            price: "RM4,199.00",
            badge: "Best Seller",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
        },
        {
            name: "HP ProDesk 400 G9 SFF",
            spec: "Intel i5, 16GB RAM, 512GB SSD, Windows 11 Pro",
            price: "RM2,799.00",
            badge: "New",
            image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80",
        },
        {
            name: "Lenovo ThinkVision E24-28",
            spec: '23.8" FHD, IPS, 75Hz, 3-Side NearEdgeless',
            price: "RM599.00",
            badge: "Best Seller",
            image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
        },
        {
            name: "Ubiquiti UniFi 6 Lite",
            spec: "Dual-band WiFi 6 Access Point, PoE, 2.4 / 5 GHz",
            price: "RM499.00",
            badge: null,
            image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
        },
        {
            name: "HP LaserJet Pro MFP 4103fdw",
            spec: "Print, Copy, Scan, Fax, Duplex, Wireless",
            price: "RM2,199.00",
            badge: null,
            image: "/images/products/hp-laserjet.png",
        },
        {
            name: "Logitech MK270 Wireless",
            spec: "Keyboard & Mouse Combo, Reliable 2.4GHz wireless",
            price: "RM129.00",
            badge: null,
            image: "/images/products/logitech-mk270.png",
        },
    ];
    const dbProducts = usePage().props.products as any[] | undefined;
    const productList = dbProducts?.length ? dbProducts : staticProducts;
    const heroHighlights = [
        {
            icon: Shield,
            title: "Genuine Products",
            desc: "100% original and warranty included",
        },
        {
            icon: Settings,
            title: "Expert Setup",
            desc: "Professional installation and configuration",
        },
        {
            icon: Headphones,
            title: "After-Sales Support",
            desc: "Reliable support when you need it",
        },
    ];

    const supplyServices = [
        {
            icon: Printer,
            title: "IT Equipment Supply",
            desc: "Genuine products with official warranty",
        },
        {
            icon: Settings,
            title: "Installation & Configuration",
            desc: "Professional setup and system configuration",
        },
        {
            icon: Wifi,
            title: "Network Setup",
            desc: "LAN, Wi-Fi, VPN and network security",
        },
        {
            icon: Server,
            title: "System Integration",
            desc: "Integrate hardware with your business systems",
        },
        {
            icon: Wrench,
            title: "Maintenance & Support",
            desc: "Ongoing support and maintenance",
        },
    ];

    const whyChooseUs = [
        "Wide range of quality IT products",
        "Professional and certified technicians",
        "Competitive prices and flexible options",
        "Fast delivery and on-time installation",
        "Reliable after-sales support",
    ];

    const brands = [
        { name: "Dell", logo: "/images/logos/brands/dell.svg" },
        { name: "HP", logo: "/images/logos/brands/hp.svg" },
        { name: "Lenovo", logo: "/images/logos/brands/lenovo.svg" },
        { name: "Cisco", logo: "/images/logos/brands/cisco.svg" },
        { name: "Ubiquiti", logo: "/images/logos/brands/ubiquiti.png" },
        { name: "APC", logo: "/images/logos/brands/apc.svg" },
        { name: "Microsoft", logo: "/images/logos/brands/microsoft.svg" },
        { name: "Intel", logo: "/images/logos/brands/intel.svg" },
    ];

    const processSteps = [
        {
            step: "01",
            icon: MessageCircle,
            title: "Send Request",
            desc: "Tell us your requirements",
        },
        {
            step: "02",
            icon: ScanLine,
            title: "Get Quotation",
            desc: "Receive a tailored quotation",
        },
        {
            step: "03",
            icon: Check,
            title: "Confirm Order",
            desc: "Approve and place order",
        },
        {
            step: "04",
            icon: Truck,
            title: "Delivery & Setup",
            desc: "We deliver and setup on-site",
        },
        {
            step: "05",
            icon: Headphones,
            title: "Support",
            desc: "We're here for ongoing support",
        },
    ];

    return (
        <>
            <Head title="IT Equipment Supply & Setup" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden bg-[#050914] text-white">
                    <HeroBackground />

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
                            <Link href="/" className="hover:text-white">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href="/services" className="hover:text-white">
                                Services
                            </Link>
                            <span>/</span>
                            <span className="text-white">
                                {h.title || 'IT Equipment Supply & Setup'}
                            </span>
                        </div>

                        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
                            <div className="max-w-xl">
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-500">
                                    {h.badge || 'Our Services'}
                                </span>
                                <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
                                    {h.title || (
                                        <>
                                            IT Equipment Supply & Setup Built for{" "}
                                            <span className="text-blue-500">
                                                Productivity
                                            </span>
                                        </>
                                    )}
                                </h1>
                                <p className="mt-5 text-base leading-relaxed text-slate-300">
                                    {h.subtitle || 'We supply high-quality IT equipment and provide professional setup and configuration to get your business running smoothly.'}
                                </p>

                                <div className="mt-8 grid grid-cols-3 gap-4">
                                    {heroHighlights.map((item) => (
                                        <div
                                            key={item.title}
                                            className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <h3 className="mt-3 text-sm font-semibold">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                {h.image ? (
                                    <img
                                        src={h.image}
                                        alt="IT equipment illustration"
                                        className="w-full rounded-2xl object-cover"
                                    />
                                ) : (
                                    <ITEquipmentHeroIllustration />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quote banner */}
                <section className="bg-white py-8 lg:py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative -mt-20 rounded-3xl border border-slate-100 bg-white p-8 shadow-lg lg:-mt-24 lg:p-10">
                            <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1fr]">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        Need a Customized Solution?
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Tell us what you need and we'll send you
                                        a competitive quotation within 24 hours.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <Check className="h-4 w-4 text-blue-600" />{" "}
                                        Competitive Pricing
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <Check className="h-4 w-4 text-blue-600" />{" "}
                                        Fast Response
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <Check className="h-4 w-4 text-blue-600" />{" "}
                                        Tailored to Your Needs
                                    </div>
                                </div>
                                <Link
                                    href="/request"
                                    className="inline-flex h-11 w-fit items-center gap-2 self-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Request Quotation
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Products */}
                <section className="bg-slate-50 py-16 lg:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    Products for Sale
                                </span>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    High-quality IT equipment from trusted
                                    brands.
                                </h2>
                            </div>
                            <Link
                                href="/products"
                                className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1 hover:underline"
                            >
                                View All Products
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            {productList.slice(0, 6).map((product) => (
                                <div
                                    key={product.name}
                                    className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    {product.badge && (
                                        <span
                                            className={`absolute ml-4 mt-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${product.badge === "Best Seller" ? "bg-blue-600 text-white" : "bg-emerald-500 text-white"}`}
                                        >
                                            {product.badge}
                                        </span>
                                    )}
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={product.image?.startsWith('http') || product.image?.startsWith('/') ? product.image : '/uploads/' + product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-3">
                                        <h3 className="text-base font-semibold text-slate-900">
                                            {product.name}
                                        </h3>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {product.spec}
                                        </p>
                                        <p className="mt-3 text-lg font-bold text-blue-600">
                                            {product.price}
                                        </p>
                                        <Link
                                            href="/request"
                                            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                                        >
                                            Request Quotation
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services & Why Choose Us */}
                <section className="bg-white py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Our Supply & Setup Services
                                </h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    End-to-end solutions from supply to
                                    installation and ongoing support.
                                </p>
                                <div className="mt-6 space-y-4">
                                    {supplyServices.map((svc) => (
                                        <div
                                            key={svc.title}
                                            className="flex items-start gap-4"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <svc.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">
                                                    {svc.title}
                                                </h4>
                                                <p className="text-xs text-slate-600">
                                                    {svc.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Why Businesses Choose Us
                                </h3>
                                <ul className="mt-6 space-y-3">
                                    {whyChooseUs.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-sm text-slate-700"
                                        >
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-center">
                                    <Shield className="mx-auto h-10 w-10 text-blue-600" />
                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        100%
                                    </p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        Customer Satisfaction
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Brands */}
                <section className="bg-white py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                            Trusted Brands We Work With
                        </p>
                        <div className="group mt-6 overflow-hidden">
                            <div
                                className="flex items-center gap-8 lg:gap-10 group-hover:[animation-play-state:paused]"
                                style={{
                                    width: "max-content",
                                    animation:
                                        "brandMarquee 35s linear infinite",
                                }}
                            >
                                {[...brands, ...brands].map((brand, idx) => (
                                    <div
                                        key={`${brand.name}-${idx}`}
                                        className="flex h-10 w-32 shrink-0 items-center justify-center"
                                    >
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="max-h-10 max-w-[120px] object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <style>{`
                        @keyframes brandMarquee {
                            0% { transform: translateX(-50%); }
                            100% { transform: translateX(0); }
                        }
                    `}</style>
                </section>

                {/* Process */}
                <section className="bg-slate-50 py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 max-w-lg">
                            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Our Process
                            </span>
                            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                Simple & Transparent Process
                            </h2>
                            <p className="mt-4 text-sm text-slate-600">
                                From request to deployment, we keep you informed
                                every step of the way.
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                            {processSteps.map((step, idx) => (
                                <div
                                    key={step.title}
                                    className="relative flex flex-col rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm"
                                >
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                        {step.step}
                                    </div>
                                    <div className="mx-auto mt-2 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <step.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-3 text-sm font-semibold text-slate-900">
                                        {step.title}
                                    </h3>
                                    <p className="mt-1.5 text-xs text-slate-600">
                                        {step.desc}
                                    </p>
                                    {idx < processSteps.length - 1 && (
                                        <div className="hidden lg:absolute lg:-right-4 lg:top-1/2 lg:-translate-y-1/2">
                                            <ArrowRight className="h-4 w-4 text-slate-300" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <ITEquipmentCta />
                <LandingFooter mode="dark" />
            </div>
        </>
    );
}

function ITEquipmentCta() {
    return (
        <section className="relative overflow-hidden bg-[#050914] py-16 text-white">
            <HeroBackground />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
                    <div className="max-w-lg">
                        <h2 className="text-3xl font-bold">
                            Ready to Upgrade Your IT Infrastructure?
                        </h2>
                        <p className="mt-3 text-sm text-slate-300">
                            Get the right equipment and professional setup to
                            power your business forward.
                        </p>
                    </div>
                    <Link
                        href="/request"
                        className="inline-flex h-11 w-fit items-center gap-2 self-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Request Quotation
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function ITEquipmentHeroIllustration() {
    return (
        <svg
            viewBox="0 0 520 360"
            className="w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="IT equipment illustration"
        >
            <defs>
                <linearGradient id="iteLaptop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="iteScreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="100%" stopColor="#172554" />
                </linearGradient>
            </defs>

            {/* Desktop monitor */}
            <rect
                x="180"
                y="40"
                width="200"
                height="140"
                rx="10"
                fill="url(#iteLaptop)"
                stroke="#334155"
                strokeWidth="2"
            />
            <rect
                x="190"
                y="50"
                width="180"
                height="120"
                rx="4"
                fill="url(#iteScreen)"
            />
            <rect x="270" y="180" width="20" height="30" fill="#334155" />
            <rect x="250" y="210" width="60" height="6" rx="3" fill="#334155" />

            {/* Laptop */}
            <rect
                x="60"
                y="140"
                width="140"
                height="90"
                rx="8"
                fill="url(#iteLaptop)"
                stroke="#334155"
                strokeWidth="2"
            />
            <rect
                x="68"
                y="148"
                width="124"
                height="74"
                rx="4"
                fill="url(#iteScreen)"
            />
            <rect
                x="60"
                y="230"
                width="140"
                height="12"
                rx="4"
                fill="#334155"
            />

            {/* Server / PC tower */}
            <rect
                x="400"
                y="80"
                width="80"
                height="170"
                rx="10"
                fill="url(#iteLaptop)"
                stroke="#334155"
                strokeWidth="2"
            />
            <circle cx="440" cy="110" r="12" fill="#334155" />
            <circle cx="440" cy="110" r="6" fill="#3B82F6" />
            <rect x="415" y="140" width="50" height="6" rx="3" fill="#334155" />
            <rect x="415" y="155" width="50" height="6" rx="3" fill="#334155" />
            <rect x="415" y="170" width="50" height="6" rx="3" fill="#334155" />

            {/* Printer */}
            <rect
                x="80"
                y="260"
                width="110"
                height="60"
                rx="8"
                fill="#334155"
            />
            <rect x="90" y="250" width="90" height="30" rx="4" fill="#475569" />
            <rect
                x="110"
                y="280"
                width="50"
                height="10"
                rx="2"
                fill="#1E293B"
            />

            {/* Router / access point */}
            <rect
                x="330"
                y="260"
                width="90"
                height="30"
                rx="6"
                fill="#334155"
            />
            <circle cx="350" cy="275" r="3" fill="#3B82F6" />
            <circle cx="365" cy="275" r="3" fill="#3B82F6" />
            <circle cx="380" cy="275" r="3" fill="#3B82F6" />
            <circle cx="395" cy="275" r="3" fill="#3B82F6" />
        </svg>
    );
}

function AnalyticsDashboard() {
    const linePoints =
        "10,95 30,88 50,82 70,75 90,68 110,72 130,60 150,55 170,48 190,42 210,45 230,32 250,28 270,18 290,8";

    const channels = [
        { label: "Organic Search", value: 45, color: "bg-blue-600" },
        { label: "Paid Search", value: 25, color: "bg-blue-400" },
        { label: "Social Media", value: 15, color: "bg-sky-400" },
        { label: "Direct", value: 10, color: "bg-slate-400" },
        { label: "Others", value: 5, color: "bg-slate-600" },
    ];

    return (
        <div className="relative rounded-2xl border border-slate-700/50 bg-[#0b1221]/90 p-5 shadow-2xl backdrop-blur">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-white">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-green-500/20 text-green-400">
                    <BarChart3 className="h-3.5 w-3.5" />
                </span>
                Google Analytics 4
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-800/60 p-4">
                    <p className="text-xs text-slate-400">Users</p>
                    <p className="mt-1 text-2xl font-bold text-white">42.6K</p>
                    <p className="mt-1 text-xs text-green-400">+28.5%</p>
                </div>
                <div className="rounded-xl bg-slate-800/60 p-4">
                    <p className="text-xs text-slate-400">Sessions</p>
                    <p className="mt-1 text-2xl font-bold text-white">68.3K</p>
                    <p className="mt-1 text-xs text-green-400">+32.1%</p>
                </div>
                <div className="rounded-xl bg-slate-800/60 p-4">
                    <p className="text-xs text-slate-400">Conversions</p>
                    <p className="mt-1 text-2xl font-bold text-white">2.9K</p>
                    <p className="mt-1 text-xs text-green-400">+46.7%</p>
                </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
                <div className="rounded-xl bg-slate-800/60 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs text-slate-300">
                            Sessions Over Time
                        </p>
                    </div>
                    <div className="relative h-36 w-full">
                        <svg
                            viewBox="0 0 300 100"
                            className="h-full w-full"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <linearGradient
                                    id="lineGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#3b82f6"
                                        stopOpacity="0.35"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#3b82f6"
                                        stopOpacity="0"
                                    />
                                </linearGradient>
                            </defs>
                            <path
                                d={`M${linePoints} L290,100 L10,100 Z`}
                                fill="url(#lineGrad)"
                            />
                            <polyline
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2.5"
                                points={linePoints}
                            />
                            {[10, 90, 170, 250, 290].map((x, i) => (
                                <circle
                                    key={i}
                                    cx={x}
                                    cy={linePoints.split(" ")[i].split(",")[1]}
                                    r="3"
                                    fill="#60a5fa"
                                />
                            ))}
                        </svg>
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                        <span>May 1</span>
                        <span>May 8</span>
                        <span>May 15</span>
                        <span>May 22</span>
                        <span>May 29</span>
                    </div>
                </div>

                <div className="rounded-xl bg-slate-800/60 p-4">
                    <p className="text-xs text-slate-300">Top Channels</p>
                    <div className="mt-3 flex items-center gap-4">
                        <div className="relative h-24 w-24 shrink-0">
                            <svg
                                viewBox="0 0 36 36"
                                className="h-full w-full -rotate-90"
                            >
                                {
                                    channels.reduce(
                                        (acc, ch, i) => {
                                            const dash = (ch.value / 100) * 100;
                                            const circle = (
                                                <circle
                                                    key={ch.label}
                                                    cx="18"
                                                    cy="18"
                                                    r="15.9"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    className={ch.color}
                                                    strokeDasharray={`${dash} ${100 - dash}`}
                                                    strokeDashoffset={
                                                        -acc.offset
                                                    }
                                                />
                                            );
                                            return {
                                                offset: acc.offset + dash,
                                                elements: [
                                                    ...acc.elements,
                                                    circle,
                                                ],
                                            };
                                        },
                                        {
                                            offset: 0,
                                            elements: [] as React.ReactNode[],
                                        },
                                    ).elements
                                }
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Search className="h-5 w-5 text-blue-400" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                            {channels.map((ch) => (
                                <div
                                    key={ch.label}
                                    className="flex items-center justify-between text-xs"
                                >
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <span
                                            className={`h-2 w-2 rounded-full ${ch.color}`}
                                        />
                                        {ch.label}
                                    </span>
                                    <span className="font-medium text-slate-300">
                                        {ch.value}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-[10px] text-slate-500">
                                New Users
                            </p>
                            <p className="text-lg font-semibold text-white">
                                32.8K
                            </p>
                            <p className="text-[10px] text-green-400">+30.4%</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500">
                                Returning Users
                            </p>
                            <p className="text-lg font-semibold text-white">
                                9.8K
                            </p>
                            <p className="text-[10px] text-green-400">+18.6%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating social badges */}
            <div className="absolute -right-4 top-10 hidden flex-col gap-3 lg:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4285F4] text-white shadow-lg">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="currentColor"
                    >
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="currentColor"
                    >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-lg">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="currentColor"
                    >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-lg">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="currentColor"
                    >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#000000] text-white shadow-lg">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="currentColor"
                    >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
