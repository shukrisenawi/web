import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, Search, FolderPlus, FileText, Plus, X, Trash2, Save, CheckCircle2, AlertCircle, Eye, Pencil } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card } from '@/Layouts/Dashboard';

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
    const { auth, flash } = usePage().props as any;
    void auth;
    const [search, setSearch] = useState('');
    const [billingClient, setBillingClient] = useState<Client | null>(null);
    const [billingError, setBillingError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successInfo, setSuccessInfo] = useState({ client: '', project: '', invoiceNo: '' });
    const [viewClient, setViewClient] = useState<Client | null>(null);
    const [editClient, setEditClient] = useState<Client | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Client | null>(null);

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
        billingForm.clearErrors();
        setBillingError('');
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
        const hasEmpty = billingForm.data.items.some(
            (it) => !it.description.trim() || !it.amount.trim() || parseFloat(it.amount) <= 0,
        );
        if (hasEmpty) {
            setBillingError('Please fill in description and amount for every item.');
            return;
        }
        setBillingError('');
        const clientName = billingClient?.company ?? billingClient?.name ?? '';
        const projectLabel = projects.find((p) => String(p.id) === billingForm.data.project_id)?.label ?? '';
        setSuccessInfo({ client: clientName, project: projectLabel, invoiceNo: '' });
        billingForm.post('/invoices', {
            onSuccess: (page) => {
                const no = (page.props.flash as any)?.invoice_no ?? '';
                setSuccessInfo((prev) => ({ ...prev, invoiceNo: no }));
                setBillingClient(null);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
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

    const editForm = useForm({
        name: '',
        email: '',
        company: '',
        business_address: '',
        whatsapp: '',
        business_no: '',
        business_reg_no: '',
    });

    const openEdit = (c: Client) => {
        editForm.clearErrors();
        editForm.setData({
            name: c.name,
            email: c.email,
            company: c.company ?? '',
            business_address: c.business_address ?? '',
            whatsapp: c.whatsapp ?? '',
            business_no: '',
            business_reg_no: '',
        });
        setEditClient(c);
    };

    const submitEdit = () => {
        if (!editClient) return;
        editForm.put(`/clients/${editClient.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditClient(null);
            },
        });
    };

    const confirmDelete = (c: Client) => {
        setDeleteConfirm(c);
    };

    const executeDelete = () => {
        if (!deleteConfirm) return;
        router.delete(`/clients/${deleteConfirm.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteConfirm(null),
        });
    };

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

                {flash?.success && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-medium">{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-medium">{flash.error}</span>
                    </div>
                )}

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
                                        onClick={() => setViewClient(c)}
                                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                                        title="View Profile"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openEdit(c)}
                                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                                        title="Edit Profile"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
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
                                    <button
                                        type="button"
                                        onClick={() => confirmDelete(c)}
                                        className="rounded-lg border border-slate-200 p-2 text-red-400 hover:bg-red-50"
                                        title="Delete Client"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>


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

                        {billingError && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <span className="text-sm font-medium">{billingError}</span>
                            </div>
                        )}
                        {Object.keys(billingForm.errors).length > 0 && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                {Object.entries(billingForm.errors).map(([key, msg]) => (
                                    <p key={key} className="flex items-center gap-2 text-sm">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <span>{msg}</span>
                                    </p>
                                ))}
                            </div>
                        )}

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

            {viewClient && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewClient(null)}>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                    <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <Card>
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">Client Profile</h3>
                                <button type="button" onClick={() => setViewClient(null)} className="text-slate-400 hover:text-slate-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-white">
                                        <Building2 className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900">{viewClient.company ?? viewClient.name}</h4>
                                        <p className="text-sm text-slate-500">{viewClient.name} · {viewClient.email}</p>
                                    </div>
                                </div>
                                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                                    <Field label="Company" value={viewClient.company} />
                                    <Field label="Contact Name" value={viewClient.name} />
                                    <Field label="Email" value={viewClient.email} />
                                    <Field label="WhatsApp" value={viewClient.whatsapp} />
                                    <Field label="Business Address" value={viewClient.business_address} full />
                                    <Field label="Projects" value={`${viewClient.projects_count} project(s)`} />
                                    <Field label="Invoices" value={`${viewClient.invoices_count} invoice(s)`} />
                                    <Field label="Joined" value={viewClient.joined} />
                                </dl>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {editClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Edit Client Profile</h3>
                            <button type="button" onClick={() => setEditClient(null)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {Object.keys(editForm.errors).length > 0 && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                {Object.entries(editForm.errors).map(([key, msg]) => (
                                    <p key={key} className="flex items-center gap-2 text-sm">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <span>{msg}</span>
                                    </p>
                                ))}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Contact Name</label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                                <input
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Company</label>
                                <input
                                    type="text"
                                    value={editForm.data.company}
                                    onChange={(e) => editForm.setData('company', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">WhatsApp</label>
                                <input
                                    type="text"
                                    value={editForm.data.whatsapp}
                                    onChange={(e) => editForm.setData('whatsapp', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Business Address</label>
                                <textarea
                                    rows={2}
                                    value={editForm.data.business_address}
                                    onChange={(e) => editForm.setData('business_address', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditClient(null)}
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
                                    <Save className="h-4 w-4" /> Save Changes
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {deleteConfirm && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteConfirm(null)}>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                    <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <Card>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Delete Client</h3>
                                    <p className="text-sm text-slate-500">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="mb-6 text-sm text-slate-700">
                                Are you sure you want to delete <strong>{deleteConfirm.company ?? deleteConfirm.name}</strong> ({deleteConfirm.name})?
                                All associated data including projects and invoices will also be removed.
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirm(null)}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={executeDelete}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                    <Trash2 className="h-4 w-4" /> Delete
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {showSuccess && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions
                <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowSuccess(false)} onKeyDown={(e) => { if (e.key === 'Escape') setShowSuccess(false); }}>
                    <div
                        role="dialog"
                        className="flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => { if (e.key === 'Escape') setShowSuccess(false); }}
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <p className="text-lg font-bold text-slate-900">Invoice Generated Successfully!</p>
                        <div className="text-center text-sm text-slate-600">
                            <p className="font-semibold text-slate-800">{successInfo.invoiceNo}</p>
                            <p>{successInfo.client}</p>
                            {successInfo.project && <p className="text-slate-400">{successInfo.project}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowSuccess(false)}
                            className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
                        >
                            Tutup
                        </button>
                    </div>
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
