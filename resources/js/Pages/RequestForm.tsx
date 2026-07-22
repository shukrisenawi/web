import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, CheckCircle2 } from 'lucide-react';

const inputClass =
    'mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none';
const labelClass = 'block text-sm font-medium text-slate-700';

const INDUSTRIES = [
    'Retail & E-Commerce',
    'Food & Beverage (F&B)',
    'Healthcare',
    'Education',
    'Finance',
    'Manufacturing',
    'Construction',
    'Real Estate',
    'Logistics',
    'Travel & Tourism',
    'Hotel & Hospitality',
    'Government',
    'NGO / Non-Profit',
    'Religious Organization',
    'Agriculture',
    'Beauty & Wellness',
    'Automotive',
    'IT & Technology',
    'Professional Services',
    'Others',
];

export default function RequestForm() {
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm<{
        company_name: string;
        company_address: string;
        industry: string;
        industry_other: string;
        contact_name: string;
        contact_mobile: string;
        contact_email: string;
        password: string;
        password_confirmation: string;
    }>({
        company_name: '',
        company_address: '',
        industry: '',
        industry_other: '',
        contact_name: '',
        contact_mobile: '',
        contact_email: '',
        password: '',
        password_confirmation: '',
    });

    const validate = (): boolean => {
        clearErrors();
        let valid = true;

        if (!data.company_name.trim()) {
            setError('company_name', 'Please enter your company name');
            valid = false;
        }
        if (!data.contact_name.trim()) {
            setError('contact_name', 'Please enter your contact name');
            valid = false;
        }
        if (!data.contact_email.trim()) {
            setError('contact_email', 'Please enter your email address');
            valid = false;
        }
        if (!data.password) {
            setError('password', 'Please enter a password');
            valid = false;
        } else if (data.password.length < 6) {
            setError('password', 'Password must be at least 6 characters');
            valid = false;
        }
        if (data.password && !data.password_confirmation) {
            setError('password_confirmation', 'Please confirm your password');
            valid = false;
        }
        if (data.password && data.password_confirmation && data.password !== data.password_confirmation) {
            setError('password_confirmation', 'Passwords do not match');
            valid = false;
        }
        if (!data.industry) {
            setError('industry', 'Please select your industry');
            valid = false;
        }
        if (data.industry === 'Others' && !data.industry_other.trim()) {
            setError('industry_other', 'Please specify your industry');
            valid = false;
        }

        return valid;
    };

    const handleSubmit = () => {
        if (validate()) {
            post('/request', { forceFormData: true });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
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
                                <span className="ml-2 text-blue-600">TECH</span>
                            </span>
                        </Link>
                        <h1 className="mt-6 text-2xl font-bold text-slate-900">Request a Project</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Tell us about your business. We&apos;ll create your client account and follow up with a project discussion.
                        </p>
                    </div>

                    <div className="mb-6 flex items-center justify-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-blue-600 bg-white text-blue-600">
                            <Building2 className="h-5 w-5" />
                        </span>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-slate-900">Business Information</p>
                            <p className="text-xs text-slate-500">Company & contact details</p>
                        </div>
                    </div>

                    <form onKeyDown={handleKeyDown} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-slate-900">Business Information</h2>
                            <p className="text-sm text-slate-500">Company & contact details</p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="company_name" className={labelClass}>Company Name <span className="text-red-500">*</span></label>
                                <input id="company_name" type="text" value={data.company_name} onChange={(e) => setData('company_name', e.target.value)} className={inputClass} placeholder="Acme Corporation" />
                                {errors.company_name && <p className="mt-1 text-xs text-red-600">{errors.company_name}</p>}
                            </div>
                            <div>
                                <label htmlFor="company_address" className={labelClass}>Company Address</label>
                                <textarea id="company_address" rows={2} value={data.company_address} onChange={(e) => setData('company_address', e.target.value)} className={inputClass} placeholder="Street, City, State, Postcode" />
                                {errors.company_address && <p className="mt-1 text-xs text-red-600">{errors.company_address}</p>}
                            </div>
                            <div>
                                <label htmlFor="industry" className={labelClass}>Industry <span className="text-red-500">*</span></label>
                                <select
                                    id="industry"
                                    value={data.industry}
                                    onChange={(e) => setData('industry', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="">Select an industry…</option>
                                    {INDUSTRIES.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                {errors.industry && <p className="mt-1 text-xs text-red-600">{errors.industry}</p>}
                            </div>
                            {data.industry === 'Others' && (
                                <div>
                                    <label htmlFor="industry_other" className={labelClass}>Please specify your industry <span className="text-red-500">*</span></label>
                                    <input
                                        id="industry_other"
                                        type="text"
                                        value={data.industry_other}
                                        onChange={(e) => setData('industry_other', e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Media, Entertainment…"
                                    />
                                    {errors.industry_other && <p className="mt-1 text-xs text-red-600">{errors.industry_other}</p>}
                                </div>
                            )}

                            <div className="border-t border-slate-100 pt-5">
                                <p className="mb-4 text-sm font-semibold text-slate-800">Contact Person &amp; Login</p>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="contact_name" className={labelClass}>Contact Name <span className="text-red-500">*</span></label>
                                        <input id="contact_name" type="text" value={data.contact_name} onChange={(e) => setData('contact_name', e.target.value)} className={inputClass} placeholder="John Doe" />
                                        {errors.contact_name && <p className="mt-1 text-xs text-red-600">{errors.contact_name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="contact_mobile" className={labelClass}>Mobile</label>
                                        <input id="contact_mobile" type="tel" value={data.contact_mobile} onChange={(e) => setData('contact_mobile', e.target.value)} className={inputClass} placeholder="+60 12-345 6789" />
                                        {errors.contact_mobile && <p className="mt-1 text-xs text-red-600">{errors.contact_mobile}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="contact_email" className={labelClass}>Email Address <span className="text-red-500">*</span> (used to sign in)</label>
                                        <input id="contact_email" type="email" value={data.contact_email} onChange={(e) => setData('contact_email', e.target.value)} className={inputClass} placeholder="you@company.com" />
                                        {errors.contact_email && <p className="mt-1 text-xs text-red-600">{errors.contact_email}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="password" className={labelClass}>Password <span className="text-red-500">*</span></label>
                                        <input id="password" type="password" autoComplete="new-password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={inputClass} placeholder="••••••••" />
                                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="password_confirmation" className={labelClass}>Confirm Password <span className="text-red-500">*</span></label>
                                        <input id="password_confirmation" type="password" autoComplete="new-password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className={inputClass} placeholder="••••••••" />
                                        {errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{errors.password_confirmation}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                                Cancel
                            </Link>
                            <button type="button" onClick={handleSubmit} disabled={processing} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70">
                                <CheckCircle2 className="h-4 w-4" /> Submit Request
                            </button>
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
