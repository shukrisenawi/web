<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:24px;background:#f1f5f9">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:32px">
        <h2 style="margin:0 0 8px;color:#0f172a">Appointment Could Not Be Confirmed</h2>
        <p style="color:#64748b;margin:0 0 24px">We are sorry, but your appointment request with {{ config('app.name') }} could not be confirmed at this time.</p>

        <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#64748b">Company</td><td style="font-weight:600;color:#0f172a">{{ $projectRequest->company_name }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Date</td><td style="font-weight:600;color:#0f172a">{{ $projectRequest->appointment_date }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Time</td><td style="font-weight:600;color:#0f172a">{{ $projectRequest->appointment_time }}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Reason</td><td style="font-weight:600;color:#0f172a">{{ $projectRequest->rejection_reason ?? 'Not specified' }}</td></tr>
        </table>

        <div style="margin-top:28px">
            <a href="{{ $url }}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:white;text-decoration:none;border-radius:8px;font-weight:600">View Appointments</a>
        </div>

        <p style="margin-top:28px;font-size:12px;color:#94a3b8">
            If you would like to reschedule, please submit a new appointment request.
        </p>
    </div>
</body>
</html>
