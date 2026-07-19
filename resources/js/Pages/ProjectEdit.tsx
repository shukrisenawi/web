import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Check, CheckCircle2, Clock4, FileText, Layers, Paperclip, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card } from '@/Layouts/Dashboard';

const inputClass = 'mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none';
const labelClass = 'block text-sm font-medium text-slate-700';

const SYSTEM_TYPES = [
    { value: 'Web System', label: 'Web System' },
    { value: 'Website', label: 'Website' },
    { value: 'Mobile App', label: 'Mobile App' },
    { value: 'E-Commerce', label: 'E-Commerce' },
    { value: 'Digital Marketing', label: 'Digital Marketing' },
    { value: 'IT Solutions', label: 'IT Solutions' },
    { value: 'Game Development', label: 'Game Development' },
    { value: 'Other', label: 'Other' },
];

const STEPS = [
    { id: 1, title: 'Project Requirements', subtitle: 'Type of system, features & roles', icon: Layers },
    { id: 2, title: 'Budget & Timeline', subtitle: 'Budget, deadline & hosting', icon: Clock4 },
    { id: 3, title: 'Review & Submit', subtitle: 'Files, notes & confirm', icon: FileText },
];

interface FileUpload {
    id: number;
    filename: string;
    size: number;
    url: string;
}

interface ProjectData {
    id: number;
    title: string;
    service_type: string;
    system_type: string | null;
    features: string | null;
    user_roles: string | null;
    integrations: string | null;
    budget: string | null;
    deadline: string | null;
    hosting_domain: string | null;
    additional_notes: string | null;
    description: string | null;
    request_quotation?: boolean;
    fileUploads?: FileUpload[];
    progress?: number;
    status?: string;
    payment_status?: string;
    key_person?: string | null;
    status_remark?: string | null;
}

interface Props {
    project: ProjectData;
    services?: { value: string; label: string }[];
    systemTypes?: { value: string; label: string }[];
}

function parseSystemType(raw: string | null): { system_type: string; system_type_other: string } {
    if (!raw) return { system_type: '', system_type_other: '' };
    const match = raw.match(/^Other:\s*(.+)$/);
    if (match) return { system_type: 'Other', system_type_other: match[1] };
    return { system_type: raw, system_type_other: '' };
}

export default function ProjectEdit({ project, services = [], systemTypes = [] }: Props) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.isAdmin;
    const sysTypes = systemTypes.length > 0 ? systemTypes : SYSTEM_TYPES;
    const parsed = parseSystemType(project.system_type);

    const [step, setStep] = useState(1);

    const baseData: any = {
        title: project.title,
        service_type: project.service_type,
        system_type: parsed.system_type,
        system_type_other: parsed.system_type_other,
        features: project.features ?? '',
        user_roles: project.user_roles ?? '',
        integrations: project.integrations ?? '',
        budget: project.budget ?? '',
        deadline: project.deadline ?? '',
        hosting_domain: project.hosting_domain ?? '',
        additional_notes: project.additional_notes ?? '',
        description: project.description ?? '',
        request_quotation: false,
    };

    if (isAdmin) {
        Object.assign(baseData, {
            progress: project.progress ?? 0,
            status: project.status ?? 'in_progress',
            payment_status: project.payment_status ?? 'unpaid',
            key_person: project.key_person ?? '',
            status_remark: project.status_remark ?? '',
        });
    }

    const form = useForm(baseData);

    const validateStep = (s: number) => {
        form.clearErrors();
        let valid = true;
        if (s === 1) {
            if (!form.data.title.trim()) {
                form.setError('title', 'Please enter a project title');
                valid = false;
            }
        }
        return valid;
    };

    const nextStep = () => {
        if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
    };

    const prevStep = () => setStep((s) => Math.max(1, s - 1));

    const submitUpdate = () => {
        if (isAdmin) {
            form.put(`/projects/${project.id}`, {
                onSuccess: () => {},
            });
        } else {
            form.put(`/projects/${project.id}`, {
                onSuccess: () => {},
            });
        }
    };

    return (
        <>
            <Head title="Edit Project" />

            <DashboardLayout title="Edit Project">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Edit Project</h2>
                            <p className="text-sm text-slate-500">Update your project details.</p>
                        </div>
                        <Link
                            href="/projects"
                            className="text-sm font-semibold text-blue-600 hover:underline"
                        >
                            &larr; Back to Projects
                        </Link>
                    </div>

                    <Card className="p-6">
                        {/* Stepper */}
                        <div className="mb-6 flex items-center justify-between">
                            {STEPS.map((s, idx) => {
                                const Icon = s.icon;
                                const isActive = step === s.id;
                                const isDone = step > s.id;
                                return (
                                    <div key={s.id} className="flex flex-1 items-center">
                                        <button
                                            type="button"
                                            onClick={() => s.id <= step && setStep(s.id)}
                                            className={`flex flex-col items-center gap-2 text-center ${s.id > step ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            <span
                                                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors ${
                                                    isDone
                                                        ? 'border-blue-600 bg-blue-600 text-white'
                                                        : isActive
                                                            ? 'border-blue-600 bg-white text-blue-600'
                                                            : 'border-slate-200 bg-white text-slate-400'
                                                }`}
                                            >
                                                {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                            </span>
                                            <span
                                                className={`hidden text-xs font-medium sm:block ${
                                                    isActive ? 'text-slate-900' : 'text-slate-400'
                                                }`}
                                            >
                                                {s.title}
                                            </span>
                                        </button>
                                        {idx < STEPS.length - 1 && (
                                            <div className={`mx-2 h-0.5 flex-1 ${step > s.id ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Step 1 - Project Requirements */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <h2 className="mb-1 text-lg font-semibold text-slate-900">Project Requirements</h2>
                                    <p className="text-sm text-slate-500">Type of system, features &amp; roles.</p>
                                </div>
                                <div>
                                    <label htmlFor="project-title" className={labelClass}>Project Title <span className="text-red-500">*</span></label>
                                    <input
                                        id="project-title"
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Company Website Revamp"
                                    />
                                    {form.errors.title && <p className="mt-1 text-xs text-red-500">{form.errors.title}</p>}
                                </div>
                                <div>
                                    <label htmlFor="system-type" className={labelClass}>Type of System <span className="text-red-500">*</span></label>
                                    <select
                                        id="system-type"
                                        value={form.data.system_type}
                                        onChange={(e) => form.setData('system_type', e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="">Select a type…</option>
                                        {sysTypes.map((opt: any) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    {form.errors.system_type && <p className="mt-1 text-xs text-red-500">{form.errors.system_type}</p>}
                                </div>
                                {form.data.system_type === 'Other' && (
                                    <div>
                                        <label htmlFor="system-type-other" className={labelClass}>Please specify the system type <span className="text-red-500">*</span></label>
                                        <input
                                            id="system-type-other"
                                            value={form.data.system_type_other}
                                            onChange={(e) => form.setData('system_type_other', e.target.value)}
                                            className={inputClass}
                                            placeholder="e.g. IoT Platform, Chatbot…"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="features" className={labelClass}>Features / Modules <span className="text-red-500">*</span></label>
                                    <textarea
                                        id="features"
                                        rows={4}
                                        value={form.data.features}
                                        onChange={(e) => form.setData('features', e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Dashboard, reporting, inventory, payments…"
                                    />
                                    {form.errors.features && <p className="mt-1 text-xs text-red-500">{form.errors.features}</p>}
                                </div>
                                <div>
                                    <label htmlFor="user-roles" className={labelClass}>User Roles <span className="text-red-500">*</span></label>
                                    <textarea
                                        id="user-roles"
                                        rows={3}
                                        value={form.data.user_roles}
                                        onChange={(e) => form.setData('user_roles', e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Admin, Staff, Customer…"
                                    />
                                    {form.errors.user_roles && <p className="mt-1 text-xs text-red-500">{form.errors.user_roles}</p>}
                                </div>
                                <div>
                                    <label htmlFor="integrations" className={labelClass}>Integrations <span className="text-red-500">*</span></label>
                                    <textarea
                                        id="integrations"
                                        rows={3}
                                        value={form.data.integrations}
                                        onChange={(e) => form.setData('integrations', e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Payment gateway, WhatsApp, SMS, ERP…"
                                    />
                                    {form.errors.integrations && <p className="mt-1 text-xs text-red-500">{form.errors.integrations}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 2 - Budget & Timeline */}
                        {step === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <h2 className="mb-1 text-lg font-semibold text-slate-900">Budget &amp; Timeline</h2>
                                    <p className="text-sm text-slate-500">Budget, deadline &amp; hosting.</p>
                                </div>
                                <div>
                                    <label htmlFor="budget" className={labelClass}>Budget <span className="text-red-500">*</span></label>
                                    <input
                                        id="budget"
                                        value={form.data.budget}
                                        onChange={(e) => form.setData('budget', e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. RM 10,000 - RM 20,000"
                                    />
                                    {form.errors.budget && <p className="mt-1 text-xs text-red-500">{form.errors.budget}</p>}
                                </div>
                                <div>
                                    <label htmlFor="deadline" className={labelClass}>Deadline <span className="text-red-500">*</span></label>
                                    <input
                                        id="deadline"
                                        type="date"
                                        value={form.data.deadline}
                                        onChange={(e) => form.setData('deadline', e.target.value)}
                                        className={inputClass}
                                    />
                                    {form.errors.deadline && <p className="mt-1 text-xs text-red-500">{form.errors.deadline}</p>}
                                </div>
                                <div>
                                    <label htmlFor="hosting-domain" className={labelClass}>Hosting / Domain Needs <span className="text-red-500">*</span></label>
                                    <textarea
                                        id="hosting-domain"
                                        rows={3}
                                        value={form.data.hosting_domain}
                                        onChange={(e) => form.setData('hosting_domain', e.target.value)}
                                        className={inputClass}
                                        placeholder="Do you have a domain / hosting, or need us to arrange it?"
                                    />
                                    {form.errors.hosting_domain && <p className="mt-1 text-xs text-red-500">{form.errors.hosting_domain}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="request-quotation"
                                        type="checkbox"
                                        checked={form.data.request_quotation}
                                        onChange={(e) => form.setData('request_quotation', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="request-quotation" className="text-sm text-slate-600">Request a quotation instead of a package</label>
                                </div>
                            </div>
                        )}

                        {/* Step 3 - Review & Submit */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <div>
                                    <h2 className="mb-1 text-lg font-semibold text-slate-900">Review &amp; Submit</h2>
                                    <p className="text-sm text-slate-500">Review your changes &amp; confirm.</p>
                                </div>
                                <div>
                                    <span className={labelClass}>Project Files</span>
                                    {project.fileUploads && project.fileUploads.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {project.fileUploads.map((f) => (
                                                <div key={f.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                                                    <a
                                                        href={f.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 truncate text-blue-600 hover:underline"
                                                    >
                                                        <Paperclip className="h-3 w-3 shrink-0" />
                                                        <span className="truncate">{f.filename}</span>
                                                        <span className="ml-auto shrink-0 text-[10px] text-slate-400">
                                                            {f.size > 1024 ? `${(f.size / 1024).toFixed(1)} KB` : `${f.size} B`}
                                                        </span>
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (confirm('Delete this file?')) {
                                                                router.delete(`/projects/${project.id}/files/${f.id}`, {
                                                                    preserveState: true,
                                                                    preserveScroll: true,
                                                                });
                                                            }
                                                        }}
                                                        className="ml-2 shrink-0 text-slate-400 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/40">
                                        <Paperclip className="h-6 w-6 text-slate-400" />
                                        <span className="text-sm text-slate-600">Click to upload new files</span>
                                        <span className="text-xs text-slate-400">Max 20MB per file</span>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files ?? []);
                                                files.forEach((f) => {
                                                    const formData = new FormData();
                                                    formData.append('file', f);
                                                    router.post(`/projects/${project.id}/files`, formData, {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    });
                                                });
                                                e.target.value = '';
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="additional-notes" className={labelClass}>Additional Notes</label>
                                    <textarea
                                        id="additional-notes"
                                        rows={4}
                                        value={form.data.additional_notes}
                                        onChange={(e) => form.setData('additional_notes', e.target.value)}
                                        className={inputClass}
                                        placeholder="Anything else we should know?"
                                    />
                                </div>
                                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                        <CheckCircle2 className="h-4 w-4 text-blue-600" /> Summary
                                    </p>
                                    <dl className="grid gap-2 text-sm sm:grid-cols-2">
                                        <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Title</dt><dd className="text-slate-700">{form.data.title || <span className="text-slate-300">—</span>}</dd></div>
                                        <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">System Type</dt><dd className="text-slate-700">{form.data.system_type === 'Other' && form.data.system_type_other ? `Other: ${form.data.system_type_other}` : form.data.system_type || <span className="text-slate-300">—</span>}</dd></div>
                                        <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Budget</dt><dd className="text-slate-700">{form.data.budget || <span className="text-slate-300">—</span>}</dd></div>
                                        <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Deadline</dt><dd className="text-slate-700">{form.data.deadline || <span className="text-slate-300">—</span>}</dd></div>
                                    </dl>
                                </div>
                                {isAdmin && (
                                    <div className="border-t border-slate-100 pt-5">
                                        <h3 className="text-sm font-semibold text-slate-800">Admin Settings</h3>
                                        <p className="mb-4 text-xs text-slate-500">Internal project management details.</p>
                                        <div className="space-y-4">
                                            <div>
                                                <label className={labelClass}>Progress: {form.data.progress}%</label>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={100}
                                                    value={form.data.progress}
                                                    onChange={(e) => form.setData('progress', Number(e.target.value))}
                                                    className="w-full accent-blue-600"
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Status</label>
                                                <select
                                                    value={form.data.status}
                                                    onChange={(e) => form.setData('status', e.target.value)}
                                                    className={inputClass}
                                                >
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="on_hold">On Hold</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelClass}>Payment Status</label>
                                                <select
                                                    value={form.data.payment_status}
                                                    onChange={(e) => form.setData('payment_status', e.target.value)}
                                                    className={inputClass}
                                                >
                                                    <option value="unpaid">Unpaid</option>
                                                    <option value="partial">Partial</option>
                                                    <option value="paid">Paid</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelClass}>Key Person (PIC)</label>
                                                <input
                                                    value={form.data.key_person}
                                                    onChange={(e) => form.setData('key_person', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="e.g. Ahmad (Project Manager)"
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Status Remark</label>
                                                <textarea
                                                    value={form.data.status_remark}
                                                    onChange={(e) => form.setData('status_remark', e.target.value)}
                                                    rows={2}
                                                    className={inputClass}
                                                    placeholder="Note visible to the client about current status..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                                    <ArrowRight className="h-4 w-4 rotate-180" /> Back
                                </button>
                            ) : (
                                <Link href="/projects" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                                    Cancel
                                </Link>
                            )}

                            {step < 3 ? (
                                <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                                    Next <ArrowRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <button type="button" onClick={submitUpdate} disabled={form.processing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                                    <Save className="h-4 w-4" /> Save Changes
                                </button>
                            )}
                        </div>
                    </Card>
                </div>
            </DashboardLayout>
        </>
    );
}
