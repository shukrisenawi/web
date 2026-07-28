<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:24px;background:#f1f5f9">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:32px">
        <h2 style="margin:0 0 8px;color:#0f172a">{{ $isAdminReply ? 'New Reply From Our Team' : 'New Reply On Your Ticket' }}</h2>
        <p style="color:#64748b;margin:0 0 24px">
            There is a new reply on your support ticket from {{ config('app.name') }}.
        </p>

        <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#64748b">Ticket</td><td style="font-weight:600;color:#0f172a">{{ $ticket->ticket_no }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Subject</td><td style="font-weight:600;color:#0f172a">{{ $ticket->subject }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">From</td><td style="font-weight:600;color:#0f172a">{{ $reply->user?->name ?? 'Unknown' }}</td></tr>
        </table>

        <div style="margin:24px 0;padding:16px;background:#f8fafc;border-radius:8px;border-left:4px solid #2563eb">
            <p style="margin:0;color:#334155;white-space:pre-wrap">{{ $reply->message }}</p>
        </div>

        <div style="margin-top:28px">
            <a href="{{ $url }}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;font-weight:600">View Ticket</a>
        </div>

        <p style="margin-top:28px;font-size:12px;color:#94a3b8">
            You can log in to your account at {{ config('app.url') }} to continue the conversation.
        </p>
    </div>
</body>
</html>
