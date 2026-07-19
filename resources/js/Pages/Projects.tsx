import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, FolderKanban, Plus, Search, Paperclip, Trash2, FileText, Pencil, Eye } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge, Progress } from '@/Layouts/Dashboard';

const inputClass = 'mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none';
const labelClass = 'block text-sm font-medium text-slate-700';

interface RequestFile {
    id: number;
    filename: string;
    size: number;
    url: string;
}

interface Project {
    id: number;
    user_id?: number;
    client?: string;
    title: string;
    category: string;
    service_type?: string | null;
    system_type?: string | null;
    features?: string | null;
    user_roles?: string | null;
    integrations?: string | null;
    budget?: string | null;
    deadline?: string | null;
    hosting_domain?: string | null;
    additional_notes?: string | null;
    description: string | null;
    key_person?: string | null;
    status_remark?: string | null;
    progress: number;
    status: string;
    payment_status?: string;
    total_paid?: string;
    icon_color: string;
    created_at: string;
    files: RequestFile[];
    has_invoice: boolean;
}

interface ProjectsProps {
    projects: Project[];
    filters: { status: string | null; search: string | null };
    clients?: { id: number; label: string }[];
    preselect_user_id?: string | null;
}

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
];

const serviceOptions = [
    { value: 'web_system', label: 'Web System' },
    { value: 'website', label: 'Website Development' },
    { value: 'mobile_app', label: 'Mobile App Development' },
    { value: 'digital_marketing', label: 'Digital Marketing' },
    { value: 'it_solutions', label: 'IT Solutions' },
    { value: 'game_development', label: 'Game Development' },
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

const paymentBadgeColor = (status?: string) => {
    switch (status) {
        case 'paid':
            return 'green';
        case 'partial':
            return 'amber';
        default:
            return 'red';
    }
};

export default function Projects({ projects, filters, clients = [], preselect_user_id }: ProjectsProps) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.isAdmin;
    const [status, setStatus] = useState(filters.status ?? '');
    const [search, setSearch] = useState(filters.search ?? '');
    const [editingProgressId, setEditingProgressId] = useState<number | null>(null);
    const [progressValue, setProgressValue] = useState(0);
    const handleFilter = () => {
        router.get('/projects', { status, search }, { preserveState: true, replace: true });
    };

    const deleteProject = (id: number) => {
        if (!confirm('Delete this project?')) return;
        router.delete(`/projects/${id}`);
    };

    return (
        <>
            <Head title="Projects" />

            <DashboardLayout title="Projects">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {isAdmin ? 'All Client Projects' : 'Your Projects'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {isAdmin
                                ? 'Monitor and update progress for every client.'
                                : 'Track the progress of all your ongoing projects.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/projects/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" /> New Project
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                        >
                            Back to Dashboard <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

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
                            {statusOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleFilter}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Filter
                        </button>
                    </div>
                </Card>

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
                                        {isAdmin && project.client && (
                                            <p className="text-xs font-medium text-blue-600">{project.client}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge color={statusBadgeColor(project.status)}>
                                        {project.status.replace('_', ' ')}
                                    </Badge>
                                    {isAdmin && (
                                        <Badge color={paymentBadgeColor(project.payment_status)}>
                                            {project.payment_status ?? 'unpaid'}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                {project.system_type && (
                                    <p className="text-xs text-slate-500">
                                        <span className="font-semibold">System:</span> {project.system_type}
                                    </p>
                                )}
                                {project.features && (
                                    <p className="text-xs text-slate-500">
                                        <span className="font-semibold">Features:</span> {project.features.length > 60 ? project.features.slice(0, 60) + '…' : project.features}
                                    </p>
                                )}
                                {project.user_roles && (
                                    <p className="text-xs text-slate-500">
                                        <span className="font-semibold">Roles:</span> {project.user_roles.length > 60 ? project.user_roles.slice(0, 60) + '…' : project.user_roles}
                                    </p>
                                )}
                                {project.integrations && (
                                    <p className="text-xs text-slate-500">
                                        <span className="font-semibold">Integrations:</span> {project.integrations.length > 60 ? project.integrations.slice(0, 60) + '…' : project.integrations}
                                    </p>
                                )}
                                {project.budget && (
                                    <p className="text-xs text-slate-500">
                                        <span className="font-semibold">Budget:</span> {project.budget}
                                    </p>
                                )}
                                {project.deadline && (
                                    <p className="text-xs text-slate-500">
                                        <span className="font-semibold">Deadline:</span> {project.deadline}
                                    </p>
                                )}
                            </div>

                            {project.key_person && (
                                <p className="mt-2 text-xs text-slate-500">
                                    <span className="font-semibold">Key Person:</span> {project.key_person}
                                </p>
                            )}
                            {project.status_remark && (
                                <p className="mt-1 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                                    <span className="font-semibold">Status:</span> {project.status_remark}
                                </p>
                            )}

                            {project.files && project.files.length > 0 && (
                                <div className="mt-3 space-y-1">
                                    <span className="text-xs font-medium text-slate-500">Files</span>
                                    {project.files.map((f) => (
                                        <a
                                            key={f.id}
                                            href={f.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-blue-600 hover:bg-blue-50"
                                        >
                                            <Paperclip className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{f.filename}</span>
                                            <span className="ml-auto shrink-0 text-[10px] text-slate-400">
                                                {f.size > 1024 ? `${(f.size / 1024).toFixed(1)} KB` : `${f.size} B`}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            )}

                            {project.total_paid && parseFloat(project.total_paid) > 0 && (
                                <p className="mt-3 text-sm">
                                    <span className="text-slate-500">Total Paid:</span>{' '}
                                    <span className="font-semibold text-emerald-600">${project.total_paid}</span>
                                </p>
                            )}

                            <div className="mt-6">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Progress</span>
                                    {isAdmin && editingProgressId === project.id ? (
                                        <span className="font-semibold text-blue-600">{progressValue}%</span>
                                    ) : (
                                        <span className="font-semibold text-slate-700">{project.progress}%</span>
                                    )}
                                </div>
                                {isAdmin && editingProgressId === project.id ? (
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            value={progressValue}
                                            onChange={(e) => setProgressValue(Number(e.target.value))}
                                            onMouseUp={() => {
                                                router.put(`/projects/${project.id}`, {
                                                    progress: progressValue,
                                                    status: project.status,
                                                    payment_status: project.payment_status ?? 'unpaid',
                                                    key_person: project.key_person ?? '',
                                                    status_remark: project.status_remark ?? '',
                                                }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                    onSuccess: () => setEditingProgressId(null),
                                                });
                                            }}
                                            className="w-full accent-blue-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setEditingProgressId(null)}
                                            className="text-xs text-slate-400 hover:text-slate-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <Progress value={project.progress} />
                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() => { setEditingProgressId(project.id); setProgressValue(project.progress); }}
                                                className="absolute inset-0 cursor-pointer"
                                                title="Click to update progress"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                <span className="text-xs text-slate-400">Started {project.created_at}</span>
                                <div className="flex items-center gap-2">
                                    {isAdmin && !project.has_invoice && (
                                        <Link
                                            href={`/invoices?user_id=${project.user_id}&project_id=${project.id}&new=1`}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:underline"
                                        >
                                            <FileText className="h-3.5 w-3.5" /> Invoice
                                        </Link>
                                    )}
                                    <Link
                                        href={`/projects/${project.id}/edit`}
                                        className="text-slate-400 hover:text-blue-600"
                                        title="Update"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                    {isAdmin && project.has_invoice && (
                                        <Link
                                            href={`/invoices?user_id=${project.user_id}&project_id=${project.id}`}
                                            className="text-xs text-slate-400 hover:text-blue-600"
                                            title="View invoices"
                                        >
                                            <FileText className="h-4 w-4" />
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <button
                                            onClick={() => deleteProject(project.id)}
                                            className="text-slate-400 hover:text-red-500"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                    <Link
                                        href={`/projects/${project.id}`}
                                        className="text-slate-400 hover:text-blue-600"
                                        title="View Details"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="py-16 text-center">
                        <p className="text-lg font-semibold text-slate-900">No projects found</p>
                        <p className="text-sm text-slate-500">
                            {isAdmin
                                ? 'No client projects yet.'
                                : 'Try adjusting your filters or create a new project.'}
                        </p>
                    </div>
                )}
            </DashboardLayout>

        </>
    );
}
