import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, FolderKanban, Search } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge, Progress } from '@/Layouts/Dashboard';

interface Project {
    id: number;
    title: string;
    category: string;
    description: string | null;
    progress: number;
    status: string;
    icon_color: string;
    created_at: string;
}

interface ProjectsProps {
    projects: Project[];
    filters: {
        status: string | null;
        search: string | null;
    };
}

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
];

const statusBadgeColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'green';
        case 'on_hold':
            return 'amber';
        default:
            return 'blue';
    }
};

export default function Projects({ projects, filters }: ProjectsProps) {
    const [status, setStatus] = useState(filters.status ?? '');
    const [search, setSearch] = useState(filters.search ?? '');

    const handleFilter = () => {
        router.get(
            '/projects',
            { status, search },
            { preserveState: true, replace: true }
        );
    };

    return (
        <>
            <Head title="Projects" />

            <DashboardLayout title="Projects">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Your Projects</h2>
                        <p className="text-sm text-slate-500">Track the progress of all your ongoing projects.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                    >
                        Back to Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/** Filters */}
                <Card className="mb-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                placeholder="Search projects..."
                                className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleFilter}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Filter
                        </button>
                    </div>
                </Card>

                {/** Projects grid */}
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id} className="flex flex-col">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white"
                                        style={{ backgroundColor: project.icon_color }}
                                    >
                                        <FolderKanban className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{project.title}</h3>
                                        <p className="text-xs text-slate-500">{project.category}</p>
                                    </div>
                                </div>
                                <Badge color={statusBadgeColor(project.status)}>
                                    {project.status.replace('_', ' ')}
                                </Badge>
                            </div>

                            <p className="mt-4 line-clamp-2 text-sm text-slate-600">{project.description}</p>

                            <div className="mt-6">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Progress</span>
                                    <span className="font-semibold text-slate-700">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} />
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                <span className="text-xs text-slate-400">Started {project.created_at}</span>
                                <button type="button" className="text-sm font-semibold text-blue-600 hover:underline">
                                    View Details
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="py-16 text-center">
                        <p className="text-lg font-semibold text-slate-900">No projects found</p>
                        <p className="text-sm text-slate-500">Try adjusting your filters or contact support to start a new project.</p>
                    </div>
                )}
            </DashboardLayout>
        </>
    );
}
