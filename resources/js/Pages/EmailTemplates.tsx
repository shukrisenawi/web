import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, Mail, Plus, Save, X } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';

interface Template {
    id: number;
    key: string;
    name: string;
    subject: string;
    body: string;
    is_active: boolean;
}

interface EmailTemplatesProps {
    templates: Template[];
}

export default function EmailTemplates({ templates }: EmailTemplatesProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

    const createForm = useForm({
        key: '',
        name: '',
        subject: '',
        body: '',
        is_active: true,
    });

    const editForm = useForm({
        name: '',
        subject: '',
        body: '',
        is_active: true,
    });

    const startEdit = (t: Template) => {
        editForm.setData({
            name: t.name,
            subject: t.subject,
            body: t.body,
            is_active: t.is_active,
        });
        setEditingId(t.id);
    };

    const submitCreate = () => {
        createForm.post('/email-templates', {
            onSuccess: () => {
                setCreating(false);
                createForm.reset();
            },
        });
    };

    const submitEdit = () => {
        if (editingId === null) return;
        editForm.put(`/email-templates/${editingId}`, {
            onSuccess: () => setEditingId(null),
        });
    };

    const variablesFor = (key: string) => {
        switch (key) {
            case 'client_appointment_submitted':
            case 'client_appointment_approved':
            case 'client_appointment_rejected':
                return ['app_name', 'app_url', 'logo_url', 'company_name', 'contact_name', 'appointment_date', 'appointment_time', 'appointment_type', 'rejection_reason', 'url'];
            case 'ticket_reply':
                return ['app_name', 'app_url', 'logo_url', 'ticket_no', 'subject', 'sender_name', 'message', 'is_admin_reply', 'url'];
            case 'new_invoice':
                return ['app_name', 'app_url', 'logo_url', 'invoice_no', 'billed_to', 'issue_date', 'status', 'view_url', 'payment_url'];
            default:
                return [];
        }
    };

    return (
        <>
            <Head title="Email Templates" />

            <DashboardLayout title="Email Templates">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Email Templates</h2>
                        <p className="text-sm text-slate-500">Manage the design and content of system emails.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCreating(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" /> New Template
                        </button>
                        <a
                            href="/dashboard"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                        >
                            Back to Dashboard <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    {templates.map((t) => (
                        <Card key={t.id} className="flex flex-col gap-4">
                            {editingId === t.id ? (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor={`edit-name-${t.id}`} className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                                        <input
                                            id={`edit-name-${t.id}`}
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        {editForm.errors.name && <p className="mt-1 text-xs text-red-500">{editForm.errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor={`edit-subject-${t.id}`} className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
                                        <input
                                            id={`edit-subject-${t.id}`}
                                            value={editForm.data.subject}
                                            onChange={(e) => editForm.setData('subject', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        {editForm.errors.subject && <p className="mt-1 text-xs text-red-500">{editForm.errors.subject}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor={`edit-body-${t.id}`} className="mb-1 block text-sm font-medium text-slate-700">Body (HTML)</label>
                                        <textarea
                                            id={`edit-body-${t.id}`}
                                            value={editForm.data.body}
                                            onChange={(e) => editForm.setData('body', e.target.value)}
                                            rows={20}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
                                        />
                                        {editForm.errors.body && <p className="mt-1 text-xs text-red-500">{editForm.errors.body}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id={`edit-active-${t.id}`}
                                            type="checkbox"
                                            checked={editForm.data.is_active}
                                            onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                            className="rounded border-slate-300"
                                        />
                                        <label htmlFor={`edit-active-${t.id}`} className="text-sm text-slate-700">Active</label>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <p className="mb-2 text-xs font-semibold text-slate-500">Available variables</p>
                                        <div className="flex flex-wrap gap-2">
                                            {variablesFor(t.key).map((v) => (
                                                <span key={v} className="rounded-full bg-white px-2 py-1 text-xs text-slate-600 border border-slate-200">
                                                    {'{{'} {v} {'}}'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewTemplate({ ...t, subject: editForm.data.subject, body: editForm.data.body, name: editForm.data.name, is_active: editForm.data.is_active })}
                                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={submitEdit}
                                            disabled={editForm.processing}
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            <Save className="h-4 w-4" /> Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-blue-600" />
                                                <h3 className="font-semibold text-slate-900">{t.name}</h3>
                                                <Badge color={t.is_active ? 'green' : 'slate'}>{t.is_active ? 'Active' : 'Inactive'}</Badge>
                                            </div>
                                            <p className="mt-1 text-xs text-slate-500">Key: {t.key}</p>
                                            <p className="mt-1 text-sm text-slate-700">Subject: {t.subject}</p>
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setPreviewTemplate(t)}
                                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                            >
                                                Preview
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => startEdit(t)}
                                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Card>
                    ))}

                    {templates.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-lg font-semibold text-slate-900">No templates yet</p>
                            <p className="text-sm text-slate-500">Create your first email template to get started.</p>
                        </div>
                    )}
                </div>
            </DashboardLayout>

            {creating && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
                    <Card className="my-8 w-full max-w-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">New Email Template</h3>
                            <button type="button" onClick={() => setCreating(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="create-key" className="mb-1 block text-sm font-medium text-slate-700">Key</label>
                                <input
                                    id="create-key"
                                    value={createForm.data.key}
                                    onChange={(e) => createForm.setData('key', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="e.g. welcome_email"
                                />
                                {createForm.errors.key && <p className="mt-1 text-xs text-red-500">{createForm.errors.key}</p>}
                            </div>
                            <div>
                                <label htmlFor="create-name" className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                                <input
                                    id="create-name"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                                {createForm.errors.name && <p className="mt-1 text-xs text-red-500">{createForm.errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="create-subject" className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
                                <input
                                    id="create-subject"
                                    value={createForm.data.subject}
                                    onChange={(e) => createForm.setData('subject', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                                {createForm.errors.subject && <p className="mt-1 text-xs text-red-500">{createForm.errors.subject}</p>}
                            </div>
                            <div>
                                <label htmlFor="create-body" className="mb-1 block text-sm font-medium text-slate-700">Body (HTML)</label>
                                <textarea
                                    id="create-body"
                                    value={createForm.data.body}
                                    onChange={(e) => createForm.setData('body', e.target.value)}
                                    rows={20}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
                                />
                                {createForm.errors.body && <p className="mt-1 text-xs text-red-500">{createForm.errors.body}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    id="create-active"
                                    type="checkbox"
                                    checked={createForm.data.is_active}
                                    onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                    className="rounded border-slate-300"
                                />
                                <label htmlFor="create-active" className="text-sm text-slate-700">Active</label>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCreating(false)}
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
                                    <Save className="h-4 w-4" /> Create
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {previewTemplate && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black/50 p-4">
                    <Card className="flex flex-1 flex-col w-full max-w-3xl mx-auto overflow-hidden">
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Preview: {previewTemplate.name}</h3>
                            <button type="button" onClick={() => setPreviewTemplate(null)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex flex-1 min-h-0 rounded-lg border border-slate-200 bg-white p-4">
                            <iframe
                                srcDoc={previewTemplate.body}
                                className="w-full h-full rounded-lg border-0"
                                title="Preview"
                            />
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
