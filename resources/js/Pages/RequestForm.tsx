import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle2, Calendar } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const inputClass =
    'mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none';
const labelClass = 'block text-sm font-medium text-slate-700';

function formatDateToDdMmYyyy(date: Date | null): string {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function parseDdMmYyyy(value: string): Date | null {
    const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;
    const [, day, month, year] = match;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900) return null;
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
    return date;
}

function formatYyyyMmDd(value: string): string {
    const date = parseDdMmYyyy(value);
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export default function RequestForm() {
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm<{
        company_name: string;
        contact_name: string;
        contact_mobile: string;
        contact_email: string;
        password: string;
        password_confirmation: string;
        appointment_type: string;
        appointment_date: string;
        appointment_time: string;
        message: string;
    }>({
        company_name: '',
        contact_name: '',
        contact_mobile: '',
        contact_email: '',
        password: '',
        password_confirmation: '',
        appointment_type: '',
        appointment_date: '',
        appointment_time: '',
        message: '',
    });

    const [appointmentDateDisplay, setAppointmentDateDisplay] = useState('');
    const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);

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
        if (!data.appointment_type) {
            setError('appointment_type', 'Please select an appointment type');
            valid = false;
        }
        if (!appointmentDate) {
            setError('appointment_date', 'Please select an appointment date');
            valid = false;
        }
        if (!data.appointment_time.trim()) {
            setError('appointment_time', 'Please enter a time');
            valid = false;
        }
        if (!data.message.trim()) {
            setError('message', 'Please enter a message');
            valid = false;
        }

        return valid;
    };

    const handleSubmit = () => {
        if (validate()) {
            if (appointmentDate) {
                setData('appointment_date', formatYyyyMmDd(appointmentDateDisplay));
                post('/request', { forceFormData: true });
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleDateChange = (date: Date | null) => {
        setAppointmentDate(date);
        const display = formatDateToDdMmYyyy(date);
        setAppointmentDateDisplay(display);
        setData('appointment_date', date ? formatYyyyMmDd(display) : '');
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

                    <form onKeyDown={handleKeyDown} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="company_name" className={labelClass}>Company Name <span className="text-red-500">*</span></label>
                                <input id="company_name" type="text" value={data.company_name} onChange={(e) => setData('company_name', e.target.value)} className={inputClass} placeholder="Acme Corporation" />
                                {errors.company_name && <p className="mt-1 text-xs text-red-600">{errors.company_name}</p>}
                            </div>

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

                            <div className="border-t border-slate-100 pt-5">
                                <p className="mb-4 text-sm font-semibold text-slate-800">Make an Appointment</p>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="appointment_type" className={labelClass}>Appointment Type <span className="text-red-500">*</span></label>
                                        <select
                                            id="appointment_type"
                                            value={data.appointment_type}
                                            onChange={(e) => setData('appointment_type', e.target.value)}
                                            className={inputClass}
                                        >
                                            <option value="">Select appointment type…</option>
                                            <option value="Physical">Physical</option>
                                            <option value="Online">Online</option>
                                        </select>
                                        {errors.appointment_type && <p className="mt-1 text-xs text-red-600">{errors.appointment_type}</p>}
                                    </div>
                                    <div className="relative">
                                        <label htmlFor="appointment_date" className={labelClass}>Date <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <DatePicker
                                                id="appointment_date"
                                                selected={appointmentDate}
                                                onChange={handleDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="dd/mm/yyyy"
                                                className={inputClass}
                                                wrapperClassName="w-full"
                                                showIcon
                                                icon={
                                                    <Calendar className="h-4 w-4 text-slate-400" />
                                                }
                                                minDate={new Date()}
                                                popperPlacement="bottom-start"
                                            />
                                        </div>
                                        {errors.appointment_date && <p className="mt-1 text-xs text-red-600">{errors.appointment_date}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="appointment_time" className={labelClass}>Time <span className="text-red-500">*</span></label>
                                        <input id="appointment_time" type="text" value={data.appointment_time} onChange={(e) => setData('appointment_time', e.target.value)} className={inputClass} placeholder="10:00AM" />
                                        {errors.appointment_time && <p className="mt-1 text-xs text-red-600">{errors.appointment_time}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="message" className={labelClass}>Message <span className="text-red-500">*</span></label>
                                        <textarea id="message" rows={4} value={data.message} onChange={(e) => setData('message', e.target.value)} className={inputClass} placeholder="Tell us more about your project or any special requirements..." />
                                        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
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
