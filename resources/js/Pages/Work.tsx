import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { ArrowRight, Play, Search, ClipboardList, Code2, FlaskConical, Rocket, ShieldCheck, Users, Rocket as RocketIcon, Globe, TrendingUp } from 'lucide-react';
import { HeroBackground } from '@/Components/HeroBackground';

const iconMap: Record<string, any> = {
    ShieldCheck,
    Users,
    Rocket: RocketIcon,
    Globe,
    TrendingUp,
};

function WorkStatsDisplay() {
    const { frontpage } = usePage().props as any;
    const dbStats = frontpage?.stats || [];

    const stats = dbStats.length
        ? dbStats.map((s: any) => ({
              icon: iconMap[s.icon] || ShieldCheck,
              value: s.value || '',
              label: s.label || '',
          }))
        : [
              { icon: ShieldCheck, value: '100+', label: 'Projects\nCompleted' },
              { icon: Users, value: '50+', label: 'Happy\nClients' },
              { icon: RocketIcon, value: '5+', label: 'Years of\nExperience' },
              { icon: Globe, value: '10+', label: 'Industries\nServed' },
          ];

    return (
        <>
            {stats.map((stat: any) => (
                <div key={stat.label} className="text-center sm:text-left">
                    <stat.icon className="mx-auto mb-3 h-7 w-7 text-blue-500 sm:mx-0" />
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="mt-1 whitespace-pre-line text-sm text-slate-400">{stat.label}</p>
                </div>
            ))}
        </>
    );
}

const processSteps = [
    { icon: Search, number: '1.', title: 'Discover', desc: 'We listen and understand your goals and challenges.' },
    { icon: ClipboardList, number: '2.', title: 'Plan', desc: 'We create a strategy and roadmap tailored for you.' },
    { icon: Code2, number: '3.', title: 'Build', desc: 'We design and develop with clean and scalable code.' },
    { icon: FlaskConical, number: '4.', title: 'Test', desc: 'We ensure everything works perfectly across devices.' },
    { icon: Rocket, number: '5.', title: 'Launch', desc: 'We deploy and support you to grow even further.' },
];

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

interface Project {
    title: string;
    category?: string;
    description?: string;
    image: string;
    slug?: string;
}

export default function Work() {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};
    const h = frontpage?.work_hero ?? {};
    const projects: Project[] = (c.projects || []);

    const categories = ['All Projects', ...Array.from(new Set(projects.map((p: Project) => p.category).filter(Boolean))) as string[]];
    const [activeCategory, setActiveCategory] = useState('All Projects');

    const filteredProjects = activeCategory === 'All Projects'
        ? projects
        : projects.filter((p: Project) => p.category === activeCategory);

    return (
        <>
            <Head title="Work" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden bg-[#050914] pt-16 pb-20 text-white">
                    <HeroBackground />

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">{h.badge || 'Our Work'}</p>
                                <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                                    {h.title || <>Real Solutions. <br />
                                    <span className="text-blue-500">Real Results.</span></>}
                                </h1>
                                <p className="mt-6 max-w-lg text-slate-300">
                                    {h.subtitle || 'We take pride in building digital solutions that make a difference. Here are some of the projects we’ve built for our amazing clients.'}
                                </p>

                                <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                                    <WorkStatsDisplay />
                                </div>
                            </div>

                            <div className="relative mx-auto max-w-xl lg:max-w-none">
                                <div className="relative">
                                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-2xl bg-blue-600/80 p-4 shadow-lg shadow-blue-900/50">
                                        <Code2 className="h-full w-full text-white" />
                                    </div>
                                    <img
                                        src={h.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'}
                                        alt="Digital solutions preview"
                                        className="rounded-2xl border border-white/10 shadow-2xl shadow-blue-900/30"
                                    />
                                    <div className="absolute -bottom-6 -left-6 max-w-[180px] rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-xl backdrop-blur">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-blue-600 p-2">
                                                <Rocket className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Growth</p>
                                                <p className="text-xs text-slate-400">Digital Solutions</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-600/15 blur-3xl" />
                                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-600/15 blur-3xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {categories.map((category: string) => (
                                <button
                                    type="button"
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`rounded-lg border px-5 py-2 text-sm font-medium transition-colors ${
                                        activeCategory === category
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-blue-600 hover:text-blue-600'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredProjects.map((project: Project) => {
                                const slug = project.slug || slugify(project.title);
                                return (
                                    <div
                                        key={slug}
                                        className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                                    >
                                        <Link href={`/work/${slug}`} className="block">
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        </Link>
                                        <div className="p-5">
                                            <h3 className="font-semibold text-slate-900">{project.title}</h3>
                                            <p className="mt-1 text-sm font-medium text-blue-600">{project.category}</p>
                                            <p className="mt-1 text-sm text-slate-500 line-clamp-2">{project.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </section>

                {/* Process */}
                <section className="bg-slate-50 py-20">
                    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Our Process</p>
                        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">How We Deliver Great Results</h2>

                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                            {processSteps.map((step, idx) => (
                                <div key={step.title} className="relative">
                                    {idx < processSteps.length - 1 && (
                                        <div className="hidden lg:block absolute left-[60%] top-10 w-[80%] border-t-2 border-dashed border-slate-300"></div>
                                    )}
                                    <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                                        <step.icon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <p className="mt-4 text-sm font-semibold text-blue-600">{step.number} {step.title}</p>
                                    <p className="mt-2 text-sm text-slate-500">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div
                            className="relative overflow-hidden rounded-3xl bg-slate-950 px-8 py-16 text-white md:px-16 md:py-20 lg:py-24"
                            style={{
                                backgroundImage: 'linear-gradient(to right, rgba(5,9,20,0.95), rgba(5,9,20,0.75)), url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="relative z-10 max-w-lg">
                                <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                                    Let’s build something <br />
                                    <span className="text-blue-500">great together.</span>
                                </h2>
                                <p className="mt-4 text-sm text-slate-300">
                                    Have a project in mind? We’d love to hear about it. Let’s create something amazing for your business.
                                </p>
                                <Link
                                    href="/contact"
                                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                >
                                    Request Quotation
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <LandingFooter mode="dark" />
            </div>
        </>
    );
}
