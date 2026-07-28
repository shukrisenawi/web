<?php

namespace App\Http\Controllers;

use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmailTemplateController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $templates = EmailTemplate::orderBy('name')->get();

        if ($templates->isEmpty()) {
            $this->seedDefaults();
            $templates = EmailTemplate::orderBy('name')->get();
        }

        return Inertia::render('EmailTemplates', [
            'templates' => $templates->map(fn ($t) => [
                'id' => $t->id,
                'key' => $t->key,
                'name' => $t->name,
                'subject' => $t->subject,
                'body' => $t->body,
                'is_active' => $t->is_active,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'key' => ['required', 'string', 'max:100', Rule::unique('email_templates')],
            'name' => ['required', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'is_active' => ['boolean'],
        ]);

        EmailTemplate::create($validated);

        return redirect()->route('email-templates.index')->with('success', 'Email template created.');
    }

    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'is_active' => ['boolean'],
        ]);

        $emailTemplate->update($validated);

        return redirect()->route('email-templates.index')->with('success', 'Email template updated.');
    }

    private function seedDefaults(): void
    {
        $defaults = [
            [
                'key' => 'client_appointment_submitted',
                'name' => 'Client Appointment Submitted',
                'subject' => 'Your Appointment Has Been Submitted - {{ app_name }}',
                'body' => "<!DOCTYPE html>\n<html>\n<head><meta charset=\"utf-8\"></head>\n<body style=\"font-family:sans-serif;padding:24px;background:#f1f5f9\">\n    <div style=\"max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:32px\">\n        <h2 style=\"margin:0 0 8px;color:#0f172a\">Appointment Submitted</h2>\n        <p style=\"color:#64748b;margin:0 0 24px\">Thank you for reaching out to {{ app_name }}. Your appointment request has been received.</p>\n        <table style=\"width:100%;border-collapse:collapse;font-size:14px\">\n            <tr><td style=\"padding:8px 0;color:#64748b\">Company</td><td style=\"font-weight:600;color:#0f172a\">{{ company_name }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Contact</td><td style=\"font-weight:600;color:#0f172a\">{{ contact_name }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Date</td><td style=\"font-weight:600;color:#0f172a\">{{ appointment_date }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Time</td><td style=\"font-weight:600;color:#0f172a\">{{ appointment_time }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Type</td><td style=\"font-weight:600;color:#0f172a\">{{ appointment_type }}</td></tr>\n        </table>\n        <div style=\"margin-top:28px\">\n            <a href=\"{{ url }}\" style=\"display:inline-block;padding:12px 24px;background:#0f172a;color:white;text-decoration:none;border-radius:8px;font-weight:600\">View Appointments</a>\n        </div>\n        <p style=\"margin-top:28px;font-size:12px;color:#94a3b8\">Our team will review your request and confirm shortly.</p>\n    </div>\n</body>\n</html>",
            ],
            [
                'key' => 'client_appointment_approved',
                'name' => 'Client Appointment Approved',
                'subject' => 'Your Appointment Has Been Approved - {{ app_name }}',
                'body' => "<!DOCTYPE html>\n<html>\n<head><meta charset=\"utf-8\"></head>\n<body style=\"font-family:sans-serif;padding:24px;background:#f1f5f9\">\n    <div style=\"max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:32px\">\n        <h2 style=\"margin:0 0 8px;color:#0f172a\">Appointment Approved</h2>\n        <p style=\"color:#64748b;margin:0 0 24px\">Great news! Your appointment with {{ app_name }} has been approved.</p>\n        <table style=\"width:100%;border-collapse:collapse;font-size:14px\">\n            <tr><td style=\"padding:8px 0;color:#64748b\">Company</td><td style=\"font-weight:600;color:#0f172a\">{{ company_name }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Date</td><td style=\"font-weight:600;color:#0f172a\">{{ appointment_date }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Time</td><td style=\"font-weight:600;color:#0f172a\">{{ appointment_time }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Type</td><td style=\"font-weight:600;color:#0f172a\">{{ appointment_type }}</td></tr>\n        </table>\n        <div style=\"margin-top:28px\">\n            <a href=\"{{ url }}\" style=\"display:inline-block;padding:12px 24px;background:#16a34a;color:white;text-decoration:none;border-radius:8px;font-weight:600\">View Appointment</a>\n        </div>\n        <p style=\"margin-top:28px;font-size:12px;color:#94a3b8\">We look forward to speaking with you.</p>\n    </div>\n</body>\n</html>",
            ],
            [
                'key' => 'client_appointment_rejected',
                'name' => 'Client Appointment Rejected',
                'subject' => 'Your Appointment Could Not Be Confirmed - {{ app_name }}',
                'body' => "<!DOCTYPE html>\n<html>\n<head><meta charset=\"utf-8\"></head>\n<body style=\"font-family:sans-serif;padding:24px;background:#f1f5f9\">\n    <div style=\"max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:32px\">\n        <h2 style=\"margin:0 0 8px;color:#0f172a\">Appointment Could Not Be Confirmed</h2>\n        <p style=\"color:#64748b;margin:0 0 24px\">We are sorry, but your appointment request with {{ app_name }} could not be confirmed at this time.</p>\n        <table style=\"width:100%;border-collapse:collapse;font-size:14px\">\n            <tr><td style=\"padding:8px 0;color:#64748b\">Company</td><td style=\"font-weight:600;color:#0f172a\">{{ company_name }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Date</td><td style=\"font-weight:600;color:#0f172a\">{{ appointment_date }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Time</td><td style=\"font-weight:600;color:#0f172a\">{{ appointment_time }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Reason</td><td style=\"font-weight:600;color:#0f172a\">{{ rejection_reason }}</td></tr>\n        </table>\n        <div style=\"margin-top:28px\">\n            <a href=\"{{ url }}\" style=\"display:inline-block;padding:12px 24px;background:#dc2626;color:white;text-decoration:none;border-radius:8px;font-weight:600\">View Appointments</a>\n        </div>\n        <p style=\"margin-top:28px;font-size:12px;color:#94a3b8\">If you would like to reschedule, please submit a new appointment request.</p>\n    </div>\n</body>\n</html>",
            ],
            [
                'key' => 'ticket_reply',
                'name' => 'Ticket Reply',
                'subject' => 'New Reply on Your Support Ticket {{ ticket_no }} - {{ app_name }}',
                'body' => "<!DOCTYPE html>\n<html>\n<head><meta charset=\"utf-8\"></head>\n<body style=\"font-family:sans-serif;padding:24px;background:#f1f5f9\">\n    <div style=\"max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:32px\">\n        <h2 style=\"margin:0 0 8px;color:#0f172a\">{{ is_admin_reply ? 'New Reply From Our Team' : 'New Reply On Your Ticket' }}</h2>\n        <p style=\"color:#64748b;margin:0 0 24px\">There is a new reply on your support ticket from {{ app_name }}.</p>\n        <table style=\"width:100%;border-collapse:collapse;font-size:14px\">\n            <tr><td style=\"padding:8px 0;color:#64748b\">Ticket</td><td style=\"font-weight:600;color:#0f172a\">{{ ticket_no }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Subject</td><td style=\"font-weight:600;color:#0f172a\">{{ subject }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">From</td><td style=\"font-weight:600;color:#0f172a\">{{ sender_name }}</td></tr>\n        </table>\n        <div style=\"margin:24px 0;padding:16px;background:#f8fafc;border-radius:8px;border-left:4px solid #2563eb\">\n            <p style=\"margin:0;color:#334155;white-space:pre-wrap\">{{ message }}</p>\n        </div>\n        <div style=\"margin-top:28px\">\n            <a href=\"{{ url }}\" style=\"display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;font-weight:600\">View Ticket</a>\n        </div>\n        <p style=\"margin-top:28px;font-size:12px;color:#94a3b8\">You can log in to your account at {{ app_url }} to continue the conversation.</p>\n    </div>\n</body>\n</html>",
            ],
            [
                'key' => 'new_invoice',
                'name' => 'New Invoice',
                'subject' => 'New Invoice: {{ invoice_no }} - {{ app_name }}',
                'body' => "<!DOCTYPE html>\n<html>\n<head><meta charset=\"utf-8\"></head>\n<body style=\"font-family:sans-serif;padding:24px;background:#f1f5f9\">\n    <div style=\"max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:32px\">\n        <h2 style=\"margin:0 0 8px;color:#0f172a\">New Invoice</h2>\n        <p style=\"color:#64748b;margin:0 0 24px\">You have received a new invoice from {{ app_name }}.</p>\n        <table style=\"width:100%;border-collapse:collapse;font-size:14px\">\n            <tr><td style=\"padding:8px 0;color:#64748b\">Invoice</td><td style=\"font-weight:600;color:#0f172a\">{{ invoice_no }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Billed To</td><td style=\"font-weight:600;color:#0f172a\">{{ billed_to }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Issue Date</td><td style=\"font-weight:600;color:#0f172a\">{{ issue_date }}</td></tr>\n            <tr><td style=\"padding:8px 0;color:#64748b\">Status</td><td style=\"font-weight:600;color:#0f172a;text-transform:capitalize\">{{ status }}</td></tr>\n        </table>\n        <div style=\"margin-top:28px\">\n            <a href=\"{{ view_url }}\" style=\"display:inline-block;padding:12px 24px;background:#0f172a;color:white;text-decoration:none;border-radius:8px;font-weight:600\">View Invoice</a>\n            <a href=\"{{ payment_url }}\" style=\"display:inline-block;margin-left:12px;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;font-weight:600\">Pay Now</a>\n        </div>\n        <p style=\"margin-top:28px;font-size:12px;color:#94a3b8\">You can also log in to your account at {{ app_url }} to view and manage this invoice.</p>\n    </div>\n</body>\n</html>",
            ],
        ];

        foreach ($defaults as $data) {
            EmailTemplate::firstOrCreate(['key' => $data['key']], $data);
        }
    }
}
