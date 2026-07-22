import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface CurrentProject {
    title: string;
    description: string;
    category: string;
    badge: string;
    badgeColor: string;
    image: string;
}

export function CurrentProjects() {
    const { currentProjects } = usePage().props as any;
    const projects: CurrentProject[] = currentProjects || [];

    return (
        <section className="py-20 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Current Projects</p>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                            What We're Building Right Now
                        </h2>
                    </div>
                    <div className="max-w-md">
                        <p className="text-sm text-slate-600">
                            A glimpse of the exciting projects we're currently working on.
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
