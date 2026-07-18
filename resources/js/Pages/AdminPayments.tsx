import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle, XCircle, Download, Search } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';

interface Proof {
    id: number;
    invoice_no: string;
    client: string;
    payment_method: string;
    name: string;
    email: string;
    amount: string;
    proof_url: string | null;
    status: string;
    created_at: string;
}

export default function AdminPayments({ proofs }: { proofs: Proof[] }) {
    const [search, setSearch] = useState('');

    const filtered = proofs.filter(
        (p) =>
            p.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.client.toLowerCase().includes(search.toLowerCase()),
    );

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
                                    <th className="pb-3 font-medium">Amount</th>
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
                                            <Link href={`/invoices/${p.invoice_no}`} className="hover:underline">
                                                {p.invoice_no}
                                            </Link>
                                        </td>
                                        <td className="py-4 text-slate-600">{p.client}</td>
                                        <td className="py-4">
                                            <p className="font-medium text-slate-900">{p.name}</p>
                                            <p className="text-xs text-slate-500">{p.email}</p>
                                        </td>
                                        <td className="py-4 text-slate-600 capitalize">{p.payment_method.replace('_', ' ')}</td>
                                        <td className="py-4 font-semibold text-slate-900">{p.amount}</td>
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
                                                        onClick={() => router.put(`/payment-proofs/${p.id}/verify`, { status: 'verified' })}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                                                    </button>
                                                    <button
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
        </>
    );
}