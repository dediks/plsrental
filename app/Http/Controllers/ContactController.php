<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\PageSection;
use App\Models\ContactSubmission;
use App\Services\RecaptchaService;
use App\Services\SeoService;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\ContactRequest;
use App\Mail\ContactSubmissionNotification;

class ContactController extends Controller
{
    public function index(): Response
    {
        $hero = PageSection::getContent('contact', 'hero', [
            'title' => 'Contact Us',
        ]);

        $form = PageSection::getContent('contact', 'form', [
            'heading' => 'Send us a message',
            'description' => 'Fill out the form below and we\'ll get back to you as soon as possible.',
        ]);

        $contactInfo = PageSection::getContent('contact', 'contactInfo', [
            'heading' => 'Get in touch',
            'address' => "Indonesia",
            'phone' => '',
            'email' => 'uapsound@yahoo.com',
        ]);

        $recaptchaService = app(RecaptchaService::class);

        return Inertia::render('Contact/Index', [
            'hero' => $hero,
            'form' => $form,
            'contactInfo' => $contactInfo,
            'recaptchaSiteKey' => $recaptchaService->getSiteKey(),
            'seo' => SeoService::forContact(),
        ]);
    }

    public function store(ContactRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        // Remove recaptcha_token from validated data before creating submission
        unset($validated['recaptcha_token']);
        
        $submission = ContactSubmission::create($validated);

        // Send email notification to admin (synchronous)
        try {
            $adminEmail = config('mail.from.address');
            if ($adminEmail) {
                Mail::to($adminEmail)->send(new ContactSubmissionNotification($submission));
            }
        } catch (\Exception $e) {
            // Log error but don't fail the submission
            Log::error('Failed to send contact submission email: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Thank you for your message. We will get back to you soon.');
    }
}
