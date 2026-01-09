<?php

namespace App\Http\Controllers;

use App\Services\SeoService;
use Inertia\Inertia;

class PrivacyController extends Controller
{
    public function index()
    {
        $sections = [
            [
                'title' => 'Introduction',
                'content' => 'PLSRental ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.',
            ],
            [
                'title' => 'Information We Collect',
                'content' => 'We collect information about you in the following ways:

Contact Form Data: When you use our contact form, we collect your name, email address, subject, and message. This information is used solely to respond to your inquiries and provide customer support.

Automatically Collected Data: When you visit our website, our servers automatically collect certain information, including your IP address, browser type, operating system, access times, and the pages you have viewed. This information helps us understand how visitors use our website and improve our services.

Google Analytics: We use Google Analytics to collect and analyze information about how visitors use our website. This includes data such as page views, time spent on pages, and the source of traffic. This information is collected anonymously and helps us improve our website\'s functionality and user experience.

reCAPTCHA: When you submit our contact form, we use Google reCAPTCHA to verify that you are a human user and to prevent spam. This service may collect information about your device and browsing behavior.',
            ],
            [
                'title' => 'How We Use Your Information',
                'content' => 'We use the information we collect for the following purposes:

• To respond to your inquiries and provide customer support
• To improve our website and user experience
• To analyze website usage and trends
• To prevent spam and ensure website security
• To comply with legal obligations

We do not use your personal information for marketing purposes unless you have explicitly consented to such use.',
            ],
            [
                'title' => 'Data Protection',
                'content' => 'We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.',
            ],
            [
                'title' => 'Cookies and Tracking Technologies',
                'content' => 'We use cookies and similar tracking technologies on our website:

Google Analytics Cookies: We use Google Analytics to understand how visitors interact with our website. Google Analytics uses cookies to collect anonymous information about your browsing behavior. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.

Session Cookies: We use session cookies to maintain your browsing session and ensure the website functions properly.

You can control cookies through your browser settings. Most browsers are set to accept cookies by default, but you can choose to reject or delete cookies. Please note that disabling cookies may affect the functionality of our website.',
            ],
            [
                'title' => 'Third-Party Services',
                'content' => 'We use the following third-party services that may collect or process your information:

Google Analytics: We use Google Analytics to analyze website traffic and usage. Google Analytics collects anonymous data about your visits to our website. For more information about how Google uses data, please visit Google\'s Privacy Policy.

Google reCAPTCHA: We use Google reCAPTCHA on our contact form to prevent spam. reCAPTCHA may collect information about your device and browsing behavior. For more information, please visit Google\'s Privacy Policy.

Email Services: We use email services to send responses to your contact form submissions. Your contact information is processed by our email service provider in accordance with their privacy policy.

We do not sell, rent, or share your personal information with third parties for their marketing purposes.',
            ],
            [
                'title' => 'Data Retention',
                'content' => 'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Contact form submissions are retained for as long as necessary to respond to your inquiry and for our records.',
            ],
            [
                'title' => 'Your Rights',
                'content' => 'Depending on your location, you may have the following rights regarding your personal information:

• The right to access – You have the right to request copies of your personal data
• The right to rectification – You have the right to request that we correct any information you believe is inaccurate
• The right to erasure – You have the right to request that we erase your personal data, under certain conditions
• The right to restrict processing – You have the right to request that we restrict the processing of your personal data
• The right to object to processing – You have the right to object to our processing of your personal data
• The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions

If you make a request, we will respond within one month. If you would like to exercise any of these rights, please contact us using the contact information provided below.',
            ],
            [
                'title' => 'Contact Us',
                'content' => 'If you have questions or comments about this Privacy Policy, please contact us at:
                JL. Raya Kandangan, Kec. Kare, Madiun
                Jawa Timur - Indonesia.
                Email: plsrental@yahoo.com',
            ],
            [
                'title' => 'Changes to This Privacy Policy',
                'content' => 'We may update this Privacy Policy from time to time in order to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.',
            ],
        ];

        $lastUpdated = 'January 2025';

        return Inertia::render('Privacy/Index', [
            'sections' => $sections,
            'lastUpdated' => $lastUpdated,
            'seo' => SeoService::forPrivacy(),
        ]);
    }
}
