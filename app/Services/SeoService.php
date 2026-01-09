<?php

namespace App\Services;


use App\Models\Rental;
use App\Models\Setting;
use App\Models\Supplier;

class SeoService
{
    /**
     * Generate SEO data for a page.
     */
    public static function generate(array $data = []): array
    {
        $title = $data['title'] ?? config('app.name');
        $description = $data['description'] ?? self::getDefaultDescription();
        $image = $data['image'] ?? self::getDefaultImage();
        $url = $data['url'] ?? url()->current();
        $type = $data['type'] ?? 'website';
        $siteName = $data['siteName'] ?? $data['site_name'] ?? config('app.name');
        $twitterHandle = $data['twitterHandle'] ?? $data['twitter_handle'] ?? Setting::get('twitter_handle');
        $structuredData = $data['structuredData'] ?? $data['structured_data'] ?? [];
        $ogTitle = $data['ogTitle'] ?? $data['og_title'] ?? null;
        $ogDescription = $data['ogDescription'] ?? $data['og_description'] ?? null;

        // Format Twitter handle (ensure it starts with @ if provided)
        if ($twitterHandle && ! str_starts_with($twitterHandle, '@')) {
            $twitterHandle = '@'.$twitterHandle;
        }

        // Ensure URL is absolute
        $absoluteUrl = self::makeAbsoluteUrl($url) ?: $url;

        return [
            'title' => $title,
            'description' => self::truncateDescription($description),
            'image' => self::makeAbsoluteUrl($image),
            'url' => $absoluteUrl,
            'canonical' => $absoluteUrl,
            'type' => $type,
            'siteName' => $siteName,
            'twitterHandle' => $twitterHandle,
            'structuredData' => $structuredData,
            'ogTitle' => $ogTitle,
            'ogDescription' => $ogDescription,
        ];
    }

    /**
     * Generate SEO data for a product.
     */


    /**
     * Generate SEO data for an article.
     */


    /**
     * Generate SEO data for a supplier.
     */
    public static function forSupplier(Supplier $supplier): array
    {
        $title = $supplier->meta_title ?: $supplier->name;
        $description = $supplier->meta_description ?: $supplier->description;
        $image = $supplier->og_image;
        $url = self::makeAbsoluteUrl(route('suppliers.show', $supplier->slug));

        $structuredData = [
            self::generateOrganizationStructuredData(),
        ];

        return self::generate([
            'title' => $title,
            'description' => $description,
            'image' => $image,
            'url' => $url,
            'type' => 'website',
            'structuredData' => $structuredData,
        ]);
    }

    /**
     * Generate SEO data for home page.
     */
    public static function forHome(): array
    {
        $title = Setting::get('home_meta_title') ?: 'Acoustic Engineering Excellence';
        $description = Setting::get('home_meta_description') ?: 'Professional loudspeaker systems that deliver unparalleled clarity, precision, and power for the world\'s most demanding audio environments.';
        $image = '/images/og-image.jpg';
        $url = self::makeAbsoluteUrl(route('home'));

        $structuredData = [
            self::generateOrganizationStructuredData(),
            self::generateWebSiteStructuredData(),
        ];

        return self::generate([
            'title' => $title,
            'description' => $description,
            'image' => $image,
            'url' => $url,
            'type' => 'website',
            'structuredData' => $structuredData,
        ]);
    }

    /**
     * Generate SEO data for products index.
     */


    /**
     * Generate SEO data for articles index.
     */


    /**
     * Generate SEO data for suppliers index.
     */
    public static function forSuppliersIndex(): array
    {
        $title = Setting::get('suppliers_meta_title') ?: 'Suppliers';
        $description = Setting::get('suppliers_meta_description') ?: 'Find authorized PLSRental distributors, dealers, and partners near you, ensuring trusted service, genuine products, and professional audio solutions.';
        $url = self::makeAbsoluteUrl(route('suppliers.index'));

        $structuredData = [
            self::generateOrganizationStructuredData(),
        ];

        return self::generate([
            'title' => $title,
            'description' => $description,
            'url' => $url,
            'type' => 'website',
            'structuredData' => $structuredData,
        ]);
    }

    /**
     * Generate SEO data for a rental.
     */
    public static function forRental(Rental $rental): array
    {
        $title = $rental->meta_title ?: $rental->name;
        $description = $rental->meta_description ?: $rental->description;
        $image = $rental->og_image;
        $url = self::makeAbsoluteUrl(route('rentals.show', $rental->slug));

        $structuredData = [
            self::generateOrganizationStructuredData(),
        ];

        return self::generate([
            'title' => $title,
            'description' => $description,
            'image' => $image,
            'url' => $url,
            'type' => 'website',
            'structuredData' => $structuredData,
        ]);
    }

    /**
     * Generate SEO data for rentals index.
     */
    public static function forRentalsIndex(): array
    {
        $title = Setting::get('rentals_meta_title') ?: 'Rentals';
        $description = Setting::get('rentals_meta_description') ?: 'Find trusted PLSRental rental partners near you, offering professional loudspeaker systems and audio equipment for events, installations, and productions.';
        $url = self::makeAbsoluteUrl(route('rentals.index'));

        $structuredData = [
            self::generateOrganizationStructuredData(),
        ];

        return self::generate([
            'title' => $title,
            'description' => $description,
            'url' => $url,
            'type' => 'website',
            'structuredData' => $structuredData,
        ]);
    }

    /**
     * Generate SEO data for gallery page.
     */
    public static function forGallery(): array
    {
        $title = Setting::get('gallery_meta_title') ?: 'Gallery';
        $description = Setting::get('gallery_meta_description') ?: 'View our product gallery and installations.';
        $url = self::makeAbsoluteUrl(route('gallery.index'));

        $structuredData = [
            self::generateOrganizationStructuredData(),
        ];

        return self::generate([
            'title' => $title,
            'description' => $description,
            'url' => $url,
            'type' => 'website',
            'structuredData' => $structuredData,
        ]);
    }

    /**
     * Generate SEO data for contact page.
     */
    public static function forContact(): array
    {
        $title = Setting::get('contact_meta_title') ?: 'Contact Us';
        $description = Setting::get('contact_meta_description') ?: 'Get in touch with PLSRental for product inquiries, technical support, partnerships, or information about our professional audio solutions.';
        $url = self::makeAbsoluteUrl(route('contact.index'));

        $structuredData = [
            self::generateOrganizationStructuredData(),
            self::generateContactPageStructuredData(),
        ];

        return self::generate([
            'title' => $title,
            'description' => $description,
            'url' => $url,
            'type' => 'website',
            'structuredData' => $structuredData,
        ]);
    }

    /**
     * Generate SEO data for about page.
     */
    public static function forAbout(): array
    {
        $title = Setting::get('about_meta_title') ?: 'About Us';
        $description = Setting::get('about_meta_description') ?: 'Learn about PLSRental, a loudspeaker manufacturer dedicated to acoustic engineering excellence, delivering innovative, reliable, and high-performance professional audio solutions.';
        $url = self::makeAbsoluteUrl(route('about'));

        $structuredData = [
            self::generateOrganizationStructuredData(),
            self::generateAboutPageStructuredData(),
        ];

        return self::generate([
            'title' => $title,
            'description' => $description,
            'url' => $url,
            'type' => 'website',
            'structuredData' => $structuredData,
        ]);
    }

    /**
     * Generate SEO data for privacy policy page.
     */
    public static function forPrivacy(): array
    {
        $title = Setting::get('privacy_meta_title') ?: 'Privacy Policy';
        $description = Setting::get('privacy_meta_description') ?: 'Learn how we collect, use, and protect your personal information.';
        $url = self::makeAbsoluteUrl(route('privacy'));

        $structuredData = [
            self::generateOrganizationStructuredData(),
        ];

        return self::generate([
            'title' => $title,
            'description' => $description,
            'url' => $url,
            'type' => 'website',
            'structuredData' => $structuredData,
        ]);
    }

    /**
     * Generate SEO data for terms of service page.
     */
    public static function forTerms(): array
    {
        $title = Setting::get('terms_meta_title') ?: 'Terms of Service';
        $description = Setting::get('terms_meta_description') ?: 'Read our terms of service and understand the rules and regulations for using our website.';
        $url = self::makeAbsoluteUrl(route('terms'));

        $structuredData = [
            self::generateOrganizationStructuredData(),
        ];

        return self::generate([
            'title' => $title,
            'description' => $description,
            'url' => $url,
            'type' => 'website',
            'structuredData' => $structuredData,
        ]);
    }

    /**
     * Generate Product structured data (JSON-LD).
     */


    /**
     * Generate Article structured data (JSON-LD).
     */


    /**
     * Generate Organization structured data (JSON-LD).
     */
    private static function generateOrganizationStructuredData(): array
    {
        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => config('app.name'),
            'url' => config('app.url'),
        ];

        // Get logo URL from media ID (handles both media IDs and legacy paths)
        $logo = Setting::getMediaUrl('logo_light', '/images/black-logo.svg');
        if ($logo) {
            $data['logo'] = self::makeAbsoluteUrl($logo);
        }

        return $data;
    }

    /**
     * Generate WebSite structured data (JSON-LD).
     */
    private static function generateWebSiteStructuredData(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => config('app.name'),
            'url' => config('app.url'),
            'potentialAction' => [
                '@type' => 'SearchAction',

            ],
        ];
    }

    /**
     * Generate BreadcrumbList structured data (JSON-LD).
     */
    public static function generateBreadcrumbStructuredData(array $breadcrumbs): array
    {
        $items = [];
        $position = 1;

        foreach ($breadcrumbs as $breadcrumb) {
            // Support both {name, url} and {title, href} formats
            $name = $breadcrumb['name'] ?? $breadcrumb['title'] ?? '';
            $url = $breadcrumb['url'] ?? $breadcrumb['href'] ?? null;

            // Skip if no name or if href is '#' (current page)
            if (empty($name) || $url === '#') {
                continue;
            }

            $items[] = [
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => $name,
                'item' => $url ? self::makeAbsoluteUrl($url) : null,
            ];
        }

        if (empty($items)) {
            return [];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $items,
        ];
    }

    /**
     * Generate ItemList structured data (JSON-LD) for index pages.
     */
    private static function generateItemListStructuredData(array $items, string $url, string $name): array
    {
        $listItems = [];
        $position = 1;

        foreach ($items as $item) {
            $itemUrl = $item['url'] ?? $item['slug'] ?? null;
            $itemName = $item['name'] ?? $item['title'] ?? '';

            if (empty($itemName) || empty($itemUrl)) {
                continue;
            }

            $listItems[] = [
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => $itemName,
                'item' => self::makeAbsoluteUrl($itemUrl),
            ];
        }

        if (empty($listItems)) {
            return [];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'ItemList',
            'name' => $name,
            'url' => self::makeAbsoluteUrl($url),
            'itemListElement' => $listItems,
        ];
    }

    /**
     * Generate AboutPage structured data (JSON-LD).
     */
    private static function generateAboutPageStructuredData(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'AboutPage',
            'name' => 'About '.config('app.name'),
            'url' => self::makeAbsoluteUrl(route('about')),
        ];
    }

    /**
     * Generate ContactPage structured data (JSON-LD).
     */
    private static function generateContactPageStructuredData(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'ContactPage',
            'name' => 'Contact '.config('app.name'),
            'url' => self::makeAbsoluteUrl(route('contact.index')),
        ];
    }

    /**
     * Make a URL absolute.
     */
    private static function makeAbsoluteUrl(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        // If already absolute, return as is
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            return $url;
        }

        // Make absolute
        return config('app.url').'/'.ltrim($url, '/');
    }

    /**
     * Truncate description to appropriate length.
     */
    private static function truncateDescription(?string $description, int $length = 160): ?string
    {
        if (! $description) {
            return null;
        }

        $description = self::stripHtml($description);

        if (mb_strlen($description) <= $length) {
            return $description;
        }

        return mb_substr($description, 0, $length - 3).'...';
    }

    /**
     * Strip HTML tags from text.
     */
    private static function stripHtml(?string $text): string
    {
        if (! $text) {
            return '';
        }

        return strip_tags($text);
    }

    /**
     * Get default description.
     */
    private static function getDefaultDescription(): string
    {
        return Setting::get('default_meta_description') ?: 'Professional loudspeaker systems that deliver unparalleled clarity, precision, and power.';
    }

    /**
     * Get default image.
     */
    private static function getDefaultImage(): ?string
    {
        // Try to get from settings first
        $image = Setting::get('default_og_image');

        if ($image) {
            return $image;
        }

        // Fallback to logo (user preference)
        $logo = Setting::get('logo_light', '/images/black-logo.svg');
        if ($logo && file_exists(public_path($logo))) {
            return $logo;
        }

        // Final fallback to hero image if logo doesn't exist
        $heroImage = '/images/hero/hero-speakers-1.jpg';
        if (file_exists(public_path($heroImage))) {
            return $heroImage;
        }

        return null;
    }
}
