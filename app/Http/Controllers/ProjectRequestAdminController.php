<?php

namespace App\Http\Controllers;

use App\Mail\ClientAppointmentApprovedMail;
use App\Mail\ClientAppointmentRejectedMail;
use App\Models\ActivityLog;
use App\Models\Notification;
use App\Models\ProjectRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
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
                'avatar_url' => $r->user?->avatar ? '/uploads/' . $r->user->avatar : null,
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

        try {
            $client = User::find($request->user_id);
            if ($client) {
                Mail::to($client)->send(new ClientAppointmentApprovedMail($request));
            }
        } catch (\Throwable $e) {
            report($e);
        }

        ActivityLog::create([
            'user_id' => $request->user_id,
            'related_type' => ProjectRequest::class,
            'related_id' => $request->id,
            'type' => 'appointment',
            'description' => "Appointment from {$request->company_name} on {$request->appointment_date} was approved",
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

        try {
            $client = User::find($projectRequest->user_id);
            if ($client) {
                Mail::to($client)->send(new ClientAppointmentRejectedMail($projectRequest));
            }
        } catch (\Throwable $e) {
            report($e);
        }

        ActivityLog::create([
            'user_id' => $projectRequest->user_id,
            'related_type' => ProjectRequest::class,
            'related_id' => $projectRequest->id,
            'type' => 'appointment',
            'description' => "Appointment from {$projectRequest->company_name} on {$projectRequest->appointment_date} was rejected: {$validated['reason']}",
        ]);

        return redirect()->route('requests')->with('success', 'Appointment rejected.');
    }

    public function destroy(ProjectRequest $request): RedirectResponse
    {
        $this->ensureAdmin();

        $request->files()->delete();
        Notification::where('notifiable_type', ProjectRequest::class)
            ->where('notifiable_id', $request->id)
            ->delete();
        $request->delete();

        return redirect()->route('requests')->with('success', 'Appointment deleted.');
    }

    public function update(Request $request, ProjectRequest $projectRequest): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'appointment_type' => ['required', 'in:Physical,Online'],
            'appointment_date' => ['required', 'date'],
            'appointment_time' => ['required', 'string', 'max:20', $this->appointmentTimeRule()],
            'message' => ['nullable', 'string', 'max:5000'],
        ]);

        $projectRequest->update($validated);

        ActivityLog::create([
            'user_id' => $projectRequest->user_id,
            'related_type' => ProjectRequest::class,
            'related_id' => $projectRequest->id,
            'type' => 'appointment',
            'description' => "Appointment from {$projectRequest->company_name} updated to {$validated['appointment_date']} at {$validated['appointment_time']}",
        ]);

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

    private function appointmentTimeRule(): \Closure
    {
        return function ($attribute, $value, $fail) {
            $value = strtoupper(trim((string) $value));
            if (! preg_match('/^(\d{1,2}):(\d{2})\s?(AM|PM)$/', $value, $matches)) {
                $fail('The :attribute must be a valid time in h:mm AM/PM format (e.g. 2:30 PM).');
                return;
            }

            $hour = (int) $matches[1];
            $minute = (int) $matches[2];
            $ampm = $matches[3];

            if ($ampm === 'PM' && $hour !== 12) {
                $hour += 12;
            }
            if ($ampm === 'AM' && $hour === 12) {
                $hour = 0;
            }

            if ($hour < 8 || $hour > 18 || ($hour === 18 && $minute !== 0)) {
                $fail('The :attribute must be between 8:00 AM and 6:00 PM.');
            }
        };
    }
}
