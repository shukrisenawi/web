<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:24px;background:#f1f5f9">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:32px">
        <h2 style="margin:0 0 8px;color:#0f172a">New Invoice</h2>
        <p style="color:#64748b;margin:0 0 24px">You have received a new invoice from {{ config('app.name') }}.</p>

        <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#64748b">Invoice</td><td style="font-weight:600;color:#0f172a">{{ $invoice->invoice_no }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Amount</td><td style="font-weight:600;color:#0f172a">${{ number_format($invoice->amount, 2) }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Issue Date</td><td style="font-weight:600;color:#0f172a">{{ $invoice->issue_date->format('M d, Y') }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Status</td><td style="font-weight:600;color:#0f172a;text-transform:capitalize">{{ $invoice->status }}</td></tr>
        </table>

        @if($invoice->payment_url)
            <a href="{{ $invoice->payment_url }}" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;font-weight:600">Pay Now</a>
        @endif

        <p style="margin-top:32px;font-size:12px;color:#94a3b8">Login to your account to view full invoice details.</p>
    </div>
</body>
</html>
