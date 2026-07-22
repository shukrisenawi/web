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
                'rejection_reason' => $r->rejection_reason,
                'status' => $r->status,
                'created_at' => $r->created_at->format('M d, Y'),
                'user_id' => $r->user_id,
                'avatar_url' => $r->user?->avatar ? '/storage/' . $r->user->avatar : null,
            ]);

        return Inertia::render('ProjectRequests', [
            'requests' => $requests,
        ]);
    }

    public function approve(ProjectRequest $request): RedirectResponse
    {
        $this->ensureAdmin();

        $request->update(['status' => 'approved', 'rejection_reason' => null]);

        $this->markNotificationsRead($request);

        Notification::create([
            'user_id' => $request->user_id,
            'type' => 'appointment_approved',
            'notifiable_type' => ProjectRequest::class,
            'notifiable_id' => $request->id,
            'title' => 'Appointment Approved',
            'message' => 'Your appointment has been approved successfully.',
            'is_read' => false,
        ]);

        return redirect()->route('requests')->with('success', 'Appointment approved.');
    }

    public function reject(Request $request, ProjectRequest $projectRequest): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $projectRequest->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['reason'],
        ]);

        $this->markNotificationsRead($projectRequest);

        Notification::create([
            'user_id' => $projectRequest->user_id,
            'type' => 'appointment_rejected',
            'notifiable_type' => ProjectRequest::class,
            'notifiable_id' => $projectRequest->id,
            'title' => 'Appointment Rejected',
            'message' => 'Reason: ' . $validated['reason'],
            'is_read' => false,
        ]);

        return redirect()->route('requests')->with('success', 'Appointment rejected.');
    }

    public function update(Request $request, ProjectRequest $projectRequest): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'appointment_type' => ['required', 'in:Physical,Online'],
            'appointment_date' => ['required', 'date'],
            'appointment_time' => ['required', 'string', 'max:20'],
            'message' => ['nullable', 'string', 'max:5000'],
        ]);

        $projectRequest->update($validated);

        return redirect()->route('requests')->with('success', 'Appointment updated.');
    }

    private function ensureAdmin(): void
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }
    }

    private function markNotificationsRead(ProjectRequest $request): void
    {
        Notification::where('notifiable_type', ProjectRequest::class)
            ->where('notifiable_id', $request->id)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);
    }
}
