import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { HeroBackground } from '@/Components/HeroBackground';

export function Hero() {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};

    return (
        <section className="relative overflow-hidden bg-[#050914] text-white">
            <HeroBackground />

            <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
                <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
                    <div className="max-w-xl">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
                            {c.hero_badge || 'Digital solutions that drive growth'}
                        </p>
                        <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                            {c.hero_title || "We build digital products that move your business forward."}
                        </h1>
                        <p className="mt-6 text-base leading-relaxed text-slate-300 sm:text-lg">
                            {c.hero_subtitle || 'Kenju Tech helps businesses grow with modern websites, powerful applications and digital strategies that deliver results.'}
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                href={c.hero_primary_link || '/services'}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                            >
                                {c.hero_primary_cta || 'Explore Services'}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="mt-10 flex items-center gap-3">
                            <div className="flex -space-x-3">
                                {[11, 12, 13].map((i) => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/150?img=${i}`}
                                        alt="Client"
                                        className="h-10 w-10 rounded-full border-2 border-[#050914] object-cover"
                                    />
                                ))}
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold">{c.hero_trusted_text || 'Trusted by 100+ clients'}</p>
                                <p className="text-slate-400">{c.hero_trusted_subtext || 'from startups to enterprise'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <img
                            src={c.hero_image || '/images/hero.png'}
                            alt="Digital solutions showcase"
                            className="relative z-10 w-full max-w-none rounded-xl"
                        />
                        <div className="absolute -right-16 -top-10 h-56 w-56 rounded-full bg-blue-600/15 blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-600/15 blur-3xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
