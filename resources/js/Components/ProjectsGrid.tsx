import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Play } from 'lucide-react';

const projectsData: Record<string, { description: string; content: string; client?: string; year?: string; image: string }> = {
    'fintrack-dashboard': {
        description: 'A real-time financial dashboard for tracking cashflow, expenses and growth metrics.',
        content: 'FinTrack Dashboard is a modern fintech solution that helps businesses monitor their financial health in real time. It aggregates transactions, visualises cashflow trends and generates actionable reports that support smarter financial decisions.',
        client: 'Confidential Fintech Client',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    },
    'e-commerce-platform': {
        description: 'A scalable online store with inventory management, payments and order tracking.',
        content: 'This e-commerce platform was built to handle high traffic and complex product catalogues. It features secure payment integration, automated inventory updates, promotional tools and a seamless checkout experience designed to increase conversions.',
        client: 'Confidential Retail Client',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
    },
    'healthcare-portal': {
        description: 'A patient and appointment management portal for a healthcare provider.',
        content: 'The Healthcare Portal streamlines appointment booking, patient records and communication between clinics and patients. It prioritises data security, role-based access and an intuitive experience for both medical staff and patients.',
        client: 'Confidential Healthcare Client',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    },
    'saas-analytics-tool': {
        description: 'A SaaS analytics platform that turns complex data into clear insights.',
        content: 'This analytics tool helps SaaS businesses track user behaviour, subscription metrics and churn rates. With customisable dashboards and automated reporting, teams can quickly identify opportunities and optimise their product roadmap.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    },
};

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

interface ProjectsGridProps {
    showMore?: boolean;
}

export function ProjectsGrid({ showMore = false }: ProjectsGridProps) {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};
    const projects = (c.projects || []);

    return (
        <section className="py-20 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Our Work</p>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{c.projects_title || 'Featured Projects'}</h2>
                    </div>
                    {!showMore && (
                        <Link href="/work" className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1 hover:underline">
                            See More Projects
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    )}
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {projects.map((project: any, idx: number) => {
                        const slug = slugify(project.title);
                        return (
                            <Link
                                key={project.title + idx}
                                href={`/work/${slug}`}
                                className="group overflow-hidden rounded-2xl bg-white shadow-sm"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {project.overlayText && (
                                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-6">
                                            <p className="whitespace-pre-line text-lg font-bold text-white">{project.overlayText}</p>
                                            <div className="mt-3 h-1 w-12 rounded bg-amber-500"></div>
                                        </div>
                                    )}
                                    {project.play && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="rounded-full bg-white/90 p-3">
                                                <Play className="h-6 w-6 fill-blue-600 text-blue-600" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-900">{project.title}</h3>
                                    <p className="text-sm text-slate-500">{project.category}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export { projectsData, slugify };
