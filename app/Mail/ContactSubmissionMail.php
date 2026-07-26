<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactSubmissionMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public array $submission,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Contact Us Message: ' . $this->submission['subject'],
            replyTo: [new Address($this->submission['email'], $this->submission['name'])],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-submission',
        );
    }
}
