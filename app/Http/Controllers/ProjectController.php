<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $status = $request->query('status');
        $search = $request->query('search');

        $query = $user->isAdmin()
            ? Project::query()->with('user')
            : $user->projects();

        $projects = $query
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($search, fn ($q) => $q->where('title', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'user_id' => $p->user_id,
                'client' => $p->user?->company ?? $p->user?->name,
                'title' => $p->title,
                'category' => $p->category,
                'service_type' => $p->service_type,
                'description' => $p->description,
                'progress' => $p->progress,
                'status' => $p->status,
                'payment_status' => $p->payment_status,
                'icon_color' => $p->icon_color,
                'created_at' => $p->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Projects', [
            'projects' => $projects,
            'filters' => ['status' => $status, 'search' => $search],
        ]);
    }

    public function show(Project $project)
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin() && $project->user_id !== $user->id) {
            abort(403);
        }

        $project->load(['milestones' => fn ($q) => $q->orderBy('due_date'), 'user', 'invoices']);

        return Inertia::render('ProjectShow', [
            'project' => [
                'id' => $project->id,
                'client' => $project->user?->company ?? $project->user?->name,
                'title' => $project->title,
                'category' => $project->category,
                'service_type' => $project->service_type,
                'description' => $project->description,
                'progress' => $project->progress,
                'status' => $project->status,
                'payment_status' => $project->payment_status,
                'icon_color' => $project->icon_color,
                'created_at' => $project->created_at->format('M d, Y'),
                'milestones' => $project->milestones->map(fn ($m) => [
                    'id' => $m->id,
                    'title' => $m->title,
                    'note' => $m->note,
                    'due_date' => $m->due_date?->format('M d, Y'),
                    'is_active' => $m->is_active,
                ]),
            ],
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'service_type' => ['required', Rule::in(['web_system', 'website', 'mobile_app', 'digital_marketing', 'it_solutions', 'game_development'])],
            'description' => ['nullable', 'string', 'max:5000'],
            'request_quotation' => ['boolean'],
        ]);

        $serviceLabels = [
            'web_system' => 'Web System',
            'website' => 'Website Development',
            'mobile_app' => 'Mobile App Development',
            'digital_marketing' => 'Digital Marketing',
            'it_solutions' => 'IT Solutions',
            'game_development' => 'Game Development',
        ];

        $project = $user->projects()->create([
            'title' => $validated['title'],
            'category' => $serviceLabels[$validated['service_type']],
            'service_type' => $validated['service_type'],
            'description' => $validated['description'],
            'progress' => 0,
            'status' => 'in_progress',
            'payment_status' => 'unpaid',
            'icon_color' => '#2563eb',
        ]);

        return redirect()->route('projects')->with('success', 'Project created successfully. Our team will review your request.');
    }

    public function update(Request $request, Project $project)
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'progress' => ['required', 'integer', 'min:0', 'max:100'],
            'status' => ['required', Rule::in(['in_progress', 'completed', 'on_hold'])],
            'payment_status' => ['required', Rule::in(['unpaid', 'partial', 'paid'])],
        ]);

        $project->update($validated);

        return redirect()->route('projects')->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $project->delete();

        return redirect()->route('projects')->with('success', 'Project deleted successfully.');
    }
}
