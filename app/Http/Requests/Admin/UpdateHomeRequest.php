<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'hero' => ['required', 'array'],
            'hero.carouselImages' => ['nullable', 'array'],
            'hero.splitLayoutImage' => ['nullable', 'string'],
            'hero.backgroundImage' => ['nullable', 'string'],
            'hero.backgroundVideo' => ['nullable', 'string'],
            'hero.trustedByText' => ['nullable', 'string', 'max:255'],
            'hero.showTrustedBy' => ['boolean'],
            'hero.trustedByAvatars' => ['nullable', 'array'],
            'hero.autoPlay' => ['boolean'],
            'hero.autoPlayInterval' => ['integer', 'min:1000'],
            'hero.showBadge' => ['boolean'],
            'hero.showScrollIndicator' => ['boolean'],
            'hero.showCarousel' => ['boolean'],
            'hero.showSplitLayoutImage' => ['boolean'],
            'hero.showOverlay' => ['boolean'],
            'hero.overlayOpacity' => ['integer', 'min:0', 'max:100'],
            'hero.contentMaxWidth' => ['nullable', 'string', 'in:sm,md,lg,xl,2xl,3xl,4xl,full'],
            'hero.heading' => ['nullable', 'string', 'max:255'],
            'hero.subheading' => ['nullable', 'string', 'max:500'],
            'hero.showHeading' => ['boolean'],
            'hero.showSubheading' => ['boolean'],
            'hero.mobileHeading' => ['nullable', 'string', 'max:255'],
            'hero.mobileSubheading' => ['nullable', 'string', 'max:500'],
            'hero.showMobileHeading' => ['boolean'],
            'hero.showMobileSubheading' => ['boolean'],
            
            // Stats Section
            'stats' => ['required', 'array'],
            'stats.showStats' => ['boolean'],
            'stats.items' => ['nullable', 'array'],
            'stats.items.*.label' => ['required', 'string', 'max:255'],
            'stats.items.*.value' => ['required', 'string', 'max:255'],

            // Services Section
            'services' => ['required', 'array'],
            'services.heading' => ['nullable', 'string', 'max:255'],
            'services.subheading' => ['nullable', 'string'],
            'services.items' => ['nullable', 'array'],
            'services.items.*.title' => ['required', 'string', 'max:255'],
            'services.items.*.description' => ['required', 'string'],
            'services.items.*.icon' => ['nullable', 'string'], // Icon name from Lucide

            // Why Choose Section
            'whyChoose' => ['required', 'array'],
            'whyChoose.subtitle' => ['nullable', 'string', 'max:255'],
            'whyChoose.heading' => ['nullable', 'string', 'max:255'],
            'whyChoose.description' => ['nullable', 'string'],
            'whyChoose.image' => ['nullable', 'string'],
            'whyChoose.quote' => ['nullable', 'string'],
            'whyChoose.items' => ['nullable', 'array'],
            'whyChoose.items.*.title' => ['required', 'string', 'max:255'],
            'whyChoose.items.*.text' => ['required', 'string'],
            'whyChoose.items.*.icon' => ['nullable', 'string'],

            // Portfolio Section
            'portfolio' => ['required', 'array'],
            'portfolio.heading' => ['nullable', 'string', 'max:255'],
            'portfolio.subheading' => ['nullable', 'string'],
            'portfolio.items' => ['nullable', 'array'],
            'portfolio.items.*.title' => ['required', 'string', 'max:255'],
            'portfolio.items.*.category' => ['required', 'string', 'max:255'],
            'portfolio.items.*.imageUrl' => ['nullable', 'string'],

            // Process Section
            'process' => ['required', 'array'],
            'process.heading' => ['nullable', 'string', 'max:255'],
            'process.subheading' => ['nullable', 'string'],
            'process.items' => ['nullable', 'array'],
            'process.items.*.num' => ['required', 'string', 'max:10'],
            'process.items.*.title' => ['required', 'string', 'max:255'],
            'process.items.*.desc' => ['required', 'string'],

            // Testimonials Section
            'testimonials' => ['required', 'array'],
            'testimonials.heading' => ['nullable', 'string', 'max:255'],
            'testimonials.items' => ['nullable', 'array'],
            'testimonials.items.*.text' => ['required', 'string'],
            'testimonials.items.*.author' => ['required', 'string', 'max:255'],
            'testimonials.items.*.role' => ['nullable', 'string', 'max:255'],
            'testimonials.items.*.company' => ['nullable', 'string', 'max:255'],

            // Final CTA Section
            'finalCTA' => ['required', 'array'],
            'finalCTA.heading' => ['nullable', 'string', 'max:255'],
            'finalCTA.subheading' => ['nullable', 'string'],
            'finalCTA.buttonText' => ['nullable', 'string', 'max:255'],
            'finalCTA.buttonLink' => ['nullable', 'string', 'max:255'],
            'finalCTA.phoneNumber' => ['nullable', 'string', 'max:255'],

            // Footer Section
            'footer' => ['required', 'array'],
            'footer.brandName' => ['nullable', 'string', 'max:255'],
            'footer.brandDescription' => ['nullable', 'string'],
            'footer.socialLinks' => ['nullable', 'array'],
            'footer.socialLinks.instagram' => ['nullable', 'string', 'max:255'],
            'footer.socialLinks.facebook' => ['nullable', 'string', 'max:255'],
            'footer.socialLinks.twitter' => ['nullable', 'string', 'max:255'],
            'footer.socialLinks.linkedin' => ['nullable', 'string', 'max:255'],
            'footer.phone' => ['nullable', 'string', 'max:255'],
            'footer.email' => ['nullable', 'string', 'max:255'],
            'footer.address' => ['nullable', 'string'],
            'footer.copyrightText' => ['nullable', 'string', 'max:255'],

            // Keep About and Partners as they might be used or migrated, but make them nullable/optional implies I should keep them required if code expects them, or make them optional.
            // Plan said updates, I will keep them but maybe relax strictness if I intend to remove them later.
            // For now, I'll keep them as is to avoid breaking if frontend still sends them or if I decide to map them.
            'about' => ['nullable', 'array'], // Relaxed from required
            'partners' => ['nullable', 'array'], // Relaxed from required
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'hero.required' => 'The hero section is required.',
            'hero.autoPlayInterval.min' => 'The auto play interval must be at least 1000 milliseconds.',
            'hero.overlayOpacity.min' => 'The overlay opacity must be at least 0.',
            'hero.overlayOpacity.max' => 'The overlay opacity must not exceed 100.',
            'hero.contentMaxWidth.in' => 'The content max width must be one of: sm, md, lg, xl, 2xl, 3xl, 4xl, full.',
            'hero.heading.max' => 'The hero heading must not exceed 255 characters.',
            'hero.subheading.max' => 'The hero subheading must not exceed 500 characters.',
            'hero.mobileHeading.max' => 'The mobile heading must not exceed 255 characters.',
            'hero.mobileSubheading.max' => 'The mobile subheading must not exceed 500 characters.',
            'about.required' => 'The about section is required.',
            'about.imageAlt.max' => 'The image alt text must not exceed 255 characters.',
            'about.imagePosition.in' => 'The image position must be either left or right.',
            'about.imagePositionMobile.in' => 'The mobile image position must be either top or bottom.',
            'partners.required' => 'The partners section is required.',
        ];
    }
}

