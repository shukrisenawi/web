import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Ticket as TicketIcon } from 'lucide-react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';

interface Ticket {
    id: string;
    subject: string;
    description: string | null;
    status: string;
    priority: string;
    project: string | null;
    name: string | null;
    email: string | null;
    date: string;
}

interface SupportProps {
    tickets: Ticket[];
}

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

const priorityBadgeColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'red';
        case 'medium':
            return 'amber';
        default:
            return 'slate';
    }
};

export default function Support({ tickets }: SupportProps) {
    return (
        <>
            <Head title="Messages" />

            <DashboardLayout title="Messages">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
                        <p className="text-sm text-slate-500">All incoming messages from the contact form and support tickets.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                    >
                        Back to Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {tickets.map((ticket) => (
                        <Card key={ticket.id} className="flex flex-col">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-blue-50 p-3">
                                    <TicketIcon className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-slate-900">{ticket.id}</p>
                                    <p className="text-sm font-medium text-slate-700">{ticket.subject}</p>
                                    <p className="text-xs text-slate-500">{ticket.project ?? 'No project'} · {ticket.date}</p>
                                    {(ticket.name || ticket.email) && (
                                        <p className="text-xs text-slate-500">{ticket.name} · {ticket.email}</p>
                                    )}
                                </div>
                            </div>
                            {ticket.description && (
                                <p className="mt-3 text-sm text-slate-600 line-clamp-3">{ticket.description}</p>
                            )}
                            <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                                <Badge color={priorityBadgeColor(ticket.priority)}>{ticket.priority}</Badge>
                                <Badge color={ticketBadgeColor(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
                            </div>
                        </Card>
                    ))}

                    {tickets.length === 0 && (
                        <Card className="sm:col-span-2">
                            <div className="py-8 text-center">
                                <p className="text-lg font-semibold text-slate-900">No messages yet</p>
                                <p className="text-sm text-slate-500">New contact form submissions will appear here.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}
