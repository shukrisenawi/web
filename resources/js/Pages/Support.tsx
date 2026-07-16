import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Headphones, Plus, X, Save, Trash2, AlertCircle, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';

interface Reply {
    id: number;
    message: string;
    user: string;
    is_admin: boolean;
    date: string;
}

interface Ticket {
    id: string;
    ticket_id?: number;
    subject: string;
    description: string | null;
    status: string;
    priority: string;
    project?: string | null;
    client?: string;
    name?: string | null;
    email?: string | null;
    date: string;
    replies: Reply[];
}

interface SupportProps {
    tickets: Ticket[];
}

const priorityBadgeColor = (p: string) => {
    switch (p) {
        case 'high':
            return 'red';
        case 'medium':
            return 'amber';
        default:
            return 'slate';
    }
};

const ticketBadgeColor = (status: string) => {
    switch (status) {
        case 'resolved':
            return 'green';
        case 'in_progress':
            return 'blue';
        default:
            return 'red';
    }
};

export default function Support({ tickets }: SupportProps) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.isAdmin;
    const [createOpen, setCreateOpen] = useState(false);
    const [viewId, setViewId] = useState<number | null>(null);

    const createForm = useForm({
        name: auth?.user?.name ?? '',
        email: auth?.user?.email ?? '',
        subject: '',
        description: '',
        priority: 'medium',
        project_id: '',
    });

    const updateForm = useForm({ status: 'open', priority: 'medium' });
    const replyForm = useForm({ message: '' });

    const ticket = viewId !== null ? tickets.find((t) => t.ticket_id === viewId) ?? null : null;

    const submitCreate = () => {
        createForm.post('/support', {
            onSuccess: () => setCreateOpen(false),
        });
    };

    const openView = (t: Ticket) => {
        updateForm.setData({ status: t.status, priority: t.priority });
        setViewId(t.ticket_id ?? null);
    };

    const submitUpdate = () => {
        if (viewId === null) return;
        updateForm.put(`/support/${viewId}`, {
            onSuccess: () => { /* stay open, replies will reload */ },
        });
    };

    const submitReply = () => {
        if (viewId === null) return;
        replyForm.post(`/support/${viewId}/reply`, {
            onSuccess: () => replyForm.reset('message'),
        });
    };

    const deleteTicket = (id?: number) => {
        if (id === undefined) return;
        if (!confirm('Delete this ticket?')) return;
        router.delete(`/support/${id}`);
    };

    return (
        <>
            <Head title="Support" />

            <DashboardLayout title="Support">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {isAdmin ? 'Client Support Tickets' : 'Support & Tickets'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {isAdmin
                                ? 'Respond to and prioritise client requests.'
                                : 'Create a ticket or track the status of your requests.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isAdmin && (
                            <button
                                onClick={() => setCreateOpen(true)}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" /> New Ticket
                            </button>
                        )}
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                        >
                            Back to Dashboard <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <div className="space-y-4">
                    {tickets.map((t) => (
                        <Card key={t.id} className="flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm font-semibold text-blue-600">
                                            {t.id}
                                        </span>
                                        <Badge color={priorityBadgeColor(t.priority)}>
                                            {t.priority}
                                        </Badge>
                                        <Badge color={ticketBadgeColor(t.status)}>
                                            {t.status.replace('_', ' ')}
                                        </Badge>
                                        {t.replies.length > 0 && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                                                <MessageSquare className="h-3 w-3" />
                                                {t.replies.length}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mt-2 font-semibold text-slate-900">{t.subject}</h3>
                                    {t.description && (
                                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                                            {t.description}
                                        </p>
                                    )}
                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                        <span>{t.date}</span>
                                        {t.project && <span>Project: {t.project}</span>}
                                        {isAdmin && t.client && (
                                            <span className="font-medium text-blue-600">{t.client}</span>
                                        )}
                                        {!isAdmin && t.name && <span>{t.name}</span>}
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        onClick={() => openView(t)}
                                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                                        title="View & Reply"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => deleteTicket(t.ticket_id)}
                                            className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-red-500"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {tickets.length === 0 && (
                    <div className="py-16 text-center">
                        <p className="text-lg font-semibold text-slate-900">No tickets yet</p>
                        <p className="text-sm text-slate-500">
                            {isAdmin
                                ? 'Client support tickets will appear here.'
                                : 'Open a ticket and our team will get back to you.'}
                        </p>
                    </div>
                )}
            </DashboardLayout>

            {!isAdmin && createOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">New Support Ticket</h3>
                            <button onClick={() => setCreateOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
                                <input
                                    value={createForm.data.subject}
                                    onChange={(e) => createForm.setData('subject', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="Brief summary of your issue"
                                />
                                {createForm.errors.subject && (
                                    <p className="mt-1 text-xs text-red-500">{createForm.errors.subject}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
                                <select
                                    value={createForm.data.priority}
                                    onChange={(e) => createForm.setData('priority', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="Describe your issue in detail..."
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setCreateOpen(false)}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitCreate}
                                    disabled={createForm.processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    <Headphones className="h-4 w-4" /> Submit Ticket
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {viewId !== null && ticket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="flex max-h-[90vh] w-full max-w-2xl flex-col">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-900">{ticket.subject}</h3>
                                <Badge color={ticketBadgeColor(ticket.status)}>
                                    {ticket.status.replace('_', ' ')}
                                </Badge>
                                <Badge color={priorityBadgeColor(ticket.priority)}>
                                    {ticket.priority}
                                </Badge>
                            </div>
                            <button onClick={() => setViewId(null)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="-mx-5 flex-1 overflow-y-auto border-b border-slate-100 px-5 py-4">
                            {/** Original ticket message */}
                            <div className="mb-4 rounded-lg bg-slate-50 p-4">
                                <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                                    <span className="font-mono font-semibold text-blue-600">{ticket.id}</span>
                                    <span>{ticket.date}</span>
                                    {ticket.name && <span>by {ticket.name}</span>}
                                </div>
                                {ticket.description && (
                                    <p className="whitespace-pre-wrap text-sm text-slate-700">{ticket.description}</p>
                                )}
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                    {ticket.project && <span>Project: {ticket.project}</span>}
                                    {ticket.email && <span>{ticket.email}</span>}
                                </div>
                            </div>

                            {/** Replies thread */}
                            {ticket.replies.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-xs font-semibold uppercase text-slate-400">Replies</p>
                                    {ticket.replies.map((r) => (
                                        <div
                                            key={r.id}
                                            className={`rounded-lg p-4 ${
                                                r.is_admin
                                                    ? 'ml-6 border border-blue-100 bg-blue-50'
                                                    : 'mr-6 border border-slate-100 bg-white'
                                            }`}
                                        >
                                            <div className="mb-1 flex items-center gap-2 text-xs">
                                                <span className={`font-semibold ${r.is_admin ? 'text-blue-700' : 'text-slate-700'}`}>
                                                    {r.is_admin ? 'Admin' : r.user}
                                                </span>
                                                <span className="text-slate-400">{r.date}</span>
                                            </div>
                                            <p className="whitespace-pre-wrap text-sm text-slate-700">{r.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {ticket.replies.length === 0 && (
                                <p className="py-8 text-center text-sm text-slate-400">No replies yet.</p>
                            )}
                        </div>

                        {/** Update + Reply footer */}
                        <div className="pt-4">
                            {isAdmin && (
                                <>
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-medium text-slate-600">Status</label>
                                            <select
                                                value={updateForm.data.status}
                                                onChange={(e) => updateForm.setData('status', e.target.value)}
                                                className="rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                                            >
                                                <option value="open">Open</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-medium text-slate-600">Priority</label>
                                            <select
                                                value={updateForm.data.priority}
                                                onChange={(e) => updateForm.setData('priority', e.target.value)}
                                                className="rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={submitUpdate}
                                            disabled={updateForm.processing}
                                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            <Save className="h-3 w-3" /> Save
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <textarea
                                            value={replyForm.data.message}
                                            onChange={(e) => replyForm.setData('message', e.target.value)}
                                            rows={2}
                                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="Type your reply..."
                                        />
                                        <button
                                            onClick={submitReply}
                                            disabled={replyForm.processing || !replyForm.data.message.trim()}
                                            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            <Send className="h-4 w-4" /> Send
                                        </button>
                                    </div>
                                </>
                            )}

                            {!isAdmin && (
                                <p className="text-center text-xs text-slate-400">
                                    Our team will respond to your ticket shortly.
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
