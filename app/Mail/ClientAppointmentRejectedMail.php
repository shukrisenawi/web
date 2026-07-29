<?php

namespace App\Mail;

use App\Models\EmailTemplate;
use App\Models\ProjectRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClientAppointmentRejectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ProjectRequest $projectRequest,
    ) {}

    public function envelope(): Envelope
    {
        $template = EmailTemplate::get('client_appointment_rejected', $this->variables());

        return new Envelope(
            subject: $template['found'] && $template['subject'] ? $template['subject'] : 'Your Appointment Could Not Be Confirmed - ' . config('app.name'),
        );
    }

    public function content(): Content
    {
        $template = EmailTemplate::get('client_appointment_rejected', $this->variables());

        if ($template['found'] && $template['body']) {
            return new Content(
                htmlString: $template['body'],
            );
        }

        return new Content(
            view: 'emails.client-appointment-rejected',
            with: [
                'url' => route('appointments'),
            ],
        );
    }

    private function variables(): array
    {
        return [
            'app_name' => config('app.name'),
            'app_url' => config('app.url'),
            'logo_url' => asset('images/logo.png'),
            'company_name' => $this->projectRequest->company_name ?? '',
            'contact_name' => $this->projectRequest->contact_name ?? '',
            'appointment_date' => $this->projectRequest->appointment_date ?? '',
            'appointment_time' => $this->projectRequest->appointment_time ?? '',
            'appointment_type' => $this->projectRequest->appointment_type ?? '',
            'rejection_reason' => $this->projectRequest->rejection_reason ?? 'Not specified',
            'url' => route('appointments'),
        ];
    }
}
