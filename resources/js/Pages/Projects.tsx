import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, FolderKanban, Plus, Search, X, Trash2, Save, Paperclip, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DashboardLayout, Card, Badge, Progress } from '@/Layouts/Dashboard';

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
    description: string | null;
    key_person?: string | null;
    status_remark?: string | null;
    progress: number;
    status: string;
    payment_status?: string;
    icon_color: string;
    created_at: string;
    files: RequestFile[];
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
    const [createOpen, setCreateOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [uploading, setUploading] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const createForm = useForm({
        user_id: preselect_user_id ?? '',
        title: '',
        service_type: 'web_system',
        description: '',
        key_person: '',
        status_remark: '',
        request_quotation: false,
    });

    const editForm = useForm({
        progress: 0,
        status: 'in_progress',
        payment_status: 'unpaid',
        key_person: '',
        status_remark: '',
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('new') === '1') {
            if (preselect_user_id) createForm.setData('user_id', preselect_user_id);
            setCreateOpen(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilter = () => {
        router.get('/projects', { status, search }, { preserveState: true, replace: true });
    };

    const openCreate = () => {
        createForm.reset();
        setCreateOpen(true);
    };

    const submitCreate = () => {
        createForm.post('/projects', {
            onSuccess: () => setCreateOpen(false),
        });
    };

    const openEdit = (p: Project) => {
        editForm.setData({
            progress: p.progress,
            status: p.status,
            payment_status: p.payment_status ?? 'unpaid',
            key_person: p.key_person ?? '',
            status_remark: p.status_remark ?? '',
        });
        setEditId(p.id);
    };

    const submitEdit = () => {
        if (editId === null) return;
        editForm.put(`/projects/${editId}`, {
            onSuccess: () => setEditId(null),
        });
    };

    const deleteProject = (id: number) => {
        if (!confirm('Delete this project?')) return;
        router.delete(`/projects/${id}`);
    };

    const triggerUpload = (projectId: number) => {
        setUploading(projectId);
        fileInputRef.current?.click();
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || uploading === null) return;
        const formData = new FormData();
        formData.append('file', file);
        router.post(`/projects/${uploading}/files`, formData, {
            onFinish: () => {
                setUploading(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
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
                        <button
                            type="button"
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" /> New Project
                        </button>
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

                            <p className="mt-4 line-clamp-2 text-sm text-slate-600">{project.description}</p>

                            {(project.files.length > 0 || isAdmin) && (
                                <div className="mt-3 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-slate-500">Files</span>
                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() => triggerUpload(project.id)}
                                                disabled={uploading === project.id}
                                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                            >
                                                <Upload className="h-3 w-3" />
                                                {uploading === project.id ? 'Uploading...' : 'Upload'}
                                            </button>
                                        )}
                                    </div>
                                    {project.files.map((f) => (
                                        <a
                                            key={f.id}
                                            href={f.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-blue-600 hover:bg-blue-50"
                                        >
                                            <Paperclip className="h-3 w-3" />
                                            <span className="truncate">{f.filename}</span>
                                            <span className="ml-auto shrink-0 text-[10px] text-slate-400">
                                                {f.size > 1024 ? `${(f.size / 1024).toFixed(1)} KB` : `${f.size} B`}
                                            </span>
                                        </a>
                                    ))}
                                    {project.files.length === 0 && (
                                        <p className="text-[10px] text-slate-400">No files yet.</p>
                                    )}
                                </div>
                            )}

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

                            <div className="mt-6">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Progress</span>
                                    <span className="font-semibold text-slate-700">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} />
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                <span className="text-xs text-slate-400">Started {project.created_at}</span>
                                {isAdmin ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEdit(project)}
                                            className="text-sm font-semibold text-blue-600 hover:underline"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => deleteProject(project.id)}
                                            className="text-slate-400 hover:text-red-500"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href={`/projects/${project.id}`}
                                        className="text-sm font-semibold text-blue-600 hover:underline"
                                    >
                                        View Details
                                    </Link>
                                )}
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

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelected}
                accept="*/*"
            />

            {createOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">
                                {isAdmin ? 'New Project' : 'New Project Request'}
                            </h3>
                            <button type="button" onClick={() => setCreateOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {isAdmin && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Client</label>
                                    <select
                                        value={createForm.data.user_id}
                                        onChange={(e) => createForm.setData('user_id', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">Select a client...</option>
                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>{c.label}</option>
                                        ))}
                                    </select>
                                    {createForm.errors.user_id && (
                                        <p className="mt-1 text-xs text-red-500">{createForm.errors.user_id}</p>
                                    )}
                                </div>
                            )}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Project Title</label>
                                <input
                                    value={createForm.data.title}
                                    onChange={(e) => createForm.setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="e.g. Company Website Revamp"
                                />
                                {createForm.errors.title && (
                                    <p className="mt-1 text-xs text-red-500">{createForm.errors.title}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Service</label>
                                <select
                                    value={createForm.data.service_type}
                                    onChange={(e) => createForm.setData('service_type', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    {serviceOptions.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="Tell us about your project..."
                                />
                            </div>
                            {isAdmin && (
                                <>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Key Person (PIC)</label>
                                        <input
                                            value={createForm.data.key_person}
                                            onChange={(e) => createForm.setData('key_person', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="e.g. Ahmad (Project Manager)"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Status Remark</label>
                                        <textarea
                                            value={createForm.data.status_remark}
                                            onChange={(e) => createForm.setData('status_remark', e.target.value)}
                                            rows={2}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="Note visible to the client about current status..."
                                        />
                                    </div>
                                </>
                            )}
                            {!isAdmin && (
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={createForm.data.request_quotation}
                                        onChange={(e) => createForm.setData('request_quotation', e.target.checked)}
                                    />
                                    Request a quotation instead of a package
                                </label>
                            )}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCreateOpen(false)}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={submitCreate}
                                    disabled={createForm.processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    <Save className="h-4 w-4" /> {isAdmin ? 'Create Project' : 'Submit Request'}
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {isAdmin && editId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-md">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Update Project</h3>
                            <button onClick={() => setEditId(null)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Progress: {editForm.data.progress}%
                                </label>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={editForm.data.progress}
                                    onChange={(e) => editForm.setData('progress', Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                                <select
                                    value={editForm.data.status}
                                    onChange={(e) => editForm.setData('status', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="on_hold">On Hold</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Payment Status</label>
                                <select
                                    value={editForm.data.payment_status}
                                    onChange={(e) => editForm.setData('payment_status', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="unpaid">Unpaid</option>
                                    <option value="partial">Partial</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            {isAdmin && (
                                <>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Key Person (PIC)</label>
                                        <input
                                            value={editForm.data.key_person}
                                            onChange={(e) => editForm.setData('key_person', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="e.g. Ahmad (Project Manager)"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Status Remark</label>
                                        <textarea
                                            value={editForm.data.status_remark}
                                            onChange={(e) => editForm.setData('status_remark', e.target.value)}
                                            rows={2}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="Note visible to the client about current status..."
                                        />
                                    </div>
                                </>
                            )}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setEditId(null)}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitEdit}
                                    disabled={editForm.processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    <Save className="h-4 w-4" /> Save
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
