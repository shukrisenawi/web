import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
    return (
        <Link href="/" className={`flex items-center gap-2 font-bold text-xl tracking-wider ${className}`}>
            <div className="flex items-center text-blue-600">
                <span className="font-mono text-2xl font-black">{'</>'}</span>
            </div>
            <span className="tracking-[0.2em]">
                <span className="text-white">K E N J U</span>
                <span className="text-blue-600">T E C H</span>
            </span>
        </Link>
    );
}

const nav = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

export function LandingHeader() {
    const { auth, url } = usePage().props as any;
    const [open, setOpen] = useState(false);

    const currentPath = typeof url === 'string' ? new URL(url, window.location.origin).pathname : window.location.pathname;
    const dashboardHref = '/dashboard';
    const ctaHref = auth?.user ? dashboardHref : '/login';
    const ctaText = auth?.user ? 'Dashboard' : "Let's Talk";

    const isActive = (href: string) => {
        if (href === '/') {
            return currentPath === '/';
        }
        return currentPath.startsWith(href);
    };

    return (
        <header className="bg-slate-950 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <Logo className="text-white" />

                    <nav className="hidden md:flex items-center gap-8">
                        {nav.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${
                                    isActive(item.href)
                                        ? 'text-white'
                                        : 'text-white/70 hover:text-white'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href={ctaHref}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                        >
                            {ctaText}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <button
                        type="button"
                        className="md:hidden p-2"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {open && (
                    <nav className="md:hidden border-t border-white/10 py-4 space-y-3">
                        {nav.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`block text-sm font-medium ${
                                    isActive(item.href)
                                        ? 'text-white'
                                        : 'text-white/90 hover:text-white'
                                }`}
                                onClick={() => setOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href={ctaHref}
                            className="block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white text-center"
                        >
                            {ctaText}
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
