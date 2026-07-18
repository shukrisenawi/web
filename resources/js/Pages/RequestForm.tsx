import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    Check,
    CheckCircle2,
    Clock4,
    FileText,
    Layers,
    Trash2,
    Upload,
} from 'lucide-react';
import { useState } from 'react';

type StepDef = {
    id: number;
    title: string;
    subtitle: string;
    icon: typeof Building2;
};

const STEPS: StepDef[] = [
    { id: 1, title: 'Business Information', subtitle: 'Company & contact details', icon: Building2 },
    { id: 2, title: 'Project Requirements', subtitle: 'What you want to build', icon: Layers },
    { id: 3, title: 'Budget & Timeline', subtitle: 'Budget, deadline & hosting', icon: Clock4 },
    { id: 4, title: 'Review & Submit', subtitle: 'Files, notes & confirm', icon: FileText },
];

const inputClass =
    'mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none';
const labelClass = 'block text-sm font-medium text-slate-700';

export default function RequestForm() {
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm<{
        company_name: string;
        company_address: string;
        industry: string;
        contact_name: string;
        contact_mobile: string;
        contact_email: string;
        password: string;
        password_confirmation: string;
        system_type: string;
        features: string;
        user_roles: string;
        integrations: string;
        budget: string;
        deadline: string;
        hosting_domain: string;
        additional_notes: string;
        files: File[];
    }>({
        company_name: '',
        company_address: '',
        industry: '',
        contact_name: '',
        contact_mobile: '',
        contact_email: '',
        password: '',
        password_confirmation: '',
        system_type: '',
        features: '',
        user_roles: '',
        integrations: '',
        budget: '',
        deadline: '',
        hosting_domain: '',
        additional_notes: '',
        files: [],
    });

    const stepFields: Record<number, (keyof typeof data)[]> = {
        1: ['company_name', 'company_address', 'industry', 'contact_name', 'contact_mobile', 'contact_email', 'password', 'password_confirmation'],
        2: ['system_type', 'features', 'user_roles', 'integrations'],
        3: ['budget', 'deadline', 'hosting_domain'],
        4: ['additional_notes', 'files'],
    };

    const stepHasError = (s: number) => stepFields[s].some((f) => errors[f]);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setData('files', [...data.files, ...Array.from(e.target.files)]);
        e.target.value = '';
    };

    const removeFile = (index: number) => {
        setData('files', data.files.filter((_, i) => i !== index));
    };

    const next = () => setStep((s) => Math.min(4, s + 1));
    const prev = () => setStep((s) => Math.max(1, s - 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/request', { forceFormData: true });
    };

    return (
        <>
            <Head title="Request a Project" />

            <div className="min-h-screen bg-slate-50 px-4 py-10">
                <div className="mx-auto w-full max-w-3xl">
                    <div className="mb-8 text-center">
                        <Link href="/" className="inline-flex items-center justify-center gap-2 text-xl font-bold tracking-wider">
                            <span className="font-mono text-2xl font-black text-blue-600">{'</>'}</span>
                            <span>
                                <span className="text-slate-900">KENJU</span>
                                <span className="text-blue-600">TECH</span>
                            </span>
                        </Link>
                        <h1 className="mt-6 text-2xl font-bold text-slate-900">Request a Project</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Tell us about your project. We&apos;ll set up your client account so you can track progress.
                        </p>
                    </div>

                    {/* Stepper */}
                    <div className="mb-8 flex items-center justify-between">
                        {STEPS.map((s, idx) => {
                            const Icon = s.icon;
                            const isActive = step === s.id;
                            const isDone = step > s.id;
                            const hasErr = stepHasError(s.id);
                            return (
                                <div key={s.id} className="flex flex-1 items-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep(s.id)}
                                        className="flex flex-col items-center gap-2 text-center"
                                    >
                                        <span
                                            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors ${
                                                hasErr
                                                    ? 'border-red-500 bg-red-50 text-red-600'
                                                    : isDone
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

                    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-slate-900">{STEPS[step - 1].title}</h2>
                            <p className="text-sm text-slate-500">{STEPS[step - 1].subtitle}</p>
                        </div>

                        {/* Step 1 - Business Information */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="company_name" className={labelClass}>Company Name *</label>
                                    <input id="company_name" type="text" value={data.company_name} onChange={(e) => setData('company_name', e.target.value)} className={inputClass} placeholder="Acme Corporation" />
                                    {errors.company_name && <p className="mt-1 text-xs text-red-600">{errors.company_name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="company_address" className={labelClass}>Company Address</label>
                                    <textarea id="company_address" rows={2} value={data.company_address} onChange={(e) => setData('company_address', e.target.value)} className={inputClass} placeholder="Street, City, State, Postcode" />
                                    {errors.company_address && <p className="mt-1 text-xs text-red-600">{errors.company_address}</p>}
                                </div>
                                <div>
                                    <label htmlFor="industry" className={labelClass}>Industry</label>
                                    <input id="industry" type="text" value={data.industry} onChange={(e) => setData('industry', e.target.value)} className={inputClass} placeholder="e.g. Retail, Healthcare, Education" />
                                    {errors.industry && <p className="mt-1 text-xs text-red-600">{errors.industry}</p>}
                                </div>

                                <div className="border-t border-slate-100 pt-5">
                                    <p className="mb-4 text-sm font-semibold text-slate-800">Contact Person &amp; Login</p>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="contact_name" className={labelClass}>Contact Name *</label>
                                            <input id="contact_name" type="text" value={data.contact_name} onChange={(e) => setData('contact_name', e.target.value)} className={inputClass} placeholder="John Doe" />
                                            {errors.contact_name && <p className="mt-1 text-xs text-red-600">{errors.contact_name}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="contact_mobile" className={labelClass}>Mobile</label>
                                            <input id="contact_mobile" type="text" value={data.contact_mobile} onChange={(e) => setData('contact_mobile', e.target.value)} className={inputClass} placeholder="+60 12-345 6789" />
                                            {errors.contact_mobile && <p className="mt-1 text-xs text-red-600">{errors.contact_mobile}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label htmlFor="contact_email" className={labelClass}>Email Address * (used to sign in)</label>
                                            <input id="contact_email" type="email" value={data.contact_email} onChange={(e) => setData('contact_email', e.target.value)} className={inputClass} placeholder="you@company.com" />
                                            {errors.contact_email && <p className="mt-1 text-xs text-red-600">{errors.contact_email}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="password" className={labelClass}>Password *</label>
                                            <input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={inputClass} placeholder="••••••••" />
                                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="password_confirmation" className={labelClass}>Confirm Password *</label>
                                            <input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className={inputClass} placeholder="••••••••" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2 - Project Requirements */}
                        {step === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="system_type" className={labelClass}>Type of System</label>
                                    <select id="system_type" value={data.system_type} onChange={(e) => setData('system_type', e.target.value)} className={inputClass}>
                                        <option value="">Select a type…</option>
                                        <option value="Web System">Web System</option>
                                        <option value="Website">Website</option>
                                        <option value="Mobile App">Mobile App</option>
                                        <option value="E-Commerce">E-Commerce</option>
                                        <option value="Digital Marketing">Digital Marketing</option>
                                        <option value="IT Solutions">IT Solutions</option>
                                        <option value="Game Development">Game Development</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.system_type && <p className="mt-1 text-xs text-red-600">{errors.system_type}</p>}
                                </div>
                                <div>
                                    <label htmlFor="features" className={labelClass}>Features / Modules</label>
                                    <textarea id="features" rows={4} value={data.features} onChange={(e) => setData('features', e.target.value)} className={inputClass} placeholder="e.g. Dashboard, reporting, inventory, payments…" />
                                    {errors.features && <p className="mt-1 text-xs text-red-600">{errors.features}</p>}
                                </div>
                                <div>
                                    <label htmlFor="user_roles" className={labelClass}>User Roles</label>
                                    <textarea id="user_roles" rows={3} value={data.user_roles} onChange={(e) => setData('user_roles', e.target.value)} className={inputClass} placeholder="e.g. Admin, Staff, Customer…" />
                                    {errors.user_roles && <p className="mt-1 text-xs text-red-600">{errors.user_roles}</p>}
                                </div>
                                <div>
                                    <label htmlFor="integrations" className={labelClass}>Integrations</label>
                                    <textarea id="integrations" rows={3} value={data.integrations} onChange={(e) => setData('integrations', e.target.value)} className={inputClass} placeholder="e.g. Payment gateway, WhatsApp, SMS, ERP…" />
                                    {errors.integrations && <p className="mt-1 text-xs text-red-600">{errors.integrations}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 3 - Budget & Timeline */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="budget" className={labelClass}>Budget</label>
                                    <input id="budget" type="text" value={data.budget} onChange={(e) => setData('budget', e.target.value)} className={inputClass} placeholder="e.g. RM 10,000 - RM 20,000" />
                                    {errors.budget && <p className="mt-1 text-xs text-red-600">{errors.budget}</p>}
                                </div>
                                <div>
                                    <label htmlFor="deadline" className={labelClass}>Deadline</label>
                                    <input id="deadline" type="date" value={data.deadline} onChange={(e) => setData('deadline', e.target.value)} className={inputClass} />
                                    {errors.deadline && <p className="mt-1 text-xs text-red-600">{errors.deadline}</p>}
                                </div>
                                <div>
                                    <label htmlFor="hosting_domain" className={labelClass}>Hosting / Domain Needs</label>
                                    <textarea id="hosting_domain" rows={3} value={data.hosting_domain} onChange={(e) => setData('hosting_domain', e.target.value)} className={inputClass} placeholder="Do you have a domain / hosting, or need us to arrange it?" />
                                    {errors.hosting_domain && <p className="mt-1 text-xs text-red-600">{errors.hosting_domain}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 4 - Review & Submit */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div>
                                    <span className={labelClass}>Upload Files</span>
                                    <label htmlFor="files" className="mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/40">
                                        <Upload className="h-6 w-6 text-slate-400" />
                                        <span className="text-sm text-slate-600">Click to upload files</span>
                                        <span className="text-xs text-slate-400">Max 10 files, 10MB each</span>
                                        <input id="files" type="file" multiple onChange={handleFiles} className="hidden" />
                                    </label>
                                    {errors.files && <p className="mt-1 text-xs text-red-600">{errors.files}</p>}

                                    {data.files.length > 0 && (
                                        <ul className="mt-3 space-y-2">
                                            {data.files.map((file, i) => (
                                                <li key={`${file.name}-${i}`} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                                                    <span className="truncate text-slate-700">{file.name}</span>
                                                    <button type="button" onClick={() => removeFile(i)} className="ml-3 text-slate-400 hover:text-red-600">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="additional_notes" className={labelClass}>Additional Notes</label>
                                    <textarea id="additional_notes" rows={4} value={data.additional_notes} onChange={(e) => setData('additional_notes', e.target.value)} className={inputClass} placeholder="Anything else we should know?" />
                                    {errors.additional_notes && <p className="mt-1 text-xs text-red-600">{errors.additional_notes}</p>}
                                </div>

                                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                        <CheckCircle2 className="h-4 w-4 text-blue-600" /> Summary
                                    </p>
                                    <dl className="grid gap-2 text-sm sm:grid-cols-2">
                                        <SummaryRow label="Company" value={data.company_name} />
                                        <SummaryRow label="Industry" value={data.industry} />
                                        <SummaryRow label="Contact" value={data.contact_name} />
                                        <SummaryRow label="Email" value={data.contact_email} />
                                        <SummaryRow label="System" value={data.system_type} />
                                        <SummaryRow label="Budget" value={data.budget} />
                                        <SummaryRow label="Deadline" value={data.deadline} />
                                        <SummaryRow label="Files" value={data.files.length ? `${data.files.length} file(s)` : ''} />
                                    </dl>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                            {step > 1 ? (
                                <button type="button" onClick={prev} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                                    <ArrowLeft className="h-4 w-4" /> Back
                                </button>
                            ) : (
                                <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                                    Cancel
                                </Link>
                            )}

                            {step < 4 ? (
                                <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                                    Next <ArrowRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70">
                                    Submit Request <ArrowRight className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="text-slate-700">{value || <span className="text-slate-300">—</span>}</dd>
        </div>
    );
}
