<?php

namespace App\Mail;

use App\Models\ProjectRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClientAppointmentApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ProjectRequest $projectRequest,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Appointment Has Been Approved - ' . config('app.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.client-appointment-approved',
            with: [
                'url' => route('appointments'),
            ],
        );
    }
}
