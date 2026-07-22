<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\ProjectRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectRequestAdminController extends Controller
{
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $requests = ProjectRequest::with('user')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'company_name' => $r->company_name,
                'contact_name' => $r->contact_name,
                'contact_email' => $r->contact_email,
                'contact_mobile' => $r->contact_mobile,
                'appointment_type' => $r->appointment_type,
                'appointment_date' => $r->appointment_date,
                'appointment_time' => $r->appointment_time,
                'message' => $r->message,
                'status' => $r->status,
                'created_at' => $r->created_at->format('M d, Y'),
                'user_id' => $r->user_id,
            ]);

        return Inertia::render('ProjectRequests', [
            'requests' => $requests,
        ]);
    }

    public function markReviewed(ProjectRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        if ($request->status === 'pending') {
            $request->update(['status' => 'reviewed']);
        }

        Notification::where('notifiable_type', ProjectRequest::class)
            ->where('notifiable_id', $request->id)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return redirect()->route('requests')->with('success', 'Request marked as reviewed.');
    }
}
