import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface CtaProps {
    buttonText?: string;
    buttonHref?: string;
}

export function Cta({ buttonText, buttonHref }: CtaProps) {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};

    return (
        <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-8 py-12 text-white md:px-16 md:py-16">
                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-lg">
                            <h2 className="text-3xl font-bold">
                                {c.cta_title || "Let's build something great"}{' '}
                                <span className="text-blue-500">{c.cta_title?.includes('together') ? '' : 'together.'}</span>
                            </h2>
                            <p className="mt-3 text-sm text-slate-300">
                                {c.cta_subtitle || 'Have a project in mind? Let\'s talk about how we can help you achieve your goals.'}
                            </p>
                        </div>
                        <Link
                            href={buttonHref || c.cta_link || '/contact'}
                            className="rounded-lg border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-slate-950 transition-colors inline-flex items-center gap-2"
                        >
                            {buttonText || c.cta_button || 'Get In Touch'}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
                </div>
            </div>
        </section>
    );
}
