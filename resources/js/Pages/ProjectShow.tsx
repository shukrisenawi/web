import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, FolderKanban, ListChecks, CheckCircle2, Clock, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge, Progress } from '@/Layouts/Dashboard';
import Modal from '@/Components/Modal';

interface Milestone {
    id: number;
    title: string;
    note: string | null;
    due_date: string | null;
    created_at: string;
    is_active: boolean;
}

interface Project {
    id: number;
    client: string;
    title: string;
    category: string;
    service_type: string | null;
    system_type?: string | null;
    features?: string | null;
    user_roles?: string | null;
    integrations?: string | null;
    budget?: string | null;
    deadline?: string | null;
    hosting_domain?: string | null;
    additional_notes?: string | null;
    description: string | null;
    key_person: string | null;
    status_remark: string | null;
    progress: number;
    status: string;
    payment_status: string;
    total_paid?: string;
    icon_color: string;
    created_at: string;
    milestones: Milestone[];
}

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

const paymentBadgeColor = (status: string) => {
    switch (status) {
        case 'paid':
            return 'green';
        case 'partial':
            return 'amber';
        default:
            return 'red';
    }
};

export default function ProjectShow({ project }: { project: Project }) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.isAdmin;
    const [milestoneForm, setMilestoneForm] = useState({ title: '', note: '', progress: project.progress });
    const [showForm, setShowForm] = useState(false);
    const [editMilestone, setEditMilestone] = useState<Milestone | null>(null);

    const submitMilestone = () => {
        if (!milestoneForm.title.trim() || !milestoneForm.note.trim()) return;
        router.post(`/projects/${project.id}/milestones`, milestoneForm, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowForm(false);
                setMilestoneForm({ title: '', note: '', progress: 0 });
            },
        });
    };

    const updateMilestone = () => {
        if (!editMilestone || !milestoneForm.title.trim() || !milestoneForm.note.trim()) return;
        router.put(`/projects/${project.id}/milestones/${editMilestone.id}`, milestoneForm, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setEditMilestone(null);
                setMilestoneForm({ title: '', note: '', progress: 0 });
            },
        });
    };

    const deleteMilestone = (m: Milestone) => {
        router.delete(`/projects/${project.id}/milestones/${m.id}`, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <Head title={project.title} />

            <DashboardLayout title="Project Details">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180" /> Back to Projects
                    </Link>
                </div>

                <Card className="mb-6">
                    <div className="flex items-start gap-4">
                        <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white"
                            style={{ backgroundColor: project.icon_color }}
                        >
                            <FolderKanban className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900">{project.title}</h2>
                                <Badge color={statusBadgeColor(project.status)}>
                                    {project.status.replace('_', ' ')}
                                </Badge>
                                <Badge color={paymentBadgeColor(project.payment_status)}>
                                    {project.payment_status} payment
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{project.category}</p>
                            {isAdmin && (
                                <p className="text-xs font-medium text-blue-600">Client: {project.client}</p>
                            )}
                        </div>
                    </div>

                    {project.key_person && (
                        <p className="mt-3 text-sm text-slate-600">
                            <span className="font-semibold">Key Person:</span> {project.key_person}
                        </p>
                    )}

                    {project.total_paid && parseFloat(project.total_paid) > 0 && (
                        <p className="mt-4 text-sm">
                            <span className="text-slate-500">Total Paid:</span>{' '}
                            <span className="font-semibold text-emerald-600">${project.total_paid}</span>
                        </p>
                    )}

                    <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-slate-500">Progress</span>
                            <span className="font-semibold text-slate-700">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} />
                    </div>
                </Card>

                <Card>
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ListChecks className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-slate-900">Milestones & Updates</h3>
                        </div>
                        {isAdmin && (
                            <button
                                type="button"
                                onClick={() => { setMilestoneForm({ title: '', note: '', progress: project.progress }); setShowForm(true); }}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                            >
                                <Plus className="h-3.5 w-3.5" /> Update
                            </button>
                        )}
                    </div>

                    {project.milestones.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No milestones yet. Our team will add progress updates here.
                        </p>
                    ) : (
                        <div className="relative">
                            <div className="absolute left-[11px] top-2 h-[calc(100%-16px)] w-0.5 bg-slate-200" />
                            <div className="space-y-6">
                                {project.milestones.map((m, i) => (
                                    <div key={m.id} className="relative flex items-start gap-4">
                                        <div className="relative z-10 flex shrink-0">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </div>
                                        </div>
                                        <div className="flex-1 pb-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {m.title}
                                                    </p>
                                                    {m.note && (
                                                        <p className="mt-0.5 text-xs text-slate-500">{m.note}</p>
                                                    )}
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    {isAdmin && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => { setEditMilestone(m); setMilestoneForm({ title: m.title, note: m.note ?? '', progress: project.progress }); }}
                                                                className="text-slate-400 hover:text-blue-600"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteMilestone(m)}
                                                                className="text-slate-400 hover:text-red-500"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        {m.due_date ?? m.created_at}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

            <Modal open={showForm} onClose={() => { setShowForm(false); setMilestoneForm({ title: '', note: '', progress: project.progress }); }}>
                <div className="px-6 py-5">
                    <h2 className="mb-4 text-lg font-bold text-slate-900">Add Update</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Title</label>
                            <input
                                type="text"
                                value={milestoneForm.title}
                                onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="What's new?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Details</label>
                            <textarea
                                value={milestoneForm.note}
                                onChange={(e) => setMilestoneForm({ ...milestoneForm, note: e.target.value })}
                                rows={4}
                                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="Describe the update..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Progress (%)</label>
                            <div className="mt-1 flex items-center gap-3">
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={milestoneForm.progress}
                                    onChange={(e) => setMilestoneForm({ ...milestoneForm, progress: Number(e.target.value) })}
                                    className="w-full accent-blue-600"
                                />
                                <span className="w-10 text-right text-sm font-semibold text-blue-600">{milestoneForm.progress}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={() => { setShowForm(false); setMilestoneForm({ title: '', note: '', progress: project.progress }); }}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={submitMilestone}
                            disabled={!milestoneForm.title.trim() || !milestoneForm.note.trim()}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Add Update
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal open={editMilestone !== null} onClose={() => { setEditMilestone(null); setMilestoneForm({ title: '', note: '', progress: project.progress }); }}>
                <div className="px-6 py-5">
                    <h2 className="mb-4 text-lg font-bold text-slate-900">Edit Update</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Title</label>
                            <input
                                type="text"
                                value={milestoneForm.title}
                                onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Details</label>
                            <textarea
                                value={milestoneForm.note}
                                onChange={(e) => setMilestoneForm({ ...milestoneForm, note: e.target.value })}
                                rows={4}
                                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Progress (%)</label>
                            <div className="mt-1 flex items-center gap-3">
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={milestoneForm.progress}
                                    onChange={(e) => setMilestoneForm({ ...milestoneForm, progress: Number(e.target.value) })}
                                    className="w-full accent-blue-600"
                                />
                                <span className="w-10 text-right text-sm font-semibold text-blue-600">{milestoneForm.progress}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={() => { setEditMilestone(null); setMilestoneForm({ title: '', note: '', progress: project.progress }); }}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={updateMilestone}
                            disabled={!milestoneForm.title.trim() || !milestoneForm.note.trim()}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
            </DashboardLayout>
        </>
    );
}
