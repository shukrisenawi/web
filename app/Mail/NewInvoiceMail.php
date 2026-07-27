<?php

namespace App\Mail;

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
        return new Envelope(
            subject: 'New Invoice: ' . $this->invoice->invoice_no,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new-invoice',
            with: [
                'viewUrl' => route('invoices.show', $this->invoice),
                'paymentUrl' => $this->invoice->payment_url ?: route('payment.show', $this->invoice->invoice_no),
            ],
        );
    }
}
