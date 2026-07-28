<?php

namespace App\Mail;

use App\Models\ProjectRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClientAppointmentSubmittedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ProjectRequest $projectRequest,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Appointment Has Been Submitted - ' . config('app.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.client-appointment-submitted',
            with: [
                'url' => route('appointments'),
            ],
        );
    }
}
