<?php

namespace App\Http\Controllers;

use App\Models\FileUpload;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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
            ? Project::query()->with('user.projectRequests.files', 'fileUploads', 'invoices')
            : $user->projects()->with('user.projectRequests.files', 'fileUploads', 'invoices');

        $projects = $query
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($search, fn ($q) => $q->where('title', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                $requestFiles = $p->user?->projectRequests
                    ->sortByDesc('created_at')
                    ->first()?->files
                    ->map(fn ($f) => [
                        'id' => 'req_'.$f->id,
                        'filename' => $f->filename,
                        'size' => $f->size,
                        'url' => Storage::url($f->path),
                    ]) ?? [];

                $uploadedFiles = $p->fileUploads->map(fn ($f) => [
                    'id' => 'up_'.$f->id,
                    'filename' => $f->filename,
                    'size' => $f->size,
                    'url' => Storage::url($f->path),
                ]);

                $totalPaid = $p->invoices->where('status', 'paid')->sum('amount');

                return [
                    'id' => $p->id,
                    'user_id' => $p->user_id,
                    'client' => $p->user?->company ?? $p->user?->name,
                    'title' => $p->title,
                    'category' => $p->category,
                    'service_type' => $p->service_type,
                    'system_type' => $p->system_type,
                    'features' => $p->features,
                    'user_roles' => $p->user_roles,
                    'integrations' => $p->integrations,
                    'budget' => $p->budget,
                    'deadline' => $p->deadline?->format('Y-m-d'),
                    'hosting_domain' => $p->hosting_domain,
                    'additional_notes' => $p->additional_notes,
                    'description' => $p->description,
                    'key_person' => $p->key_person,
                    'status_remark' => $p->status_remark,
                    'progress' => $p->progress,
                    'status' => $p->status,
                    'payment_status' => $p->payment_status,
                    'total_paid' => number_format($totalPaid, 2),
                    'icon_color' => $p->icon_color,
                    'created_at' => $p->created_at->format('M d, Y'),
                    'files' => collect($requestFiles)->concat($uploadedFiles)->values(),
                    'has_invoice' => $p->invoices->isNotEmpty(),
                ];
            });

        $props = [
            'projects' => $projects,
            'filters' => ['status' => $status, 'search' => $search],
        ];

        if ($user->isAdmin()) {
            $props['clients'] = User::where('role', User::ROLE_CLIENT)
                ->get(['id', 'company', 'name'])
                ->map(fn ($u) => ['id' => $u->id, 'label' => $u->company ?? $u->name]);
            $props['preselect_user_id'] = $request->query('user_id');
        }

        return Inertia::render('Projects', $props);
    }

    public function create(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('ProjectCreate', [
            'clients' => $user->isAdmin()
                ? User::where('role', 'client')->select('id', 'name', 'email', 'company')->get()
                : null,
            'services' => Project::getServices(),
            'systemTypes' => Project::getSystemTypes(),
            'preselect_user_id' => $request->query('user_id'),
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

        $totalPaid = $project->invoices->where('status', 'paid')->sum('amount');

        return Inertia::render('ProjectShow', [
            'project' => [
                'id' => $project->id,
                'client' => $project->user?->company ?? $project->user?->name,
                'title' => $project->title,
                'category' => $project->category,
                'service_type' => $project->service_type,
                'system_type' => $project->system_type,
                'features' => $project->features,
                'user_roles' => $project->user_roles,
                'integrations' => $project->integrations,
                'budget' => $project->budget,
                'deadline' => $project->deadline?->format('Y-m-d'),
                'hosting_domain' => $project->hosting_domain,
                'additional_notes' => $project->additional_notes,
                'description' => $project->description,
                'key_person' => $project->key_person,
                'status_remark' => $project->status_remark,
                'progress' => $project->progress,
                'status' => $project->status,
                'payment_status' => $project->payment_status,
                'total_paid' => number_format($totalPaid, 2),
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

    public function edit(Project $project)
    {
        $user = Auth::user();
        if (!$user->isAdmin() && $project->user_id !== $user->id) {
            abort(403);
        }

        $project->load('user:id,name,email,company', 'fileUploads');
        $project->fileUploads->transform(fn ($f) => [
            'id' => $f->id,
            'filename' => $f->filename,
            'size' => $f->size,
            'url' => Storage::url($f->path),
        ]);

        return Inertia::render('ProjectEdit', [
            'project' => $project,
            'services' => Project::getServices(),
            'systemTypes' => Project::getSystemTypes(),
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'service_type' => ['required', Rule::in(['web_system', 'website', 'mobile_app', 'digital_marketing', 'it_solutions', 'game_development'])],
            'system_type' => ['nullable', 'string', 'max:255'],
            'system_type_other' => ['nullable', 'string', 'max:255'],
            'features' => ['nullable', 'string', 'max:5000'],
            'user_roles' => ['nullable', 'string', 'max:5000'],
            'integrations' => ['nullable', 'string', 'max:5000'],
            'budget' => ['nullable', 'string', 'max:255'],
            'deadline' => ['nullable', 'date'],
            'hosting_domain' => ['nullable', 'string', 'max:2000'],
            'additional_notes' => ['nullable', 'string', 'max:5000'],
            'description' => ['nullable', 'string', 'max:5000'],
            'request_quotation' => ['boolean'],
        ];

        // #4 - Admin creates a project linked to a specific client.
        if ($user->isAdmin()) {
            $rules['user_id'] = ['required', Rule::exists('users', 'id')];
            $rules['key_person'] = ['nullable', 'string', 'max:255'];
            $rules['status_remark'] = ['nullable', 'string', 'max:5000'];
        }

        $rules['files'] = ['nullable', 'array'];
        $rules['files.*'] = ['file', 'max:20480'];

        $validated = $request->validate($rules);

        $serviceLabels = [
            'web_system' => 'Web System',
            'website' => 'Website Development',
            'mobile_app' => 'Mobile App Development',
            'digital_marketing' => 'Digital Marketing',
            'it_solutions' => 'IT Solutions',
            'game_development' => 'Game Development',
        ];

        $ownerId = $user->isAdmin() ? $validated['user_id'] : $user->id;

        $systemType = $validated['system_type'] ?? null;
        if ($systemType === 'Other' && !empty($validated['system_type_other'])) {
            $systemType = 'Other: ' . $validated['system_type_other'];
        }

        $project = Project::create([
            'user_id' => $ownerId,
            'title' => $validated['title'],
            'category' => $serviceLabels[$validated['service_type']],
            'service_type' => $validated['service_type'],
            'system_type' => $systemType,
            'features' => $validated['features'] ?? null,
            'user_roles' => $validated['user_roles'] ?? null,
            'integrations' => $validated['integrations'] ?? null,
            'budget' => $validated['budget'] ?? null,
            'deadline' => !empty($validated['deadline']) ? $validated['deadline'] : null,
            'hosting_domain' => $validated['hosting_domain'] ?? null,
            'additional_notes' => $validated['additional_notes'] ?? null,
            'description' => $validated['description'] ?? null,
            'key_person' => $user->isAdmin() ? ($validated['key_person'] ?? null) : null,
            'status_remark' => $user->isAdmin() ? ($validated['status_remark'] ?? null) : null,
            'progress' => 0,
            'status' => 'in_progress',
            'payment_status' => 'unpaid',
            'icon_color' => '#2563eb',
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('project-files/'.$project->id, 'public');
                FileUpload::create([
                    'project_id' => $project->id,
                    'uploaded_by' => $user->id,
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            }
        }

        return redirect()->route('projects')->with('success', 'Project created successfully.');
    }

    public function update(Request $request, Project $project)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user->isAdmin()) {
            $validated = $request->validate([
                'progress' => ['required', 'integer', 'min:0', 'max:100'],
                'status' => ['required', Rule::in(['in_progress', 'completed', 'on_hold'])],
                'payment_status' => ['required', Rule::in(['unpaid', 'partial', 'paid'])],
                'key_person' => ['nullable', 'string', 'max:255'],
                'status_remark' => ['nullable', 'string', 'max:5000'],
            ]);
        } else {
            if ($project->user_id !== $user->id) {
                abort(403);
            }
            $validated = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'service_type' => ['required', Rule::in(['web_system', 'website', 'mobile_app', 'digital_marketing', 'it_solutions', 'game_development'])],
                'system_type' => ['nullable', 'string', 'max:255'],
                'system_type_other' => ['nullable', 'string', 'max:255'],
                'features' => ['nullable', 'string', 'max:5000'],
                'user_roles' => ['nullable', 'string', 'max:5000'],
                'integrations' => ['nullable', 'string', 'max:5000'],
                'budget' => ['nullable', 'string', 'max:255'],
                'deadline' => ['nullable', 'date'],
                'hosting_domain' => ['nullable', 'string', 'max:2000'],
                'additional_notes' => ['nullable', 'string', 'max:5000'],
                'description' => ['nullable', 'string', 'max:5000'],
                'request_quotation' => ['boolean'],
            ]);

            if (!empty($validated['system_type']) && $validated['system_type'] === 'Other' && !empty($validated['system_type_other'])) {
                $validated['system_type'] = 'Other: ' . $validated['system_type_other'];
            }
            unset($validated['system_type_other']);
        }

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

    public function uploadFile(Request $request, Project $project)
    {
        $user = Auth::user();

        if (! $user->isAdmin() && $project->user_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'file' => ['required', 'file', 'max:20480'], // 20MB max
        ]);

        $file = $request->file('file');
        $path = $file->store('project-files/'.$project->id, 'public');

        FileUpload::create([
            'project_id' => $project->id,
            'uploaded_by' => $user->id,
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        return redirect()->back()->with('success', 'File uploaded successfully.');
    }

    public function deleteFile(Project $project, FileUpload $file)
    {
        $user = Auth::user();
        if (! $user->isAdmin() && $project->user_id !== $user->id) {
            abort(403);
        }

        if ($file->project_id !== $project->id) {
            abort(404);
        }

        Storage::disk('public')->delete($file->path);
        $file->delete();

        return redirect()->back()->with('success', 'File deleted successfully.');
    }
}
