import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Code2,
    Target,
    ShieldCheck,
    Users,
    Rocket,
    Headphones,
    MapPin,
} from 'lucide-react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { Cta } from '@/Components/Cta';
import { HeroBackground } from '@/Components/HeroBackground';

interface TeamMember {
    name: string;
    role: string;
    image: string;
}

interface EventItem {
    day: string;
    month: string;
    title: string;
    description: string;
    location: string;
    image: string;
}

interface AboutProps {
    about_team?: TeamMember[];
    about_events?: EventItem[];
    about_team_title?: string | null;
    about_team_subtitle?: string | null;
    about_events_title?: string | null;
    about_events_subtitle?: string | null;
}

const stats = [
    { icon: ShieldCheck, value: '100+', label: 'Projects Completed' },
    { icon: Users, value: '50+', label: 'Happy Clients' },
    { icon: Rocket, value: '5+', label: 'Years Experience' },
    { icon: Headphones, value: '24/7', label: 'Support' },
];

const visionMission = [
    {
        icon: Code2,
        title: 'Our Vision',
        description: 'To be a trusted digital partner for businesses worldwide, delivering innovation with impact.',
    },
    {
        icon: Target,
        title: 'Our Mission',
        description: 'To empower businesses with smart digital solutions that are scalable, reliable, and future-ready.',
    },
];

const defaultTeam: TeamMember[] = [
    { name: 'Kenji Tan', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Alicia Chong', role: 'UI/UX Designer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
    { name: 'Marcus Lim', role: 'Lead Developer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    { name: 'Nurul Afiqah', role: 'Project Manager', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80' },
    { name: 'Daniel Ariff', role: 'Backend Developer', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
];

const defaultEvents: EventItem[] = [
    { day: '15', month: 'MAY', title: 'Tech in Motion Summit 2025', description: 'We shared insights on building scalable web applications.', location: 'Kuala Lumpur, Malaysia', image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=600&q=80' },
    { day: '24', month: 'APR', title: 'UI/UX Design Workshop', description: 'A hands-on workshop on user-centered design principles.', location: 'Petaling Jaya, Malaysia', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80' },
    { day: '10', month: 'MAR', title: 'Startup Meetup KL', description: 'Connecting with founders and sharing our startup journey.', location: 'Kuala Lumpur, Malaysia', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80' },
    { day: '20', month: 'FEB', title: 'Digital Growth Conference', description: 'Exploring digital strategies for business growth in 2025 and beyond.', location: 'Kuala Lumpur, Malaysia', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80' },
];

export default function About({
    about_team = [],
    about_events = [],
    about_team_title,
    about_team_subtitle,
    about_events_title,
    about_events_subtitle,
}: AboutProps) {
    const { props, currentProjects: sharedProjects } = usePage().props as any;
    void props;
    const currentProjects = sharedProjects || [];
    const h = props?.frontpage?.about_hero ?? {};

    const team = about_team.length > 0 ? about_team : defaultTeam;
    const events = about_events.length > 0 ? about_events : defaultEvents;

    return (
        <>
            <Head title="About Us" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden bg-[#050914] pt-16 pb-20 text-white sm:pt-20 sm:pb-24">
                    <HeroBackground />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">{h.badge || 'About Us'}</p>
                                <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                                    {h.title || <>Building Digital <br />
                                    Solutions That <span className="text-blue-500">Matter</span></>}
                                </h1>
                                <p className="mt-6 max-w-lg text-slate-300">
                                    {h.subtitle || 'Kenju Tech was founded with a simple mission: to help businesses grow through technology. We build modern websites, powerful applications, and digital experiences that drive real results.'}
                                </p>

                                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                                    {visionMission.map((item) => (
                                        <div key={item.title} className="rounded-2xl bg-slate-900/60 p-5 backdrop-blur-sm">
                                            <div className="inline-flex rounded-xl bg-blue-600/20 p-3">
                                                <item.icon className="h-6 w-6 text-blue-500" />
                                            </div>
                                            <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative flex justify-center lg:justify-end">
                                <div className="relative w-full max-w-xl">
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                                    <img
                                        src={h.image || '/images/hero.png'}
                                        alt="Kenju Tech digital solutions"
                                        className="relative w-full rounded-3xl object-cover shadow-2xl"
                                    />
                                    <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
                                    <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-600/20 blur-3xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats bar */}
                <section className="bg-white py-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-6 rounded-3xl bg-slate-950 px-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat, idx) => (
                                <div
                                    key={stat.label}
                                    className={`flex flex-col items-center gap-3 text-center ${
                                        idx !== stats.length - 1 ? 'lg:border-r lg:border-white/10' : ''
                                    }`}
                                >
                                    <div className="rounded-full bg-blue-600/20 p-3">
                                        <stat.icon className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                                        <p className="text-sm text-slate-400">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">{about_team_title || 'Our Team'}</p>
                                <h2 className="mt-2 max-w-md text-3xl font-bold text-slate-900 sm:text-4xl">
                                    {about_team_subtitle || 'Meet The People Behind Kenju Tech'}
                                </h2>
                            </div>
                            <p className="max-w-md text-sm text-slate-600">
                                A passionate team of designers, developers, and strategists working together to bring ideas to life.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                            {team.map((member) => (
                                <div
                                    key={member.name}
                                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-semibold text-slate-900">{member.name}</h3>
                                        <p className="text-sm text-slate-500">{member.role}</p>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Events */}
                <section className="border-y border-slate-100 bg-slate-50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">{about_events_title || 'Events'}</p>
                                <h2 className="mt-2 max-w-sm text-3xl font-bold text-slate-900 sm:text-4xl">
                                    {about_events_subtitle || 'Where We Connect and Grow'}
                                </h2>
                            </div>
                            <p className="max-w-md text-sm text-slate-600">
                                We actively participate in tech events, workshops, and community meetups to share knowledge and stay ahead.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {events.map((event) => (
                                <div
                                    key={event.title}
                                    className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute left-4 top-4 rounded-xl bg-white px-3 py-2 text-center shadow">
                                            <p className="text-lg font-bold leading-none text-slate-900">{event.day}</p>
                                            <p className="text-xs font-semibold uppercase text-blue-600">{event.month}</p>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-semibold text-slate-900">{event.title}</h3>
                                        <p className="mt-2 text-sm text-slate-600">{event.description}</p>
                                        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                                            <MapPin className="h-3.5 w-3.5 text-blue-600" />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Current Projects */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Current Projects</p>
                                <h2 className="mt-2 max-w-sm text-3xl font-bold text-slate-900 sm:text-4xl">What We're Building Right Now</h2>
                            </div>
                            <p className="max-w-md text-sm text-slate-600">
                                A glimpse of the exciting projects we're currently working on.
                            </p>
                            <Link
                                href="/work"
                                className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1 hover:underline"
                            >
                                View All Projects
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {currentProjects.map((project: any) => (
                                <div
                                    key={project.title}
                                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <span className="absolute left-4 top-4 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow">
                                            {project.category}
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-semibold text-slate-900">{project.title}</h3>
                                        <p className="mt-2 text-sm text-slate-600">{project.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <Cta />

                <LandingFooter mode="dark" />
            </div>
        </>
    );
}
