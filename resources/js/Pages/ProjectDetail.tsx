import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { Cta } from '@/Components/Cta';
import { HeroBackground } from '@/Components/HeroBackground';
import { projectsData, slugify } from '@/Components/ProjectsGrid';
import { usePage } from '@inertiajs/react';

interface ProjectDetailProps {
    slug: string;
}

export default function ProjectDetail({ slug }: ProjectDetailProps) {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};
    const projects = (c.projects || []);
    const project = projects.find((p: any) => p.slug === slug || slugify(p.title) === slug || slugify(p.description || '') === slug);
    const extra = projectsData[slug] ?? null;

    if (!project) {
        return (
            <>
                <Head title="Project Not Found" />
                <div className="min-h-screen bg-white">
                    <LandingHeader />
                    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                        <h1 className="text-4xl font-bold text-slate-900">Project Not Found</h1>
                        <p className="mt-4 text-slate-600">The project you are looking for does not exist.</p>
                        <Link href="/work" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Work
                        </Link>
                    </div>
                    <LandingFooter mode="dark" />
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={project.title} />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                <div className="relative overflow-hidden bg-[#050914] py-16 text-white sm:py-20">
                    <HeroBackground />
                    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <Link href="/work" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Work
                        </Link>
                        <span className="mt-6 block text-sm font-semibold uppercase tracking-wider text-blue-500">{project.category}</span>
                        <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">{project.title}</h1>
                        <p className="mt-4 text-lg text-slate-300">{extra?.description || project.description}</p>
                        {(extra?.client || project.client || extra?.year || project.year) && (
                            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                {(extra?.client || project.client) && (
                                    <span className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        {extra?.client || project.client}
                                    </span>
                                )}
                                {(extra?.year || project.year) && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {extra?.year || project.year}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-start">
                            <div className="aspect-[16/10] overflow-hidden rounded-2xl">
                                <img
                                    src={extra?.image || project.image}
                                    alt={project.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900">About {project.title}</h2>
                                <div
                                    className="wysiwyg-content max-w-none text-slate-600"
                                    dangerouslySetInnerHTML={{ __html: project.full_description || extra?.content || '' }}
                                />


                            </div>
                        </div>
                    </div>
                </section>

                <Cta />

                <LandingFooter mode="dark" />
            </div>
        </>
    );
}
