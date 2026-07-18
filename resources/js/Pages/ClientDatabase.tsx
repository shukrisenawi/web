import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, Search, FolderPlus, FileText, ChevronDown, ChevronUp, Paperclip, Plus, X, Trash2, Save } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';

interface RequestFile {
    id: number;
    filename: string;
    size: number;
    url: string;
}

interface RequestInfo {
    industry: string | null;
    system_type: string | null;
    features: string | null;
    user_roles: string | null;
    integrations: string | null;
    budget: string | null;
    deadline: string | null;
    hosting_domain: string | null;
    additional_notes: string | null;
    status: string;
    files: RequestFile[];
}

interface Client {
    id: number;
    name: string;
    email: string;
    company: string | null;
    business_address: string | null;
    whatsapp: string | null;
    projects_count: number;
    invoices_count: number;
    latest_project_id?: number | null;
    joined: string;
    request: RequestInfo | null;
}

export default function ClientDatabase({ clients, projects = [] }: { clients: Client[]; projects?: { id: number; label: string; user_id: number }[] }) {
    const { auth } = usePage().props as any;
    void auth;
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<number | null>(null);
    const [billingClient, setBillingClient] = useState<Client | null>(null);

    const filtered = clients.filter((c) => {
        const q = search.toLowerCase();
        return (
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            (c.company ?? '').toLowerCase().includes(q)
        );
    });

    const filteredProjects = projects.filter((p) => !billingClient || p.user_id === billingClient.id);

    const billingForm = useForm({
        user_id: '',
        project_id: '',
        company_name: '',
        company_address: '',
        company_no: '',
        invoice_no: '',
        issue_date: new Date().toISOString().slice(0, 10),
        items: [{ description: '', amount: '' }] as { description: string; amount: string }[],
        status: 'pending',
        payment_url: '',
    });

    const billingTotal = billingForm.data.items.reduce(
        (sum, it) => sum + (parseFloat(it.amount) || 0),
        0,
    );

    const openBilling = (c: Client) => {
        billingForm.setData({
            user_id: String(c.id),
            project_id: String(c.latest_project_id ?? ''),
            company_name: '',
            company_address: '',
            company_no: '',
            invoice_no: '',
            issue_date: new Date().toISOString().slice(0, 10),
            items: [{ description: '', amount: '' }],
            status: 'pending',
            payment_url: '',
        });
        setBillingClient(c);
    };

    const submitBilling = () => {
        billingForm.post('/invoices', {
            onSuccess: () => {
                setBillingClient(null);
            },
        });
    };

    const setBillingItem = (idx: number, key: 'description' | 'amount', value: string) => {
        const items = [...billingForm.data.items];
        items[idx] = { ...items[idx], [key]: value };
        billingForm.setData('items', items);
    };
    const addBillingItem = () => billingForm.setData('items', [...billingForm.data.items, { description: '', amount: '' }]);
    const removeBillingItem = (idx: number) => {
        if (billingForm.data.items.length === 1) return;
        billingForm.setData('items', billingForm.data.items.filter((_, i) => i !== idx));
    };

    const newProject = (id: number) => router.get('/projects', { user_id: id, new: 1 });

    return (
        <>
            <Head title="Client Database" />

            <DashboardLayout title="Database">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Client Database</h2>
                        <p className="text-sm text-slate-500">
                            Everyone who registered through the request form. Create projects &amp; billing from here.
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                    >
                        Back to Dashboard <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <Card className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, company or email..."
                            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </Card>

                <div className="space-y-4">
                    {filtered.map((c) => (
                        <Card key={c.id} className="flex flex-col">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{c.company ?? c.name}</h3>
                                        <p className="text-sm text-slate-500">{c.name} · {c.email}</p>
                                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                                            {c.whatsapp && <span>{c.whatsapp}</span>}
                                            <span>{c.projects_count} project(s)</span>
                                            <span>{c.invoices_count} invoice(s)</span>
                                            <span>Joined {c.joined}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => newProject(c.id)}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                    >
                                        <FolderPlus className="h-3.5 w-3.5" /> New Project
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openBilling(c)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        <FileText className="h-3.5 w-3.5" /> Create Billing
                                    </button>
                                    {c.request && (
                                        <button
                                            type="button"
                                            onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            Request
                                            {expanded === c.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {c.request && expanded === c.id && (
                                <div className="mt-4 border-t border-slate-100 pt-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <p className="text-sm font-semibold text-slate-800">Request Form Details</p>
                                        <Badge color="slate">{c.request.status}</Badge>
                                    </div>
                                    <dl className="grid gap-3 text-sm sm:grid-cols-2">
                                        <Field label="Industry" value={c.request.industry} />
                                        <Field label="System Type" value={c.request.system_type} />
                                        <Field label="Budget" value={c.request.budget} />
                                        <Field label="Deadline" value={c.request.deadline} />
                                        <Field label="Features / Modules" value={c.request.features} full />
                                        <Field label="User Roles" value={c.request.user_roles} full />
                                        <Field label="Integrations" value={c.request.integrations} full />
                                        <Field label="Hosting / Domain" value={c.request.hosting_domain} full />
                                        {c.business_address && <Field label="Address" value={c.business_address} full />}
                                        <Field label="Additional Notes" value={c.request.additional_notes} full />
                                        {c.request.files.length > 0 && (
                                            <div className="sm:col-span-2">
                                                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Attached Files</dt>
                                                <dd className="mt-1 space-y-1">
                                                    {c.request.files.map((f) => (
                                                        <a
                                                            key={f.id}
                                                            href={f.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <Paperclip className="h-3.5 w-3.5" />
                                                            <span className="truncate">{f.filename}</span>
                                                            <span className="ml-auto shrink-0 text-xs text-slate-400">
                                                                {f.size > 1024 ? `${(f.size / 1024).toFixed(1)} KB` : `${f.size} B`}
                                                            </span>
                                                        </a>
                                                    ))}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="py-16 text-center">
                        <p className="text-lg font-semibold text-slate-900">No clients found</p>
                        <p className="text-sm text-slate-500">Clients who submit the request form will appear here.</p>
                    </div>
                )}
            </DashboardLayout>

            {billingClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Generate Invoice</h3>
                            <button type="button" onClick={() => setBillingClient(null)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="modal-client" className="mb-1 block text-sm font-medium text-slate-700">Client</label>
                                <select
                                    id="modal-client"
                                    value={billingForm.data.user_id}
                                    disabled
                                    className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Select existing client...</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.company ?? c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="modal-project" className="mb-1 block text-sm font-medium text-slate-700">Project</label>
                                <select
                                    id="modal-project"
                                    value={billingForm.data.project_id}
                                    onChange={(e) => billingForm.setData('project_id', e.target.value)}
                                    disabled={!!billingClient.latest_project_id}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${
                                        billingClient.latest_project_id
                                            ? 'cursor-not-allowed border-slate-300 bg-slate-100 text-slate-600'
                                            : 'border-slate-200'
                                    }`}
                                >
                                    <option value="">Select project (optional)...</option>
                                    {filteredProjects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                                {billingClient.latest_project_id && (
                                    <p className="mt-1 text-xs text-slate-400">Project linked from client selection.</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="modal-invoice-no" className="mb-1 block text-sm font-medium text-slate-700">Invoice No</label>
                                    <input
                                        id="modal-invoice-no"
                                        value={billingForm.data.invoice_no}
                                        onChange={(e) => billingForm.setData('invoice_no', e.target.value)}
                                        placeholder="Auto-generated if blank"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="modal-issue-date" className="mb-1 block text-sm font-medium text-slate-700">Issue Date</label>
                                    <input
                                        id="modal-issue-date"
                                        type="date"
                                        value={billingForm.data.issue_date}
                                        onChange={(e) => billingForm.setData('issue_date', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="block text-sm font-medium text-slate-700">Invoice Items</span>
                                    <button
                                        type="button"
                                        onClick={addBillingItem}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Add item
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {billingForm.data.items.map((it, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                value={it.description}
                                                onChange={(e) => setBillingItem(idx, 'description', e.target.value)}
                                                placeholder="Item description"
                                                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                            />
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={it.amount}
                                                onChange={(e) => setBillingItem(idx, 'amount', e.target.value)}
                                                placeholder="0.00"
                                                className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeBillingItem(idx)}
                                                disabled={billingForm.data.items.length === 1}
                                                className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-red-500 disabled:opacity-40"
                                                title="Remove"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 flex justify-end">
                                    <span className="text-sm font-semibold text-slate-900">
                                        Total: RM {billingTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="modal-status" className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                                <select
                                    id="modal-status"
                                    value={billingForm.data.status}
                                    onChange={(e) => billingForm.setData('status', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="modal-payment-url" className="mb-1 block text-sm font-medium text-slate-700">
                                    Payment URL (optional)
                                </label>
                                <input
                                    id="modal-payment-url"
                                    value={billingForm.data.payment_url}
                                    onChange={(e) => billingForm.setData('payment_url', e.target.value)}
                                    placeholder="https://payment.link/..."
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setBillingClient(null)}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={submitBilling}
                                    disabled={billingForm.processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    <Save className="h-4 w-4" /> Generate
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}

function Field({ label, value, full = false }: { label: string; value: string | null; full?: boolean }) {
    return (
        <div className={full ? 'sm:col-span-2' : ''}>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="whitespace-pre-wrap text-slate-700">{value || <span className="text-slate-300">—</span>}</dd>
        </div>
    );
}
