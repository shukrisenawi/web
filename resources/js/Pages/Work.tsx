import { Head } from '@inertiajs/react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { ProjectsGrid } from '@/Components/ProjectsGrid';
import { Cta } from '@/Components/Cta';

export default function Work() {
    return (
        <>
            <Head title="Work" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                <div className="bg-slate-950 py-16 text-white sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">Our Portfolio</p>
                        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Our Work</h1>
                        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
                            A selection of projects we have delivered for clients across industries.
                        </p>
                    </div>
                </div>

                <ProjectsGrid showMore />

                <Cta />

                <LandingFooter mode="dark" />
            </div>
        </>
    );
}
