import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, Search, FolderPlus, FileText, ChevronDown, ChevronUp, Paperclip } from 'lucide-react';
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
    joined: string;
    request: RequestInfo | null;
}

export default function ClientDatabase({ clients }: { clients: Client[] }) {
    const { auth } = usePage().props as any;
    void auth;
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<number | null>(null);

    const filtered = clients.filter((c) => {
        const q = search.toLowerCase();
        return (
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            (c.company ?? '').toLowerCase().includes(q)
        );
    });

    const newProject = (id: number) => router.get('/projects', { user_id: id, new: 1 });
    const newBilling = (id: number) => router.get('/invoices', { user_id: id, new: 1 });

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
                                        onClick={() => newBilling(c.id)}
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
