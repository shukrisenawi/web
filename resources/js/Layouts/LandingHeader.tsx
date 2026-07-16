import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';

const servicesList = [
    { title: 'Web Development', href: '/services/web-development' },
    { title: 'Mobile Apps', href: '/services/mobile-apps' },
    { title: 'Web System', href: '/services/web-system' },
    { title: 'Digital Marketing', href: '/services/digital-marketing' },
    { title: 'Game Development', href: '/services/game-development' },
    { title: 'IT Equipment Supply & Setup', href: '/services/it-equipment-supply-setup' },
];

function ServicesDropdown() {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <Link
                href="/services"
                aria-haspopup="true"
                aria-expanded={open}
                className="flex items-center gap-1 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
                Services
                <ChevronDown
                    className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </Link>

            <div
                className={`absolute left-0 top-full z-50 w-64 pt-4 transition-opacity duration-200 ${
                    open ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
            >
                <div className="rounded-xl border border-white/10 bg-slate-900 p-2 shadow-xl shadow-black/40">
                    {servicesList.map((s) => (
                        <Link
                            key={s.href}
                            href={s.href}
                            className="block rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            {s.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

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
                            item.label === 'Services' ? (
                                <ServicesDropdown key={item.label} />
                            ) : (
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
                            )
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
                            item.label === 'Services' ? (
                                <div key={item.label}>
                                    <Link
                                        href={item.href}
                                        className={`block text-sm font-medium ${
                                            isActive(item.href) ? 'text-white' : 'text-white/90 hover:text-white'
                                        }`}
                                        onClick={() => setOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                    <div className="ml-3 mt-2 space-y-2 border-l border-white/10 pl-3">
                                        {servicesList.map((s) => (
                                            <Link
                                                key={s.href}
                                                href={s.href}
                                                className="block text-sm text-white/70 hover:text-white"
                                                onClick={() => setOpen(false)}
                                            >
                                                {s.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
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
                            )
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
