import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { ArrowRight, Play, Search, ClipboardList, Code2, FlaskConical, Rocket, ShieldCheck, Users, Rocket as RocketIcon, Globe } from 'lucide-react';
import { HeroBackground } from '@/Components/HeroBackground';

const stats = [
    { icon: ShieldCheck, value: '100+', label: 'Projects\nCompleted' },
    { icon: Users, value: '50+', label: 'Happy\nClients' },
    { icon: RocketIcon, value: '5+', label: 'Years of\nExperience' },
    { icon: Globe, value: '10+', label: 'Industries\nServed' },
];

const categories = [
    'All Projects',
    'Web Development',
    'Mobile App',
    'Web System',
    'Game Development',
    'Digital Marketing',
];

const projects = [
    {
        title: 'Food Delivery Website',
        category: 'Web Development',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
        slug: 'food-delivery-website',
    },
    {
        title: 'Fintech Mobile App',
        category: 'Mobile App',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        slug: 'fintech-mobile-app',
    },
    {
        title: 'School Management System',
        category: 'Web System',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        slug: 'school-management-system',
    },
    {
        title: 'RPG Mobile Game',
        category: 'Game Development',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        slug: 'rpg-mobile-game',
    },
    {
        title: 'Digital Marketing Campaign',
        category: 'Digital Marketing',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        slug: 'digital-marketing-campaign',
    },
    {
        title: 'E-Commerce Website',
        category: 'Web Development',
        image: 'https://images.unsplash.com/photo-1472851294608-4155227b322c?auto=format&fit=crop&w=800&q=80',
        slug: 'e-commerce-website',
    },
    {
        title: 'Logistics Management System',
        category: 'Web System',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        slug: 'logistics-management-system',
    },
    {
        title: 'Corporate Website',
        category: 'Web Development',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        slug: 'corporate-website',
    },
];

const processSteps = [
    { icon: Search, number: '1.', title: 'Discover', desc: 'We listen and understand your goals and challenges.' },
    { icon: ClipboardList, number: '2.', title: 'Plan', desc: 'We create a strategy and roadmap tailored for you.' },
    { icon: Code2, number: '3.', title: 'Build', desc: 'We design and develop with clean and scalable code.' },
    { icon: FlaskConical, number: '4.', title: 'Test', desc: 'We ensure everything works perfectly across devices.' },
    { icon: Rocket, number: '5.', title: 'Launch', desc: 'We deploy and support you to grow even further.' },
];

export default function Work() {
    const [activeCategory, setActiveCategory] = useState('All Projects');

    const filteredProjects = activeCategory === 'All Projects'
        ? projects
        : projects.filter((p) => p.category === activeCategory);

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
                                <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">Our Work</p>
                                <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                                    Real Solutions. <br />
                                    <span className="text-blue-500">Real Results.</span>
                                </h1>
                                <p className="mt-6 max-w-lg text-slate-300">
                                    We take pride in building digital solutions that make a difference. Here are some of the projects we’ve built for our amazing clients.
                                </p>

                                <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                                    {stats.map((stat) => (
                                        <div key={stat.label} className="text-center sm:text-left">
                                            <stat.icon className="mx-auto mb-3 h-7 w-7 text-blue-500 sm:mx-0" />
                                            <p className="text-3xl font-bold">{stat.value}</p>
                                            <p className="mt-1 whitespace-pre-line text-sm text-slate-400">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative mx-auto max-w-xl lg:max-w-none">
                                <div className="relative">
                                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-2xl bg-blue-600/80 p-4 shadow-lg shadow-blue-900/50">
                                        <Code2 className="h-full w-full text-white" />
                                    </div>
                                    <img
                                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
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
                            {categories.map((category) => (
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
                            {filteredProjects.map((project) => (
                                <div
                                    key={project.slug}
                                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                                >
                                    <Link href={`/work/${project.slug}`} className="block">
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {project.category === 'Game Development' && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="rounded-full bg-white/90 p-3 shadow-lg">
                                                        <Play className="h-6 w-6 fill-blue-600 text-blue-600" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="p-5">
                                        <h3 className="font-semibold text-slate-900">{project.title}</h3>
                                        <p className="mt-1 text-sm text-slate-500">{project.category}</p>
                                        <Link
                                            href={`/work/${project.slug}`}
                                            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                                        >
                                            View Case Study
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <Link
                                href="/work"
                                className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
                            >
                                View All Projects
                                <ArrowRight className="h-4 w-4" />
                            </Link>
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
                                    Get In Touch
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
