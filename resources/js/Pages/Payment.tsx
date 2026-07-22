import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, QrCode, Upload, CheckCircle, FileText, Info } from 'lucide-react';
import { useState } from 'react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';

interface InvoiceItem {
    description: string;
    amount: string;
}

interface PaymentProof {
    id: number;
    payment_method: string;
    name: string;
    status: string;
    created_at: string;
}

interface Invoice {
    id: string;
    invoice_id: number;
    amount: string;
    amount_raw: number;
    status: string;
    issue_date: string;
    items: InvoiceItem[];
    proofs: PaymentProof[];
}

const BANK = {
    name: 'MAYBANK BERHAD',
    accountName: 'KENJU TECH SDN. BHD.',
    accountNumber: '5622 4512 3456',
};

export default function Payment({ invoice }: { invoice: Invoice }) {
    const { success } = usePage().props as any;
    const [submitted, setSubmitted] = useState(false);

    const form = useForm({
        invoice_no: invoice.id,
        payment_method: 'bank_transfer',
        name: '',
        email: '',
        proof: null as File | null,
    });

    const submit = () => {
        form.post('/payment/proof', {
            forceFormData: true,
            onSuccess: () => {
                setSubmitted(true);
                form.reset();
            },
            onError: (err) => {
                console.error('Payment form errors:', err);
            },
        });
    };

    const isPaid = invoice.status === 'paid';
    const hasPending = invoice.proofs.some((p) => p.status === 'pending');

    return (
        <>
            <Head title={`Payment - ${invoice.id}`} />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute right-10 top-10 h-64 w-64 rounded-full bg-blue-500 blur-3xl" />
                        <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-blue-400 blur-3xl" />
                    </div>
                    <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
                        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Secure & Easy Payment</p>
                        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
                            Complete Your Payment<br />
                            <span className="text-blue-400">Securely</span> & Easily
                        </h1>
                        <p className="mt-4 max-w-lg text-sm text-slate-300 sm:text-base">
                            Choose your preferred payment method and follow the steps below.
                            <br />
                            We appreciate your business!
                        </p>
                    </div>
                </section>

                {/* Invoice Summary */}
                <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Invoice Number</p>
                                <p className="font-mono text-lg font-bold text-slate-900">{invoice.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500">Amount Due</p>
                                <p className="text-2xl font-bold text-blue-600">RM {invoice.amount}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                            <span>Date: {invoice.issue_date}</span>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                                {isPaid ? 'Paid' : hasPending ? 'Pending Verification' : 'Awaiting Payment'}
                            </span>
                        </div>
                        {invoice.items.length > 0 && (
                            <div className="mt-4 border-t border-slate-100 pt-4">
                                <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Items</p>
                                {invoice.items.map((it, i) => (
                                    <div key={i} className="flex items-center justify-between py-1 text-sm">
                                        <span className="text-slate-700">{it.description}</span>
                                        <span className="font-semibold text-slate-900">RM {it.amount}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Success state - on top so visible immediately */}
                {submitted && (
                    <section className="mx-auto max-w-2xl px-4 pb-10 sm:px-6">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                            <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Proof Submitted Successfully!</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Our team will verify your payment and send you a confirmation email shortly.
                            </p>
                            <a
                                href="/dashboard"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Back to Dashboard <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </section>
                )}

                {/* Payment Methods */}
                {!isPaid && (
                    <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6">
                        <h2 className="text-center text-2xl font-bold text-slate-900">
                            Choose Your <span className="text-blue-600">Payment Method</span>
                        </h2>
                        <p className="mt-2 text-center text-sm text-slate-500">
                            Select the payment option that's most convenient for you.
                        </p>

                        <div className="mt-8 grid gap-6 sm:grid-cols-2">
                            {/* Bank Transfer */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                                        <Building2 className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Bank Transfer</h3>
                                        <p className="text-xs text-slate-500">Transfer directly to our company bank account.</p>
                                    </div>
                                </div>
                                <p className="mb-3 text-xs font-semibold text-blue-600">Bank Details</p>
                                <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Bank Name</span>
                                        <span className="font-semibold text-slate-900">{BANK.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Account Name</span>
                                        <span className="font-semibold text-slate-900">{BANK.accountName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Account Number</span>
                                        <span className="font-mono font-semibold text-slate-900">{BANK.accountNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Reference</span>
                                        <span className="font-mono font-semibold text-blue-600">{invoice.id}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3">
                                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                    <p className="text-xs text-blue-800">
                                        Please use your invoice number as the payment reference.
                                    </p>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                                        <QrCode className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">QR Code Payment</h3>
                                        <p className="text-xs text-slate-500">Scan the QR code to pay instantly.</p>
                                    </div>
                                </div>
                                <p className="mb-3 text-xs font-semibold text-blue-600">Scan & Pay</p>
                                <div className="flex items-center justify-center rounded-xl bg-slate-50 p-6">
                                    <img
                                        src="/images/qr.png"
                                        alt="QR Code Payment"
                                        className="h-40 w-40 rounded-xl object-contain"
                                    />
                                </div>
                                <p className="mt-3 text-center text-xs text-slate-400">Accepted via:</p>
                                <div className="mt-2 flex items-center justify-center gap-3">
                                    {[
                                        { src: '/images/mae-logo.png', alt: 'MAE' },
                                        { src: '/images/boost-logo.png', alt: 'Boost' },
                                        { src: '/images/tng-logo.png', alt: "Touch 'n Go" },
                                        { src: '/images/duitnow-logo.png', alt: 'DuitNow QR' },
                                    ].map((logo) => (
                                        <img
                                            key={logo.alt}
                                            src={logo.src}
                                            alt={logo.alt}
                                            className="h-8 w-auto rounded-lg bg-slate-100 px-2 py-1.5 object-contain"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* How to Steps */}
                {!isPaid && (
                    <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6">
                        <h2 className="text-center text-2xl font-bold text-slate-900">
                            How to Send Your <span className="text-blue-600">Proof of Payment</span>
                        </h2>
                        <p className="mt-2 text-center text-sm text-slate-500">
                            Follow these simple steps to complete your payment verification.
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {[
                                { step: 1, icon: FileText, title: 'Make Payment', desc: 'Complete your payment via Bank Transfer or QR Code.' },
                                { step: 2, icon: Upload, title: 'Upload Proof', desc: 'Go to the form below and upload your proof of payment.' },
                                { step: 3, icon: CheckCircle, title: 'Fill in Details', desc: 'Enter your invoice number, name, email, and other required details.' },
                                { step: 4, icon: ArrowRight, title: 'Submit', desc: "Click submit and we'll verify your payment as soon as possible." },
                            ].map((s) => (
                                <div key={s.step} className="text-center">
                                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                        {s.step}
                                    </div>
                                    <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                                        <s.icon className="h-7 w-7 text-blue-600" />
                                    </div>
                                    <p className="mt-3 font-semibold text-slate-900">{s.title}</p>
                                    <p className="mt-1 text-xs text-slate-500">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Upload Proof Form */}
                {!isPaid && !submitted && (
                    <section className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                                    <Upload className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="mt-3 text-lg font-bold text-slate-900">Upload Proof of Payment</h3>
                                <p className="text-sm text-slate-500">
                                    Please upload your proof of payment and fill in the details below.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {form.hasErrors && (
                                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                        Please fix the errors below and try again.
                                    </div>
                                )}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Invoice Number *</label>
                                        <input
                                            value={form.data.invoice_no}
                                            readOnly
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Payment Method *</label>
                                        <select
                                            value={form.data.payment_method}
                                            onChange={(e) => form.setData('payment_method', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value="">Select payment method</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="qr_code">QR Code</option>
                                        </select>
                                        {form.errors.payment_method && (
                                            <p className="mt-1 text-xs text-red-500">{form.errors.payment_method}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Your Name *</label>
                                        <input
                                            value={form.data.name}
                                            onChange={(e) => form.setData('name', e.target.value)}
                                            placeholder="Full Name"
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        {form.errors.name && (
                                            <p className="mt-1 text-xs text-red-500">{form.errors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Email Address *</label>
                                        <input
                                            type="email"
                                            value={form.data.email}
                                            onChange={(e) => form.setData('email', e.target.value)}
                                            placeholder="youremail@example.com"
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        {form.errors.email && (
                                            <p className="mt-1 text-xs text-red-500">{form.errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Upload Proof *</label>
                                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-colors hover:border-blue-400 hover:bg-blue-50">
                                        <Upload className="h-8 w-8 text-slate-400" />
                                        <p className="mt-2 text-sm text-slate-600">
                                            {form.data.proof ? form.data.proof.name : 'Click to upload or drag and drop'}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">PNG, JPG or PDF (Max. 6MB)</p>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            className="hidden"
                                            onChange={(e) => form.setData('proof', e.target.files?.[0] ?? null)}
                                        />
                                    </label>
                                    {form.errors.proof && (
                                        <p className="mt-1 text-xs text-red-500">{form.errors.proof}</p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={submit}
                                    disabled={form.processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    Submit Payment Proof <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Already paid */}
                {isPaid && (
                    <section className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                            <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Payment Confirmed</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                This invoice has been paid. Thank you for your business!
                            </p>
                            <a
                                href="/dashboard"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Back to Dashboard <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </section>
                )}

                {/* Pending verification */}
                {!isPaid && hasPending && !submitted && (
                    <section className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
                            <Info className="mx-auto h-12 w-12 text-amber-600" />
                            <h3 className="mt-4 text-lg font-bold text-slate-900">Payment Under Review</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Your proof of payment has been submitted and is being reviewed by our team.
                            </p>
                            <a
                                href="/dashboard"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Back to Dashboard <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </section>
                )}

                <LandingFooter mode="dark" />
            </div>
        </>
    );
}
