import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, FileText, Plus, Printer, CreditCard, X, Trash2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';

interface Invoice {
    id: string;
    invoice_id?: number;
    client?: string;
    project: string | null;
    date: string;
    amount: string;
    amount_raw?: number;
    status: string;
    payment_url?: string | null;
}

interface InvoicesProps {
    invoices: Invoice[];
    filters: { status: string | null };
    widgets?: {
        total_billing: string;
        total_pending: string;
        total_pending_count: number;
        total_complete: string;
        total_complete_count: number;
        total_overdue: string;
        total_revenue: string;
    };
    clients?: { id: number; label: string }[];
    projects?: { id: number; label: string; user_id: number }[];
    preselect_user_id?: string | null;
    preselect_project_id?: string | null;
}

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
];

const invoiceBadgeColor = (status: string) => {
    switch (status) {
        case 'paid':
            return 'green';
        case 'overdue':
            return 'red';
        default:
            return 'amber';
    }
};

export default function Invoices({ invoices, filters, widgets, clients = [], projects = [], preselect_user_id, preselect_project_id }: InvoicesProps) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.isAdmin;
    const currentStatus = filters.status ?? '';
    const [createOpen, setCreateOpen] = useState(false);
    const preselected = !!preselect_user_id;
    const preselectedProject = !!preselect_project_id;

    const form = useForm({
        user_id: preselect_user_id ?? '',
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

    const filteredProjects = projects.filter((p) => !form.data.user_id || p.user_id === Number(form.data.user_id));

    const total = form.data.items.reduce(
        (sum, it) => sum + (parseFloat(it.amount) || 0),
        0,
    );

    const submit = () => {
        form.post('/invoices', {
            onSuccess: () => setCreateOpen(false),
        });
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('new') === '1') {
            if (preselect_user_id) form.setData('user_id', preselect_user_id);
            if (preselect_project_id) form.setData('project_id', preselect_project_id);
            setCreateOpen(true);
        }
    }, []);

    const setItem = (idx: number, key: 'description' | 'amount', value: string) => {
        const items = [...form.data.items];
        items[idx] = { ...items[idx], [key]: value };
        form.setData('items', items);
    };
    const addItem = () => form.setData('items', [...form.data.items, { description: '', amount: '' }]);
    const removeItem = (idx: number) => {
        if (form.data.items.length === 1) return;
        form.setData('items', form.data.items.filter((_, i) => i !== idx));
    };

    const deleteInvoice = (id: string) => {
        if (!confirm('Delete this invoice?')) return;
        router.delete(`/invoices/${id}`);
    };

    const makePayment = (inv: Invoice) => {
        window.location.href = `/payment/${inv.id}`;
    };

    return (
        <>
            <Head title="Invoices" />

            <DashboardLayout title={isAdmin ? 'Billing' : 'Invoices'}>
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {isAdmin ? 'Billing & Invoices' : 'Your Invoices'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {isAdmin
                                ? 'Generate invoices and track all client billing.'
                                : 'View and pay your invoices.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <button
                                onClick={() => setCreateOpen(true)}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" /> Generate Invoice
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

                {isAdmin && widgets && (
                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <p className="text-xs font-medium text-slate-500">Total Billing</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">${widgets.total_billing}</p>
                        </Card>
                        <Card>
                            <p className="text-xs font-medium text-slate-500">
                                Total Pending ({widgets.total_pending_count})
                            </p>
                            <p className="mt-1 text-2xl font-bold text-amber-600">${widgets.total_pending}</p>
                        </Card>
                        <Card>
                            <p className="text-xs font-medium text-slate-500">
                                Total Complete ({widgets.total_complete_count})
                            </p>
                            <p className="mt-1 text-2xl font-bold text-emerald-600">${widgets.total_complete}</p>
                        </Card>
                        <Card>
                            <p className="text-xs font-medium text-slate-500">Total Revenue</p>
                            <p className="mt-1 text-2xl font-bold text-blue-600">${widgets.total_revenue}</p>
                        </Card>
                    </div>
                )}

                <Card className="mb-6">
                    <div className="flex flex-wrap items-center gap-2">
                        {statusOptions.map((o) => (
                            <Link
                                key={o.value}
                                href={`/invoices${o.value ? `?status=${o.value}` : ''}`}
                                preserveState
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    currentStatus === o.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {o.label}
                            </Link>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-100">
                                <tr className="text-left text-sm text-slate-500">
                                    <th className="pb-3 font-medium">Invoice</th>
                                    {isAdmin && <th className="pb-3 font-medium">Client</th>}
                                    <th className="pb-3 font-medium">Project</th>
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">Amount</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="text-sm">
                                        <td className="py-4 font-semibold text-blue-600">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                {inv.id}
                                            </div>
                                        </td>
                                        {isAdmin && <td className="py-4 text-slate-600">{inv.client ?? 'N/A'}</td>}
                                        <td className="py-4 text-slate-600">{inv.project ?? 'N/A'}</td>
                                        <td className="py-4 text-slate-500">{inv.date}</td>
                                        <td className="py-4 font-semibold text-slate-900">{inv.amount}</td>
                                        <td className="py-4">
                                            <Badge color={invoiceBadgeColor(inv.status)}>{inv.status}</Badge>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/invoices/${inv.id}`}
                                                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                                                    title="View / Print"
                                                >
                                                    <Printer className="h-4 w-4" />
                                                </Link>
                                                {!isAdmin && (
                                                    <button
                                                        onClick={() => makePayment(inv)}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                                    >
                                                        <CreditCard className="h-3.5 w-3.5" /> Pay
                                                    </button>
                                                )}
                                                {isAdmin && inv.invoice_id && (
                                                    <button
                                                        onClick={() => deleteInvoice(inv.id)}
                                                        className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-red-500"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {invoices.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-lg font-semibold text-slate-900">No invoices found</p>
                            <p className="text-sm text-slate-500">
                                You don't have any invoices matching the selected filter.
                            </p>
                        </div>
                    )}
                </Card>
            </DashboardLayout>

            {isAdmin && createOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Generate Invoice</h3>
                            <button onClick={() => setCreateOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Client</label>
                                <select
                                    value={form.data.user_id}
                                    onChange={(e) => form.setData('user_id', e.target.value)}
                                    disabled={preselected}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${
                                        preselected
                                            ? 'cursor-not-allowed border-slate-300 bg-slate-100 text-slate-600'
                                            : 'border-slate-200'
                                    }`}
                                >
                                    <option value="">Select existing client...</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                                {preselected && (
                                    <p className="mt-1 text-xs text-slate-400">Client locked from previous selection.</p>
                                )}
                                {form.errors.user_id && (
                                    <p className="mt-1 text-xs text-red-500">{form.errors.user_id}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Project</label>
                                <select
                                    value={form.data.project_id}
                                    onChange={(e) => form.setData('project_id', e.target.value)}
                                    disabled={preselectedProject}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${
                                        preselectedProject
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
                                {preselectedProject && (
                                    <p className="mt-1 text-xs text-slate-400">Project linked from client selection.</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Invoice No</label>
                                    <input
                                        value={form.data.invoice_no}
                                        onChange={(e) => form.setData('invoice_no', e.target.value)}
                                        placeholder="Auto-generated if blank"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Issue Date</label>
                                    <input
                                        type="date"
                                        value={form.data.issue_date}
                                        onChange={(e) => form.setData('issue_date', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label className="block text-sm font-medium text-slate-700">Invoice Items</label>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Add item
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {form.data.items.map((it, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                value={it.description}
                                                onChange={(e) => setItem(idx, 'description', e.target.value)}
                                                placeholder="Item description"
                                                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                            />
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={it.amount}
                                                onChange={(e) => setItem(idx, 'amount', e.target.value)}
                                                placeholder="0.00"
                                                className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeItem(idx)}
                                                disabled={form.data.items.length === 1}
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
                                        Total: RM {total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                                <select
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Payment URL (optional)
                                </label>
                                <input
                                    value={form.data.payment_url}
                                    onChange={(e) => form.setData('payment_url', e.target.value)}
                                    placeholder="https://payment.link/..."
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Company Name (optional)
                                </label>
                                <input
                                    value={form.data.company_name}
                                    onChange={(e) => form.setData('company_name', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
                                    onClick={submit}
                                    disabled={form.processing}
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
