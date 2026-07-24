import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { HeroBackground } from '@/Components/HeroBackground';
import Modal from '@/Components/Modal';
import { useState } from 'react';

interface ContactProps {
    contact_title?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_office?: string;
}

export default function Contact({ contact_title, contact_email, contact_phone, contact_office }: ContactProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccess(true);
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Contact" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                <div className="relative overflow-hidden bg-[#050914] py-16 text-white sm:py-20">
                    <HeroBackground />
                    <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">Get In Touch</p>
                        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Contact Us</h1>
                        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
                            Have a project in mind? Reach out and let's discuss how we can help.
                        </p>
                    </div>
                </div>

                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
                            {/* Contact info */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900">{contact_title || "Let's start a conversation"}</h2>
                                    <p className="mt-4 text-slate-600">
                                        Fill out the form and our team will respond within 24 hours. You can also reach
                                        us directly through the channels below.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-blue-50 p-3">
                                            <Mail className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Email</p>
                                            <p className="text-sm text-slate-600">{contact_email || 'hello@kenjutech.com'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-blue-50 p-3">
                                            <Phone className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Phone</p>
                                            <p className="text-sm text-slate-600">{contact_phone || '+60 12-345 6789'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-blue-50 p-3">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Office</p>
                                            <p className="whitespace-pre-line text-sm text-slate-600">{contact_office || 'Kuala Lumpur, Malaysia'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact form */}
                            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="Your name"
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="you@example.com"
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Subject</label>
                                    <input
                                        id="subject"
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                        placeholder="How can we help?"
                                    />
                                    {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
                                </div>

                                <div className="mt-5">
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                                    <textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        rows={5}
                                        className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                        placeholder="Tell us about your project..."
                                    />
                                    {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
                                >
                                    Send Message
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                <LandingFooter mode="dark" />
            </div>

            <Modal open={showSuccess} onClose={() => setShowSuccess(false)}>
                <div className="flex flex-col items-center gap-4 px-10 py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-slate-900">Thank you for your message!</p>
                    <p className="text-center text-sm text-slate-600">We will get back to you soon.</p>
                    <button
                        type="button"
                        onClick={() => setShowSuccess(false)}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        OK
                    </button>
                </div>
            </Modal>
        </>
    );
}
