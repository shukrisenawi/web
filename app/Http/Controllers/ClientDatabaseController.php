<?php

namespace App\Http\Controllers;

use App\Models\ProjectRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClientDatabaseController extends Controller
{
    private function clientData($query): array
    {
        return $query
            ->withCount(['projects', 'invoices'])
            ->with(['projectRequests' => fn ($q) => $q->with('files')->latest()])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($c) {
                $request = $c->projectRequests->first();

                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'email' => $c->email,
                    'company' => $c->company,
                    'business_address' => $c->business_address,
                    'whatsapp' => $c->whatsapp,
                    'projects_count' => $c->projects_count,
                    'invoices_count' => $c->invoices_count,
                    'joined' => $c->created_at->format('M d, Y'),
                    'request' => $request ? [
                        'industry' => $request->industry,
                        'system_type' => $request->system_type,
                        'features' => $request->features,
                        'user_roles' => $request->user_roles,
                        'integrations' => $request->integrations,
                        'budget' => $request->budget,
                        'deadline' => $request->deadline?->format('M d, Y'),
                        'hosting_domain' => $request->hosting_domain,
                        'additional_notes' => $request->additional_notes,
                        'status' => $request->status,
                        'files' => $request->files->map(fn ($f) => [
                            'id' => $f->id,
                            'filename' => $f->filename,
                            'size' => $f->size,
                            'url' => \Illuminate\Support\Facades\Storage::url($f->path),
                        ]),
                    ] : null,
                ];
            })
            ->toArray();
    }

    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $clients = $this->clientData(User::where('role', User::ROLE_CLIENT));

        return Inertia::render('ClientDatabase', [
            'clients' => $clients,
        ]);
    }

    public function pending()
    {
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $pendingRequestUserIds = ProjectRequest::where('status', 'pending')
            ->pluck('user_id')
            ->unique()
            ->values();

        $clients = $this->clientData(User::whereIn('id', $pendingRequestUserIds));

        return Inertia::render('ClientDatabase', [
            'clients' => $clients,
        ]);
    }
}
