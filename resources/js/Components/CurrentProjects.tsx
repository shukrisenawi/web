import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface CurrentProject {
    title: string;
    description: string;
    category: string;
    badge: string;
    badgeColor: string;
    progress: number;
    image: string;
}

const defaultProjects: CurrentProject[] = [
    {
        title: 'FinTrack Dashboard',
        description: 'A financial analytics dashboard for business monitoring and reporting.',
        category: 'Web System',
        badge: 'Web System',
        badgeColor: 'bg-blue-500',
        progress: 25,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'HealthHub App',
        description: 'A mobile app that connects users with health professionals.',
        category: 'Mobile App',
        badge: 'Mobile App',
        badgeColor: 'bg-emerald-500',
        progress: 60,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'ShopZen Platform',
        description: 'An e-commerce platform with modern UI and seamless checkout.',
        category: 'E-Commerce',
        badge: 'E-Commerce',
        badgeColor: 'bg-purple-500',
        progress: 80,
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'School Management System',
        description: 'A comprehensive system to manage schools, students, and staff.',
        category: 'Web System',
        badge: 'Web System',
        badgeColor: 'bg-blue-500',
        progress: 65,
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    },
];

export function CurrentProjects() {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};
    const projects = (c.current_projects || defaultProjects) as CurrentProject[];

    return (
        <section className="py-20 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Current Projects</p>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                            {c.current_projects_title || "What We're Building Right Now"}
                        </h2>
                    </div>
                    <div className="max-w-md">
                        <p className="text-sm text-slate-600">
                            {c.current_projects_subtitle || 'A glimpse of the exciting projects we\'re currently working on.'}
                        </p>
                    </div>
                    <Link href="/work" className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1 hover:underline">
                        View All Projects
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {projects.map((project: CurrentProject, idx: number) => (
                        <div
                            key={project.title + idx}
                            className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <div className="absolute left-3 top-3 z-10">
                                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${project.badgeColor}`}>
                                        {project.badge}
                                    </span>
                                </div>
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-5">
                                <h3 className="font-semibold text-slate-900">{project.title}</h3>
                                <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Progress</span>
                                        <span className="font-semibold text-blue-600">{project.progress}%</span>
                                    </div>
                                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
