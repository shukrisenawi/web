<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Contact Us Message</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
        .label { font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: bold; margin-bottom: 4px; }
        .value { margin-bottom: 16px; }
        .message { white-space: pre-line; }
    </style>
</head>
<body>
    <div class="container">
        <h2>New Contact Us Message</h2>
        <div class="box">
            <div class="label">Name</div>
            <div class="value">{{ $submission['name'] }}</div>

            <div class="label">Email</div>
            <div class="value">{{ $submission['email'] }}</div>

            <div class="label">Subject</div>
            <div class="value">{{ $submission['subject'] }}</div>

            <div class="label">Message</div>
            <div class="value message">{{ $submission['message'] }}</div>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            This message was submitted via the Contact Us form on your website.
        </p>
    </div>
</body>
</html>
