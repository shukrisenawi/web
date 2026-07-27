import { Head, Link } from '@inertiajs/react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { HeroBackground } from '@/Components/HeroBackground';
import { ChevronLeft } from 'lucide-react';
import SafeHtml from '@/Components/SafeHtml';

interface LegalPageProps {
    type: 'privacy' | 'terms';
    title: string;
    content: string;
    lastUpdated?: string | null;
}

export default function LegalPage({ type, title, content, lastUpdated }: LegalPageProps) {
    const isPrivacy = type === 'privacy';
    const fallbackTitle = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';
    const displayTitle = title || fallbackTitle;
    const backgroundLabel = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';

    return (
        <>
            <Head title={displayTitle} />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                {/* Hero */}
                <section className="relative overflow-hidden bg-[#050914] pt-16 pb-20 text-white sm:pt-20 sm:pb-24">
                    <HeroBackground />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">{backgroundLabel}</p>
                            <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                                {displayTitle}
                            </h1>
                            {lastUpdated && (
                                <p className="mt-4 text-sm text-slate-400">Last updated: {lastUpdated}</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="bg-white py-16 sm:py-20">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/"
                            className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Home
                        </Link>

                        <SafeHtml
                            html={content || '<p>Content is being prepared.</p>'}
                            className="prose prose-slate max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h2:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-li:text-slate-600"
                        />
                    </div>
                </section>

                <LandingFooter mode="dark" />
            </div>
        </>
    );
}
