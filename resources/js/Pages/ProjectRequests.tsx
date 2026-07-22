import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, Search, ChevronDown, ChevronUp, CheckCircle2, Mail, Phone, Calendar, Clock, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';

interface ProjectRequestItem {
    id: number;
    company_name: string;
    contact_name: string;
    contact_email: string;
    contact_mobile: string | null;
    appointment_type: string;
    appointment_date: string;
    appointment_time: string;
    message: string;
    status: 'pending' | 'reviewed' | 'approved' | 'rejected';
    created_at: string;
    user_id: number;
}

export default function ProjectRequests({ requests }: { requests: ProjectRequestItem[] }) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<number | null>(null);

    const filtered = requests.filter((r) => {
        const q = search.toLowerCase();
        return (
            r.company_name.toLowerCase().includes(q) ||
            r.contact_name.toLowerCase().includes(q) ||
            r.contact_email.toLowerCase().includes(q)
        );
    });

    const markAsReviewed = (id: number) => {
        router.post(`/requests/${id}/review`, {}, { preserveScroll: true });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'green';
            case 'rejected': return 'red';
            case 'reviewed': return 'blue';
            default: return 'amber';
        }
    };

    return (
        <>
            <Head title="Project Requests" />

            <DashboardLayout title="Project Requests">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Project Requests</h2>
                        <p className="text-sm text-slate-500">
                            New registrations submitted through the request form. Review and follow up with clients.
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
                    <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-medium">{flash.success}</span>
                    </div>
                )}

                <Card className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by company, name or email..."
                            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </Card>

                <div className="space-y-4">
                    {filtered.map((r) => (
                        <Card key={r.id} className="flex flex-col">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{r.company_name}</h3>
                                        <p className="text-sm text-slate-500">{r.contact_name} · {r.contact_email}</p>
                                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                                            <span>{r.appointment_type}</span>
                                            <span>{r.appointment_date}</span>
                                            <span>{r.appointment_time}</span>
                                            <span>Submitted {r.created_at}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge color={getStatusColor(r.status)}>{r.status}</Badge>
                                    {r.status === 'pending' && (
                                        <button
                                            type="button"
                                            onClick={() => markAsReviewed(r.id)}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Reviewed
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        Details
                                        {expanded === r.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                    </button>
                                </div>
                            </div>

                            {expanded === r.id && (
                                <div className="mt-4 border-t border-slate-100 pt-4">
                                    <p className="mb-3 text-sm font-semibold text-slate-800">Request Details</p>
                                    <dl className="grid gap-3 text-sm sm:grid-cols-2">
                                        <Field label="Company" value={r.company_name} />
                                        <Field label="Contact Name" value={r.contact_name} />
                                        <Field label="Email" value={r.contact_email} />
                                        <Field label="Mobile" value={r.contact_mobile} />
                                        <Field label="Appointment Type" value={r.appointment_type} />
                                        <Field label="Appointment Date" value={r.appointment_date} />
                                        <Field label="Appointment Time" value={r.appointment_time} />
                                        <Field label="Submitted" value={r.created_at} />
                                        <div className="sm:col-span-2">
                                            <dt className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                <MessageSquare className="h-3 w-3" /> Message
                                            </dt>
                                            <dd className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-slate-700">{r.message || <span className="text-slate-300">—</span>}</dd>
                                        </div>
                                    </dl>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <a
                                            href={`mailto:${r.contact_email}`}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            <Mail className="h-3.5 w-3.5" /> Email Client
                                        </a>
                                        {r.contact_mobile && (
                                            <a
                                                href={`https://wa.me/${r.contact_mobile.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                            >
                                                <Phone className="h-3.5 w-3.5" /> WhatsApp
                                            </a>
                                        )}
                                        <Link
                                            href={`/projects?user_id=${r.user_id}&new=1`}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                        >
                                            <Calendar className="h-3.5 w-3.5" /> Create Project
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="py-16 text-center">
                        <p className="text-lg font-semibold text-slate-900">No project requests found</p>
                        <p className="text-sm text-slate-500">New submissions will appear here.</p>
                    </div>
                )}
            </DashboardLayout>
        </>
    );
}

function Field({ label, value, full = false }: { label: string; value: string | null; full?: boolean }) {
    return (
        <div className={full ? 'sm:col-span-2' : ''}>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="text-slate-700">{value || <span className="text-slate-300">—</span>}</dd>
        </div>
    );
}
