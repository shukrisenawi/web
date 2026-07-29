<?php

namespace App\Mail;

use App\Models\EmailTemplate;
use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Ticket $ticket,
        public TicketReply $reply,
    ) {}

    public function envelope(): Envelope
    {
        $template = EmailTemplate::get('ticket_reply', $this->variables());

        return new Envelope(
            subject: $template['found'] && $template['subject'] ? $template['subject'] : 'New Reply on Your Support Ticket ' . $this->ticket->ticket_no . ' - ' . config('app.name'),
        );
    }

    public function content(): Content
    {
        $template = EmailTemplate::get('ticket_reply', $this->variables());

        if ($template['found'] && $template['body']) {
            return new Content(
                htmlString: $template['body'],
            );
        }

        return new Content(
            view: 'emails.ticket-reply',
            with: [
                'url' => route('support') . '?ticket=' . $this->ticket->ticket_no,
                'isAdminReply' => $this->reply->user?->isAdmin() ?? false,
            ],
        );
    }

    private function variables(): array
    {
        return [
            'app_name' => config('app.name'),
            'app_url' => config('app.url'),
            'logo_url' => asset('images/logo.png'),
            'ticket_no' => $this->ticket->ticket_no,
            'subject' => $this->ticket->subject,
            'sender_name' => $this->reply->user?->name ?? 'Unknown',
            'message' => $this->reply->message,
            'is_admin_reply' => ($this->reply->user?->isAdmin() ?? false) ? 'true' : 'false',
            'url' => route('support') . '?ticket=' . $this->ticket->ticket_no,
        ];
    }
}
