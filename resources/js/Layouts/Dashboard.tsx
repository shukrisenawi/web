import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    Headphones,
    Home,
    Users,
    Bell,
    ChevronDown,
    Menu,
    X,
    LogOut,
    ArrowRight,
    MoreVertical,
} from 'lucide-react';

const clientSidebar = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
    { label: 'Invoices', href: '/invoices', icon: FileText },
    { label: 'Support', href: '/support', icon: Headphones, badge: 'unreadMessagesCount' },
    { label: 'Profile', href: '/profile', icon: Users },
];

const adminSidebar = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
    { label: 'Billing', href: '/invoices', icon: FileText },
    { label: 'Support', href: '/support', icon: Headphones, badge: 'unreadMessagesCount' },
    { label: 'Website Content', href: '/manage-frontpage', icon: Home },
    { label: 'Blog', href: '/manage-blog', icon: FileText },
    { label: 'Profile', href: '/profile', icon: Users },
];

interface NotificationItem {
    id: string;
    subject: string;
    description: string | null;
    name: string | null;
    email: string | null;
    date: string;
    url: string;
}

export function DashboardLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    const { auth, url, unreadMessagesCount } = usePage().props as any;
    const user = auth?.user ?? { name: 'John Doe', email: 'john.doe@email.com', company: 'Acme Corporation', isAdmin: false };
    const sidebar = user?.isAdmin ? adminSidebar : clientSidebar;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifCount, setNotifCount] = useState(unreadMessagesCount ?? 0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const notifRef = useRef<HTMLDivElement>(null);

    const currentPath = typeof url === 'string' ? new URL(url, window.location.origin).pathname : window.location.pathname;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setNotifCount(unreadMessagesCount ?? 0);
    }, [unreadMessagesCount]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/notifications', {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const data = await res.json();
            setNotifCount(data.count);
            setNotifications(data.items);
        } catch {
            setNotifications([]);
        }
    };

    const toggleNotifications = async () => {
        const next = !notifOpen;
        setNotifOpen(next);
        if (next) {
            await fetchNotifications();
        }
    };

    const markAsRead = async () => {
        try {
            await fetch('/notifications/mark-as-read', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
            });
            setNotifCount(0);
            setNotifications((prev) => prev.map((n) => ({ ...n })));
            router.reload({ only: ['unreadMessagesCount'] });
        } catch {
            // ignore
        }
    };

    const avatarUrl = user?.avatar ?? null;
    const renderAvatar = (sizeClass: string, textClass: string) =>
        avatarUrl ? (
            <img src={avatarUrl} alt={user.name} className={`${sizeClass} rounded-full object-cover`} />
        ) : (
            <div className={`${sizeClass} flex items-center justify-center rounded-full bg-blue-600`}>
                <span className={`font-mono font-black text-white ${textClass}`}>{'</>'}</span>
            </div>
        );

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/** Mobile sidebar overlay */}
            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar overlay"
                />
            )}

            {/** Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 shrink-0 items-center gap-2 px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-mono text-2xl font-black text-blue-600">{'</>'}</span>
                        <span className="font-bold tracking-[0.3em]">
                            <span className="text-white">KENJU</span>
                            <span className="text-blue-600">TECH</span>
                        </span>
                    </Link>
                    <button
                        type="button"
                        className="ml-auto lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="mt-4 flex-1 overflow-y-auto px-4 space-y-1">
                    {sidebar.map((item) => {
                        const active = item.href !== '#' && currentPath.startsWith(item.href);
                        const badgeCount = item.badge === 'unreadMessagesCount' ? (unreadMessagesCount ?? 0) : 0;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                    active
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="flex-1">{item.label}</span>
                                {badgeCount > 0 && (
                                    <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                                        {badgeCount > 99 ? '99+' : badgeCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="shrink-0 p-4">
                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-900 p-3">
                        {renderAvatar('h-10 w-10', 'text-lg')}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{user.name}</p>
                            <p className="truncate text-xs text-slate-400">{user.email}</p>
                        </div>
                        <Link href="/profile" className="text-slate-400 hover:text-white">
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/** Main */}
            <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
                {/** Top header */}
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="lg:hidden p-2"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open sidebar"
                        >
                            <Menu className="h-6 w-6 text-slate-600" />
                        </button>
                        <h1 className="text-lg font-semibold text-slate-900">{title ?? 'Dashboard'}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative" ref={notifRef}>
                            <button
                                type="button"
                                onClick={toggleNotifications}
                                className="relative rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                            >
                                <Bell className="h-5 w-5 text-slate-600" />
                                {notifCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                        {notifCount > 99 ? '99+' : notifCount}
                                    </span>
                                )}
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg sm:w-96">
                                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                        <p className="text-sm font-semibold text-slate-900">Notifications</p>
                                        {notifications.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={markAsRead}
                                                className="text-xs font-medium text-blue-600 hover:underline"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto py-1">
                                        {notifications.length === 0 ? (
                                            <p className="px-4 py-6 text-center text-sm text-slate-500">No new notifications.</p>
                                        ) : (
                                            notifications.map((n) => (
                                                <Link
                                                    key={n.id}
                                                    href={n.url}
                                                    onClick={() => setNotifOpen(false)}
                                                    className="block border-b border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50"
                                                >
                                                    <p className="text-sm font-semibold text-slate-900">New message: {n.subject}</p>
                                                    <p className="text-xs text-slate-500">{n.name} · {n.email}</p>
                                                    {n.description && (
                                                        <p className="mt-1 line-clamp-2 text-xs text-slate-600">{n.description}</p>
                                                    )}
                                                    <p className="mt-1 text-[10px] text-slate-400">{n.date}</p>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                            {renderAvatar('h-full w-full', 'text-sm')}
                        </div>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="hidden rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 sm:block"
                            title="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'green' | 'amber' | 'red' | 'slate' }) {
    const styles: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-emerald-50 text-emerald-700',
        amber: 'bg-amber-50 text-amber-700',
        red: 'bg-red-50 text-red-700',
        slate: 'bg-slate-100 text-slate-700',
    };

    return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[color]}`}>{children}</span>;
}

export function Progress({ value }: { value: number }) {
    return (
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
        </div>
    );
}

export function ActionMenu() {
    return (
        <button type="button" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <MoreVertical className="h-5 w-5" />
        </button>
    );
}
