<?php

namespace App\Http\Controllers;

use App\Mail\ClientAppointmentSubmittedMail;
use App\Models\ActivityLog;
use App\Models\Notification as AdminNotification;
use App\Models\ProjectRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProjectRequestController extends Controller
{
    public function create()
    {
        return Inertia::render('RequestForm');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_mobile' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(6)],
            'appointment_type' => ['required', 'in:Physical,Online'],
            'appointment_date' => ['required', 'date'],
            'appointment_time' => ['required', 'string', 'max:20', $this->appointmentTimeRule()],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $user = User::create([
            'name' => $validated['contact_name'],
            'email' => $validated['contact_email'],
            'password' => Hash::make($validated['password']),
            'role' => User::ROLE_CLIENT,
            'company' => $validated['company_name'],
            'whatsapp' => $validated['contact_mobile'] ?? null,
        ]);

        $projectRequest = ProjectRequest::create([
            'user_id' => $user->id,
            'company_name' => $validated['company_name'],
            'contact_name' => $validated['contact_name'],
            'contact_mobile' => $validated['contact_mobile'] ?? null,
            'contact_email' => $validated['contact_email'],
            'appointment_type' => $validated['appointment_type'],
            'appointment_date' => $validated['appointment_date'],
            'appointment_time' => $validated['appointment_time'],
            'message' => $validated['message'] ?? null,
            'status' => 'pending',
        ]);

        $adminUsers = User::where('role', User::ROLE_ADMIN)->get();
        foreach ($adminUsers as $admin) {
            AdminNotification::create([
                'user_id' => $admin->id,
                'type' => 'project_request',
                'notifiable_type' => ProjectRequest::class,
                'notifiable_id' => $projectRequest->id,
                'title' => 'New project request: ' . $validated['company_name'],
                'message' => $validated['contact_name'] . ' (' . $validated['contact_email'] . ') submitted a project request.',
                'is_read' => false,
            ]);
        }

        Auth::login($user);

        try {
            Mail::to($user)->send(new ClientAppointmentSubmittedMail($projectRequest));
        } catch (\Throwable $e) {
            report($e);
        }

        ActivityLog::create([
            'user_id' => $user->id,
            'related_type' => ProjectRequest::class,
            'related_id' => $projectRequest->id,
            'type' => 'appointment',
            'description' => "Appointment requested by {$user->name} on {$projectRequest->appointment_date} at {$projectRequest->appointment_time}",
        ]);

        return redirect()->route('appointments')->with('success', 'Your appointment has been submitted successfully. Our team will review it shortly.');
    }

    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        $appointments = ProjectRequest::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'company_name' => $r->company_name,
                'appointment_type' => $r->appointment_type,
                'appointment_date' => $r->appointment_date,
                'appointment_time' => $r->appointment_time,
                'message' => $r->message,
                'rejection_reason' => $r->rejection_reason,
                'status' => $r->status,
                'created_at' => $r->created_at->format('M d, Y'),
            ]);

        return Inertia::render('ClientAppointments', [
            'appointments' => $appointments,
        ]);
    }

    public function storeClient(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'appointment_type' => ['required', 'in:Physical,Online'],
            'appointment_date' => ['required', 'date'],
            'appointment_time' => ['required', 'string', 'max:20', $this->appointmentTimeRule()],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $projectRequest = ProjectRequest::create([
            'user_id' => $user->id,
            'company_name' => $user->company ?? $user->name,
            'contact_name' => $user->name,
            'contact_mobile' => $user->whatsapp ?? null,
            'contact_email' => $user->email,
            'appointment_type' => $validated['appointment_type'],
            'appointment_date' => $validated['appointment_date'],
            'appointment_time' => $validated['appointment_time'],
            'message' => $validated['message'],
            'status' => 'pending',
        ]);

        $adminUsers = User::where('role', User::ROLE_ADMIN)->get();
        foreach ($adminUsers as $admin) {
            AdminNotification::create([
                'user_id' => $admin->id,
                'type' => 'appointment_booked',
                'notifiable_type' => ProjectRequest::class,
                'notifiable_id' => $projectRequest->id,
                'title' => 'New appointment: ' . ($user->company ?? $user->name),
                'message' => $user->name . ' (' . $user->email . ') booked a new appointment.',
                'is_read' => false,
            ]);
        }

        try {
            Mail::to($user)->send(new ClientAppointmentSubmittedMail($projectRequest));
        } catch (\Throwable $e) {
            report($e);
        }

        ActivityLog::create([
            'user_id' => $user->id,
            'related_type' => ProjectRequest::class,
            'related_id' => $projectRequest->id,
            'type' => 'appointment',
            'description' => "New appointment booked by {$user->name} on {$projectRequest->appointment_date} at {$projectRequest->appointment_time}",
        ]);

        return redirect()->route('appointments')->with('success', 'Appointment booked successfully.');
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
