import { Head, Link } from '@inertiajs/react';
import { ArrowRight, FileText } from 'lucide-react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';

interface Invoice {
    id: string;
    project: string | null;
    date: string;
    amount: string;
    status: string;
}

interface InvoicesProps {
    invoices: Invoice[];
    filters: {
        status: string | null;
    };
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

export default function Invoices({ invoices, filters }: InvoicesProps) {
    const currentStatus = filters.status ?? '';

    return (
        <>
            <Head title="Invoices" />

            <DashboardLayout title="Invoices">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Invoices</h2>
                        <p className="text-sm text-slate-500">View and manage all your invoices.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                    >
                        Back to Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/** Filters */}
                <Card className="mb-6">
                    <div className="flex flex-wrap items-center gap-2">
                        {statusOptions.map((option) => (
                            <Link
                                key={option.value}
                                href={`/invoices${option.value ? `?status=${option.value}` : ''}`}
                                preserveState
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    currentStatus === option.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {option.label}
                            </Link>
                        ))}
                    </div>
                </Card>

                {/** Invoices table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-100">
                                <tr className="text-left text-sm text-slate-500">
                                    <th className="pb-3 font-medium">Invoice</th>
                                    <th className="pb-3 font-medium">Project</th>
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">Amount</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="text-sm">
                                        <td className="py-4 font-semibold text-blue-600">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                {invoice.id}
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-600">{invoice.project ?? 'N/A'}</td>
                                        <td className="py-4 text-slate-500">{invoice.date}</td>
                                        <td className="py-4 font-semibold text-slate-900">{invoice.amount}</td>
                                        <td className="py-4">
                                            <Badge color={invoiceBadgeColor(invoice.status)}>{invoice.status}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {invoices.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-lg font-semibold text-slate-900">No invoices found</p>
                            <p className="text-sm text-slate-500">You don't have any invoices matching the selected filter.</p>
                        </div>
                    )}
                </Card>
            </DashboardLayout>
        </>
    );
}
