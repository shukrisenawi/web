import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Calendar, CalendarClock, CheckCircle2, Clock, Loader2, Plus, X } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DashboardLayout } from '@/Layouts/Dashboard';

const inputClass = 'mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none';
const labelClass = 'block text-sm font-medium text-slate-700';

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
};

const statusDots: Record<string, string> = {
    pending: 'bg-amber-400',
    reviewed: 'bg-blue-500',
    approved: 'bg-emerald-500',
    rejected: 'bg-red-500',
};

const statusLabel: Record<string, string> = {
    pending: 'Pending Review',
    reviewed: 'Reviewed',
    approved: 'Approved',
    rejected: 'Rejected',
};

function parseTimeInput(value: string): { hour: number; minute: number; ampm: string } | null {
    const upper = value.toUpperCase().trim();
    const hasPm = upper.includes('PM') || upper.endsWith('P');
    const hasAm = upper.includes('AM') || upper.endsWith('A');
    let ampm = hasPm ? 'PM' : hasAm ? 'AM' : '';
    const digits = upper.replace(/\D/g, '').slice(0, 4);
    if (digits.length < 3) return null;
    let hour = parseInt(digits.slice(0, 2), 10);
    let minute = parseInt(digits.slice(2, 4), 10);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    if (minute > 59) minute = 59;
    if (digits.length === 3) {
        hour = parseInt(digits.slice(0, 1), 10);
        minute = parseInt(digits.slice(1, 3), 10);
    }
    if (hour > 12) { hour = hour % 12 || 12; if (!ampm) ampm = 'PM'; }
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    if (!ampm) ampm = hour >= 12 ? 'PM' : 'AM';
    return { hour, minute, ampm };
}

function formatTimeValue(value: string): string {
    const parsed = parseTimeInput(value);
    if (!parsed) return value;
    const { hour, minute, ampm } = parsed;
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = String(minute).padStart(2, '0');
    return `${displayHour}:${displayMinute} ${ampm}`;
}

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

const now = new Date();
const defaultDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

interface Appointment {
    id: number;
    company_name: string;
    appointment_type: string;
    appointment_date: string;
    appointment_time: string;
    message: string;
    rejection_reason: string | null;
    status: string;
    created_at: string;
}

export default function ClientAppointments({ appointments = [] }: { appointments?: Appointment[] }) {
    const { auth, flash } = usePage().props as any;
    const user = auth?.user;

    const [createOpen, setCreateOpen] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const form = useForm({
        appointment_type: 'Physical',
        appointment_date: defaultDate,
        appointment_time: '',
        message: '',
    });

    const [datePickerOpen, setDatePickerOpen] = useState<Date | null>(parseDdMmYyyy(form.data.appointment_date));

    const validate = () => {
        form.clearErrors();
        let valid = true;
        if (!form.data.appointment_type) { form.setError('appointment_type', 'Select appointment type'); valid = false; }
        if (!form.data.appointment_date) { form.setError('appointment_date', 'Select a date'); valid = false; }
        if (!form.data.appointment_time || !/^\d{1,2}:\d{2} (AM|PM)$/i.test(form.data.appointment_time.trim())) { form.setError('appointment_time', 'Enter valid time (e.g. 2:30 PM)'); valid = false; }
        if (!form.data.message.trim()) { form.setError('message', 'Enter a message'); valid = false; }
        return valid;
    };

    const submit = () => {
        if (!validate()) return;
        form.setData('appointment_date', formatYyyyMmDd(form.data.appointment_date));
        form.post('/appointments', {
            onSuccess: () => {
                setCreateOpen(false);
                form.reset();
                setDatePickerOpen(parseDdMmYyyy(defaultDate));
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title="My Appointments" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
                    <p className="mt-1 text-sm text-slate-500">View and manage your appointments</p>
                </div>
                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" /> New Appointment
                </button>
            </div>

            {flash?.success && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {flash.success}
                </div>
            )}

            {appointments.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                    <CalendarClock className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-700">No appointments yet</h3>
                    <p className="mt-1 text-sm text-slate-500">Book your first appointment to get started.</p>
                    <button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" /> Book Appointment
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {appointments.map((a) => (
                        <div
                            key={a.id}
                            className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                        >
                            <button
                                type="button"
                                onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                                className="flex w-full items-center justify-between px-5 py-4 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`h-2.5 w-2.5 rounded-full ${statusDots[a.status] || 'bg-slate-400'}`} />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{a.appointment_type} Appointment</p>
                                        <p className="text-xs text-slate-500">{a.appointment_date} at {a.appointment_time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${statusStyles[a.status] || 'bg-slate-50 text-slate-600'}`}>
                                        {statusLabel[a.status] || a.status}
                                    </span>
                                    <ChevronIcon expanded={expandedId === a.id} />
                                </div>
                            </button>

                            {expandedId === a.id && (
                                <div className="border-t border-slate-100 px-5 py-4">
                                    <p className="text-sm text-slate-600">{a.message}</p>
                                    {a.rejection_reason && (
                                        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                                            <p className="text-xs font-medium text-red-700">Rejection reason:</p>
                                            <p className="text-sm text-red-600">{a.rejection_reason}</p>
                                        </div>
                                    )}
                                    <p className="mt-2 text-[10px] text-slate-400">Submitted {a.created_at}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {createOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
                    <div className="my-8 w-full max-w-lg rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">Book Appointment</h2>
                            <button type="button" onClick={() => { setCreateOpen(false); form.reset(); form.clearErrors(); setDatePickerOpen(parseDdMmYyyy(defaultDate)); }} className="rounded-lg p-1 hover:bg-slate-100">
                                <X className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-4 px-6 py-5">
                            <div>
                                <label className={labelClass}>Appointment Type</label>
                                <select
                                    value={form.data.appointment_type}
                                    onChange={(e) => form.setData('appointment_type', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="Physical">Physical</option>
                                    <option value="Online">Online</option>
                                </select>
                                {form.errors.appointment_type && <p className="mt-1 text-xs text-red-500">{form.errors.appointment_type}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Date</label>
                                <DatePicker
                                    selected={datePickerOpen}
                                    onChange={(d) => {
                                        setDatePickerOpen(d);
                                        form.setData('appointment_date', formatDateToDdMmYyyy(d));
                                    }}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()}
                                    placeholderText="dd/mm/yyyy"
                                    className={inputClass}
                                    wrapperClassName="w-full"
                                />
                                {form.errors.appointment_date && <p className="mt-1 text-xs text-red-500">{form.errors.appointment_date}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Time</label>
                                <div className="relative">
                                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="e.g. 2:30 PM"
                                        value={form.data.appointment_time}
                                        onChange={(e) => form.setData('appointment_time', formatTimeValue(e.target.value))}
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                                {form.errors.appointment_time && <p className="mt-1 text-xs text-red-500">{form.errors.appointment_time}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Message</label>
                                <textarea
                                    rows={4}
                                    value={form.data.message}
                                    onChange={(e) => form.setData('message', e.target.value)}
                                    className={inputClass}
                                    placeholder="Tell us about your project or reason for appointment..."
                                />
                                {form.errors.message && <p className="mt-1 text-xs text-red-500">{form.errors.message}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => { setCreateOpen(false); form.reset(); form.clearErrors(); setDatePickerOpen(parseDdMmYyyy(defaultDate)); }}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={submit}
                                disabled={form.processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {form.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
    return (
        <svg className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );
}
