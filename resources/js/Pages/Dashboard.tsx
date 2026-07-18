import { Head, Link, usePage } from '@inertiajs/react';
import {
    Bell,
    FolderKanban,
    CheckSquare,
    Wallet,
    Ticket,
    Calendar,
    FileText,
    Clock,
    ArrowRight,
    MessageSquare,
    CheckCircle2,
    Upload,
    Users,
} from 'lucide-react';
import { DashboardLayout, Card, Badge, Progress, ActionMenu } from '@/Layouts/Dashboard';

const iconMap: Record<string, React.ElementType> = {
    milestone: Clock,
    invoice: CheckCircle2,
    file: Upload,
    ticket: Bell,
    project: CheckSquare,
    default: MessageSquare,
};

interface DashboardProps {
    stats: { label: string; value: number | string; sub: string }[];
    projects: { id: number; title: string; category: string; progress: number; status: string; icon_color: string }[];
    milestones: { title: string; note: string; due_date: string; is_active: boolean }[];
    files: { name: string; size: string; date: string }[];
    invoices: { id: string; project: string; date: string; amount: string; status: string }[];
    tickets: { id: string; issue: string; status: string; date: string }[];
    activity: { type: string; text: string; time: string }[];
}

const statConfig: Record<string, { icon: React.ElementType; color: string }> = {
    'Active Projects': { icon: FolderKanban, color: 'bg-blue-50 text-blue-600' },
    'Projects Completed': { icon: CheckSquare, color: 'bg-purple-50 text-purple-600' },
    'Total Spent': { icon: Wallet, color: 'bg-emerald-50 text-emerald-600' },
    'Total Billing': { icon: Wallet, color: 'bg-emerald-50 text-emerald-600' },
    'Open Tickets': { icon: Ticket, color: 'bg-amber-50 text-amber-600' },
    'Total Clients': { icon: Users, color: 'bg-pink-50 text-pink-600' },
};

const statusBadgeColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'green';
        case 'on_hold':
            return 'amber';
        default:
            return 'blue';
    }
};

const invoiceBadgeColor = (status: string) => {
    switch (status) {
        case 'paid':
            return 'green';
        case 'overdue':
            return 'red';
        default:
            return 'amber';
    }
};

const ticketBadgeColor = (status: string) => {
    switch (status) {
        case 'resolved':
            return 'green';
        case 'in_progress':
            return 'blue';
        default:
            return 'red';
    }
};

export default function Dashboard({
    stats,
    projects,
    milestones,
    files,
    invoices,
    tickets,
    activity,
}: DashboardProps) {
    const { auth } = usePage().props as any;
    const userName = auth?.user?.name ?? 'John';
    return (
        <>
            <Head title="Dashboard" />

            <DashboardLayout title="Dashboard">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Welcome back, {userName}! <span className="inline-block">👋</span></h2>
                    <p className="text-sm text-slate-500">Here's what's happening with your projects today.</p>
                </div>

                {/** Stats */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {stats.map((stat) => {
                        const config = statConfig[stat.label];
                        if (!config) return null;
                        const Icon = config.icon;
                        const href = stat.label === 'Total Clients' ? '/clients' : '/projects';
                        return (
                            <Card key={stat.label} className="flex flex-col">
                                <div className="flex items-start justify-between">
                                    <div className={`rounded-xl p-3 ${config.color}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-slate-500">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                <Link href={href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                                    {stat.sub}
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </Card>
                        );
                    })}
                </div>

                {/** Projects + Milestones/Files */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
                    {/** Projects list */}
                    <Card className="lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">Your Projects</h3>
                            <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                                View All Projects
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="space-y-5">
                            {projects.map((project) => (
                                <div key={project.id} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-3 sm:w-56">
                                        <div
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                                            style={{ backgroundColor: project.icon_color }}
                                        >
                                            {project.title.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-900">{project.title}</p>
                                            <p className="truncate text-xs text-slate-500">{project.category}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 items-center gap-4">
                                        <div className="min-w-[48px] text-right text-sm font-semibold text-slate-700">
                                            {project.progress}%
                                        </div>
                                        <div className="flex-1">
                                            <Progress value={project.progress} />
                                        </div>
                                        <Badge color={statusBadgeColor(project.status)}>
                                            {project.status.replace('_', ' ')}
                                        </Badge>
                                        <ActionMenu />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link href="/projects" className="mt-6 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-slate-50">
                            View All Projects
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Card>

                    {/** Right column */}
                    <div className="space-y-6">
                        {/** Milestones */}
                        <Card>
                            <div className="mb-4 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-slate-700" />
                                <h3 className="font-semibold text-slate-900">Upcoming Milestones</h3>
                            </div>
                            <div className="relative space-y-6 pl-4">
                                <div className="absolute left-[21px] top-2 bottom-2 w-px bg-slate-200"></div>
                                {milestones.map((m) => (
                                    <div key={m.note + m.due_date} className="relative flex items-start gap-4">
                                        <div
                                            className={`relative z-10 mt-1 h-3 w-3 rounded-full border-2 ${
                                                m.is_active ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                                            }`}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold text-slate-900">{m.title}</p>
                                            <p className="text-xs text-slate-500">{m.note}</p>
                                        </div>
                                        <p className="shrink-0 text-xs text-slate-500">{m.due_date}</p>
                                    </div>
                                ))}
                            </div>
                            <Link href="/projects" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                                View All Milestones
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Card>

                        {/** Recent Files */}
                        <Card>
                            <h3 className="font-semibold text-slate-900">Recent Files</h3>
                            <div className="mt-4 space-y-3">
                                {files.map((file) => (
                                    <div key={file.name} className="flex items-center gap-3">
                                        <div className="rounded-lg bg-red-50 p-2">
                                            <FileText className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                                            <p className="truncate text-xs text-slate-500">{file.size} · {file.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href="/projects" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                                View All Files
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Card>
                    </div>
                </div>

                {/** Invoices & Tickets */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900">Recent Invoices</h3>
                            <Link href="/invoices" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                                View All Invoices
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {invoices.map((inv) => (
                                <div key={inv.id} className="flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-blue-600">{inv.id}</p>
                                        <p className="truncate text-xs text-slate-500">{inv.project}</p>
                                    </div>
                                    <div className="hidden shrink-0 text-xs text-slate-500 sm:block">{inv.date}</div>
                                    <div className="hidden shrink-0 text-sm font-semibold text-slate-900 sm:block">{inv.amount}</div>
                                    <Badge color={invoiceBadgeColor(inv.status)}>{inv.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900">Support Tickets</h3>
                            <Link href="/support" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                                View All Tickets
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-blue-600">{ticket.id}</p>
                                        <p className="truncate text-xs text-slate-500">{ticket.issue}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-3">
                                        <Badge color={ticketBadgeColor(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
                                        <p className="hidden text-xs text-slate-500 sm:block">{ticket.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/** Recent Activity */}
                <Card className="mt-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Recent Activity</h3>
                        <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                            View All Activity
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {activity.map((item) => {
                            const Icon = iconMap[item.type] ?? iconMap.default;
                            return (
                                <div key={item.text} className="flex items-start gap-3">
                                    <div className="rounded-full bg-slate-100 p-2">
                                        <Icon className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-slate-700">{item.text}</p>
                                        <p className="text-xs text-slate-400">{item.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </DashboardLayout>
        </>
    );
}
