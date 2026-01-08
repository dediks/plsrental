<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #2563eb; margin-top: 0;">New Contact Submission</h1>
        <p style="margin: 0; color: #666;">You have received a new contact form submission.</p>
    </div>

    <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px 0;">{{ $submission->name }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0;">
                    <a href="mailto:{{ $submission->email }}" style="color: #2563eb; text-decoration: none;">
                        {{ $submission->email }}
                    </a>
                </td>
            </tr>
            @if($submission->subject)
            <tr>
                <td style="padding: 10px 0; font-weight: bold;">Subject:</td>
                <td style="padding: 10px 0;">{{ $submission->subject }}</td>
            </tr>
            @endif
            <tr>
                <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 10px 0; white-space: pre-wrap;">{{ $submission->message }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; font-weight: bold;">Submitted:</td>
                <td style="padding: 10px 0;">{{ $submission->created_at->format('F j, Y \a\t g:i A') }}</td>
            </tr>
        </table>
    </div>

    <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
        <a href="{{ config('app.url') }}/dashboard/admin/contact-submissions/{{ $submission->id }}" 
           style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px;">
            View Submission
        </a>
    </div>

    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px;">
        <p>This is an automated notification from {{ config('app.name') }}</p>
    </div>
</body>
</html>

