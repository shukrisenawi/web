<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:24px;background:#f1f5f9">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:32px">
        <h2 style="margin:0 0 8px;color:#0f172a">New Invoice</h2>
        <p style="color:#64748b;margin:0 0 24px">You have received a new invoice from {{ config('app.name') }}.</p>

        <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#64748b">Invoice</td><td style="font-weight:600;color:#0f172a">{{ $invoice->invoice_no }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Billed To</td><td style="font-weight:600;color:#0f172a">{{ $invoice->company_name ?? ($invoice->user?->company ?? $invoice->user?->name) }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Issue Date</td><td style="font-weight:600;color:#0f172a">{{ $invoice->issue_date->format('M d, Y') }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Status</td><td style="font-weight:600;color:#0f172a;text-transform:capitalize">{{ $invoice->status }}</td></tr>
        </table>

        @if($invoice->items->isNotEmpty())
            <h3 style="margin:24px 0 8px;color:#0f172a;font-size:16px">Invoice Items</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
                <thead>
                    <tr style="border-bottom:1px solid #e2e8f0">
                        <th style="text-align:left;padding:8px 0;color:#64748b;font-weight:500">Description</th>
                        <th style="text-align:right;padding:8px 0;color:#64748b;font-weight:500">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($invoice->items as $item)
                        <tr style="border-bottom:1px solid #f1f5f9">
                            <td style="padding:10px 0;color:#0f172a">{{ $item->description }}</td>
                            <td style="padding:10px 0;text-align:right;font-weight:600;color:#0f172a">${{ number_format($item->amount, 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr>
                        <td style="padding:12px 0;color:#0f172a;font-weight:700">Total</td>
                        <td style="padding:12px 0;text-align:right;font-weight:700;color:#0f172a">${{ number_format($invoice->amount, 2) }}</td>
                    </tr>
                </tfoot>
            </table>
        @endif

        <div style="margin-top:28px">
            <a href="{{ $viewUrl }}" style="display:inline-block;padding:12px 24px;background:#0f172a;color:white;text-decoration:none;border-radius:8px;font-weight:600">View Invoice</a>

            @if($invoice->status !== 'paid')
                <a href="{{ $paymentUrl }}" style="display:inline-block;margin-left:12px;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;font-weight:600">Pay Now</a>
            @endif
        </div>

        <p style="margin-top:28px;font-size:12px;color:#94a3b8">
            You can also log in to your account at {{ config('app.url') }} to view and manage this invoice.
        </p>
    </div>
</body>
</html>
