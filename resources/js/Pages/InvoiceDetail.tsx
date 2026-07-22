import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Printer, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';

interface Invoice {
    id: string;
    invoice_id: number;
    client?: string;
    company_name?: string | null;
    company_address?: string | null;
    company_no?: string | null;
    project: string | null;
    issue_date: string;
    date: string;
    amount: string;
    amount_raw: number;
    status: string;
    payment_url?: string | null;
    items?: { description: string; amount: number }[];
    proofs?: { id: number; payment_method: string; name: string; status: string; created_at: string }[];
    has_pending_proof?: boolean;
}

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

export default function InvoiceDetail({ invoice }: { invoice: Invoice }) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.isAdmin;

    const form = useForm({ status: invoice.status });

    const makePayment = () => {
        window.location.href = `/payment/${invoice.id}`;
    };

    const updateStatus = () => {
        form.put(`/invoices/${invoice.id}`, {
            onSuccess: () => window.print(),
        });
    };

    return (
        <>
            <Head title={`Invoice ${invoice.id}`}>
                <style>{`
                    @media print {
                        .invoice-card {
                            border: none !important;
                            box-shadow: none !important;
                            max-width: 100% !important;
                        }
                    }
                `}</style>
            </Head>

            <DashboardLayout title={`Invoice ${invoice.id}`}>
                <div className="mb-6 flex items-center justify-between print:hidden">
                    <Link
                        href="/invoices"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180" /> Back to Invoices
                    </Link>
                    <div className="flex items-center gap-2">
                        {isAdmin ? (
                            <button
                                onClick={updateStatus}
                                disabled={form.processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                <CheckCircle className="h-4 w-4" /> Mark as {form.data.status === 'paid' ? 'Paid' : form.data.status}
                            </button>
                        ) : (
                            invoice.status !== 'paid' && !invoice.has_pending_proof && (
                                <button
                                    onClick={makePayment}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    <CreditCard className="h-4 w-4" /> Make Payment
                                </button>
                            )
                        )}
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <Printer className="h-4 w-4" /> Print
                        </button>
                    </div>
                </div>

                <Card className="invoice-card mx-auto max-w-2xl">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-2xl font-black text-blue-600">{'</>'}</span>
                                <span className="font-bold">
                                    <span className="text-slate-900">KENJU</span>
                                    <span className="ml-2 text-blue-600">TECH</span>
                                </span>
                            </div>
                            <p className="mt-2 text-xs text-slate-500">Kenju Tech Sdn Bhd</p>
                            <p className="text-xs text-slate-500">hello@kenju.tech</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-slate-900">INVOICE</p>
                            <p className="font-mono text-sm text-blue-600">{invoice.id}</p>
                            <p className="mt-1 text-xs text-slate-500">{invoice.date}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 py-6">
                        <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">Billed To</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {invoice.company_name ?? invoice.client ?? 'Client'}
                            </p>
                            {invoice.company_address && (
                                <p className="mt-1 text-xs text-slate-500">{invoice.company_address}</p>
                            )}
                            {invoice.company_no && (
                                <p className="text-xs text-slate-500">Reg: {invoice.company_no}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-semibold uppercase text-slate-400">Status</p>
                            <div className="mt-1 flex justify-end">
                                {isAdmin ? (
                                    <select
                                        value={form.data.status}
                                        onChange={(e) => form.setData('status', e.target.value)}
                                        className="rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                ) : (
                                    <Badge color={invoiceBadgeColor(invoice.status)}>{invoice.status}</Badge>
                                )}
                            </div>
                            {invoice.project && (
                                <p className="mt-2 text-xs text-slate-500">Project: {invoice.project}</p>
                            )}
                        </div>
                    </div>

                    <div className="py-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm">
                            <span className="font-medium text-slate-600">Description</span>
                            <span className="font-medium text-slate-600">Amount</span>
                        </div>
                        {invoice.items && invoice.items.length > 0 ? (
                            invoice.items.map((it, i) => (
                                <div key={i} className="flex items-center justify-between py-3 text-sm">
                                    <span className="text-slate-900">{it.description || 'Item'}</span>
                                    <span className="font-semibold text-slate-900">
                                        RM {Number(it.amount).toFixed(2)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-between py-3 text-sm">
                                <span className="text-slate-900">
                                    {invoice.project ?? 'Professional Services'}
                                </span>
                                <span className="font-semibold text-slate-900">{invoice.amount}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                        <span className="text-sm font-semibold text-slate-600">Total</span>
                        <span className="text-2xl font-bold text-slate-900">{invoice.amount}</span>
                    </div>

                    {!isAdmin && invoice.status !== 'paid' && !invoice.has_pending_proof && (
                        <div className="mt-6 rounded-xl bg-blue-50 p-4 text-center print:hidden">
                            <button
                                onClick={makePayment}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                <CreditCard className="h-4 w-4" /> Make Payment
                            </button>
                        </div>
                    )}

                    {isAdmin && invoice.proofs && invoice.proofs.length > 0 && (
                        <div className="mt-6 border-t border-slate-100 pt-6 print:hidden">
                            <h4 className="mb-3 text-sm font-semibold text-slate-900">Payment Proofs</h4>
                            <div className="space-y-2">
                                {invoice.proofs.map((p: any) => (
                                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{p.name} — {p.payment_method.replace('_', ' ')}</p>
                                            <p className="text-xs text-slate-500">{p.created_at}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {p.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => router.put(`/payment-proofs/${p.id}/verify`, { status: 'verified' })}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5" /> Verify
                                                    </button>
                                                    <button
                                                        onClick={() => router.put(`/payment-proofs/${p.id}/verify`, { status: 'rejected' })}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                                    >
                                                        <XCircle className="h-3.5 w-3.5" /> Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    p.status === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </DashboardLayout>
        </>
    );
}
