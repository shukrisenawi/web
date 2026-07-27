import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle, XCircle, Download, Search, Pencil } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';
import Modal from '@/Components/Modal';

interface Proof {
    id: number;
    invoice_no: string;
    client: string;
    payment_method: string;
    name: string;
    email: string;
    invoice_amount: string;
    amount: string | null;
    proof_url: string | null;
    status: string;
    created_at: string;
}

const inputClass = 'mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none';
const labelClass = 'block text-sm font-medium text-slate-700';

export default function AdminPayments({ proofs }: { proofs: Proof[] }) {
    const [search, setSearch] = useState('');
    const [approveProof, setApproveProof] = useState<Proof | null>(null);
    const [approveAmount, setApproveAmount] = useState('');
    const [editProof, setEditProof] = useState<Proof | null>(null);
    const [editAmount, setEditAmount] = useState('');

    const filtered = proofs.filter(
        (p) =>
            p.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.client.toLowerCase().includes(search.toLowerCase()),
    );

    const submitApprove = () => {
        if (!approveProof) return;
        const amount = parseFloat(approveAmount);
        if (Number.isNaN(amount) || amount <= 0) return;

        router.put(`/payment-proofs/${approveProof.id}/verify`, {
            status: 'verified',
            amount,
        }, {
            onSuccess: () => {
                setApproveProof(null);
                setApproveAmount('');
            },
        });
    };

    const submitEditAmount = () => {
        if (!editProof) return;
        const amount = parseFloat(editAmount);
        if (Number.isNaN(amount) || amount < 0) return;

        router.put(`/payment-proofs/${editProof.id}/amount`, {
            amount,
        }, {
            onSuccess: () => {
                setEditProof(null);
                setEditAmount('');
            },
        });
    };

    return (
        <>
            <Head title="Payments" />

            <DashboardLayout title="Payments">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Payment Verification</h2>
                        <p className="text-sm text-slate-500">Review and approve client payment proofs.</p>
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
                            placeholder="Search by invoice, name, or client..."
                            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </Card>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-100">
                                <tr className="text-left text-sm text-slate-500">
                                    <th className="pb-3 font-medium">Invoice</th>
                                    <th className="pb-3 font-medium">Client</th>
                                    <th className="pb-3 font-medium">Submitted By</th>
                                    <th className="pb-3 font-medium">Method</th>
                                    <th className="pb-3 font-medium">Invoice Amount</th>
                                    <th className="pb-3 font-medium">Paid Amount</th>
                                    <th className="pb-3 font-medium">Proof</th>
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="text-sm">
                                        <td className="py-4 font-semibold text-blue-600">
                                            {p.invoice_no ? (
                                                <Link href={`/invoices/${p.invoice_no}`} className="hover:underline">
                                                    {p.invoice_no}
                                                </Link>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-slate-600">{p.client}</td>
                                        <td className="py-4">
                                            <p className="font-medium text-slate-900">{p.name}</p>
                                            <p className="text-xs text-slate-500">{p.email}</p>
                                        </td>
                                        <td className="py-4 text-slate-600 capitalize">{p.payment_method.replace('_', ' ')}</td>
                                        <td className="py-4 font-semibold text-slate-900">{p.invoice_amount}</td>
                                        <td className="py-4 font-semibold text-emerald-600">
                                            <div className="flex items-center gap-2">
                                                {p.amount ?? <span className="text-slate-400">—</span>}
                                                {p.status === 'verified' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => { setEditProof(p); setEditAmount(p.amount ? p.amount.replace(/[^0-9.]/g, '') : ''); }}
                                                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                                                        title="Edit paid amount"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            {p.proof_url ? (
                                                <a
                                                    href={p.proof_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                                                >
                                                    View
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-slate-500">{p.created_at}</td>
                                        <td className="py-4">
                                            <Badge color={p.status === 'verified' ? 'green' : p.status === 'rejected' ? 'red' : 'amber'}>
                                                {p.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4">
                                            {p.status === 'pending' ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setApproveProof(p); setApproveAmount(''); }}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => router.put(`/payment-proofs/${p.id}/verify`, { status: 'rejected' })}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                                    >
                                                        <XCircle className="h-3.5 w-3.5" /> Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-lg font-semibold text-slate-900">No payments found</p>
                            <p className="text-sm text-slate-500">
                                {search ? 'No results matching your search.' : 'No payment proofs submitted yet.'}
                            </p>
                        </div>
                    )}
                </Card>
            </DashboardLayout>

            <Modal open={approveProof !== null} onClose={() => { setApproveProof(null); setApproveAmount(''); }}>
                <div className="px-6 py-5">
                    <h2 className="mb-1 text-lg font-bold text-slate-900">Approve Payment</h2>
                    <p className="mb-4 text-sm text-slate-500">
                        Enter the amount actually paid by the customer for invoice{' '}
                        <span className="font-semibold text-slate-900">{approveProof?.invoice_no}</span>.
                    </p>
                    <div>
                        <label htmlFor="approve-amount" className={labelClass}>Amount Paid</label>
                        <input
                            id="approve-amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={approveAmount}
                            onChange={(e) => setApproveAmount(e.target.value)}
                            placeholder="e.g. 1500.00"
                            className={inputClass}
                        />
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={() => { setApproveProof(null); setApproveAmount(''); }}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={submitApprove}
                            disabled={!approveAmount || parseFloat(approveAmount) <= 0 || Number.isNaN(parseFloat(approveAmount))}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                            Approve Payment
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal open={editProof !== null} onClose={() => { setEditProof(null); setEditAmount(''); }}>
                <div className="px-6 py-5">
                    <h2 className="mb-1 text-lg font-bold text-slate-900">Edit Paid Amount</h2>
                    <p className="mb-4 text-sm text-slate-500">
                        Update the recorded paid amount for invoice{' '}
                        <span className="font-semibold text-slate-900">{editProof?.invoice_no}</span>.
                    </p>
                    <div>
                        <label htmlFor="edit-amount" className={labelClass}>Paid Amount</label>
                        <input
                            id="edit-amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            placeholder="e.g. 1500.00"
                            className={inputClass}
                        />
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={() => { setEditProof(null); setEditAmount(''); }}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={submitEditAmount}
                            disabled={!editAmount || parseFloat(editAmount) < 0 || Number.isNaN(parseFloat(editAmount))}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Save Amount
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
