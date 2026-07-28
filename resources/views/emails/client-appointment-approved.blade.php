<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:24px;background:#f1f5f9">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:32px">
        <h2 style="margin:0 0 8px;color:#0f172a">Appointment Approved</h2>
        <p style="color:#64748b;margin:0 0 24px">Great news! Your appointment with {{ config('app.name') }} has been approved.</p>

        <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#64748b">Company</td><td style="font-weight:600;color:#0f172a">{{ $projectRequest->company_name }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Date</td><td style="font-weight:600;color:#0f172a">{{ $projectRequest->appointment_date }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Time</td><td style="font-weight:600;color:#0f172a">{{ $projectRequest->appointment_time }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Type</td><td style="font-weight:600;color:#0f172a">{{ $projectRequest->appointment_type }}</td></tr>
        </table>

        <div style="margin-top:28px">
            <a href="{{ $url }}" style="display:inline-block;padding:12px 24px;background:#16a34a;color:white;text-decoration:none;border-radius:8px;font-weight:600">View Appointment</a>
        </div>

        <p style="margin-top:28px;font-size:12px;color:#94a3b8">
            We look forward to speaking with you.
        </p>
    </div>
</body>
</html>
