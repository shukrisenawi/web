<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $isAdmin = $user->isAdmin();

        $projectQuery = $isAdmin ? \App\Models\Project::query() : $user->projects();
        $invoiceQuery = $isAdmin ? \App\Models\Invoice::query() : $user->invoices();
        $ticketQuery = $isAdmin ? \App\Models\Ticket::query() : $user->tickets();

        $projects = $projectQuery->orderByDesc('created_at')->get();

        $activeProjects = $projects->where('status', 'in_progress')->count();
        $completedProjects = $projects->where('status', 'completed')->count();
        $totalSpent = (clone $invoiceQuery)
            ->where('status', 'paid')
            ->sum('amount');
        $openTickets = (clone $ticketQuery)
            ->whereIn('status', ['open', 'in_progress'])
            ->count();

        $totalClients = $isAdmin ? User::where('role', User::ROLE_CLIENT)->count() : 0;

        $milestoneQuery = $isAdmin
            ? \App\Models\Project::query()->with('milestones')
            : $user->projects()->with('milestones');

        $milestones = $milestoneQuery
            ->get()
            ->pluck('milestones')
            ->flatten()
            ->sortBy('due_date')
            ->take(3)
            ->map(fn ($m) => [
                'title' => $m->project->title,
                'note' => $m->note,
                'due_date' => $m->due_date?->format('M d, Y'),
                'is_active' => $m->is_active,
            ])
            ->values();

        $fileQuery = $isAdmin
            ? \App\Models\Project::query()->with('fileUploads')
            : $user->projects()->with('fileUploads');

        $files = $fileQuery
            ->get()
            ->pluck('fileUploads')
            ->flatten()
            ->sortByDesc('created_at')
            ->take(3)
            ->map(fn ($f) => [
                'name' => $f->filename,
                'size' => $f->size,
                'date' => $f->created_at->format('M d, Y'),
            ])
            ->values();

        $invoices = (clone $invoiceQuery)
            ->with('project')
            ->orderByDesc('issue_date')
            ->limit(5)
            ->get()
            ->map(fn ($i) => [
                'id' => $i->invoice_no,
                'project' => $i->project?->title,
                'date' => $i->issue_date->format('M d, Y'),
                'amount' => '$'.number_format($i->amount, 2),
                'status' => $i->status,
            ]);

        $tickets = (clone $ticketQuery)
            ->orderByDesc('created_at')
            ->limit(4)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->ticket_no,
                'issue' => $t->subject,
                'status' => $t->status,
                'date' => $t->created_at->format('M d, Y'),
            ]);

        $activity = ActivityLog::query()
            ->when(! $isAdmin, fn ($q) => $q->where('user_id', $user->id))
            ->with('user')
            ->orderByDesc('created_at')
            ->limit(6)
            ->get()
            ->map(fn ($a) => [
                'type' => $a->type,
                'text' => $isAdmin
                    ? ($a->user?->company ?? $a->user?->name ?? 'System') . ': ' . $a->description
                    : $a->description,
                'time' => $a->created_at->diffForHumans(),
            ]);

        return Inertia::render('Dashboard', [
            'stats' => array_values(array_filter([
                ['label' => 'Active Projects', 'value' => $activeProjects, 'sub' => 'View all projects'],
                ['label' => 'Projects Completed', 'value' => $completedProjects, 'sub' => 'View completed'],
                ['label' => $isAdmin ? 'Total Billing' : 'Total Spent', 'value' => '$'.number_format($totalSpent, 2), 'sub' => 'View invoices'],
                ['label' => 'Open Tickets', 'value' => $openTickets, 'sub' => 'View tickets'],
                $isAdmin ? ['label' => 'Total Clients', 'value' => $totalClients, 'sub' => 'View database'] : null,
            ])),
            'projects' => $projects->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'category' => $p->category,
                'progress' => $p->progress,
                'status' => $p->status,
                'icon_color' => $p->icon_color,
            ]),
            'milestones' => $milestones,
            'files' => $files,
            'invoices' => $invoices,
            'tickets' => $tickets,
            'activity' => $activity,
        ]);
    }
}
