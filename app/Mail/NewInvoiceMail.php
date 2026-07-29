<?php

namespace App\Mail;

use App\Models\EmailTemplate;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Invoice $invoice,
    ) {}

    public function envelope(): Envelope
    {
        $template = EmailTemplate::get('new_invoice', $this->variables());

        return new Envelope(
            subject: $template['found'] && $template['subject'] ? $template['subject'] : 'New Invoice: ' . $this->invoice->invoice_no,
        );
    }

    public function content(): Content
    {
        $template = EmailTemplate::get('new_invoice', $this->variables());

        if ($template['found'] && $template['body']) {
            return new Content(
                htmlString: $template['body'],
            );
        }

        return new Content(
            view: 'emails.new-invoice',
            with: [
                'viewUrl' => route('invoices.show', $this->invoice),
                'paymentUrl' => $this->invoice->payment_url ?: route('payment.show', $this->invoice->invoice_no),
            ],
        );
    }

    private function variables(): array
    {
        return [
            'app_name' => config('app.name'),
            'app_url' => config('app.url'),
            'logo_url' => asset('images/logo.png'),
            'invoice_no' => $this->invoice->invoice_no,
            'billed_to' => $this->invoice->company_name ?? ($this->invoice->user?->company ?? $this->invoice->user?->name ?? ''),
            'issue_date' => $this->invoice->issue_date?->format('M d, Y') ?? '',
            'status' => $this->invoice->status,
            'view_url' => route('invoices.show', $this->invoice),
            'payment_url' => $this->invoice->payment_url ?: route('payment.show', $this->invoice->invoice_no),
        ];
    }
}
