<?php

namespace App\Http\Controllers;

use App\Models\PageSection;
use App\Models\Setting;
use App\Services\MediaService;
use App\Models\Media;
use App\Services\SeoService;

class PortfolioController extends Controller
{
    public function index()
    {
        $portfolioContent = PageSection::getContent('home', 'portfolio', [
            'heading' => 'Pengalaman Nyata di Lapangan',
            'subheading' => 'Menangani berbagai skala acara...',
            'items' => [],
        ]);

        // Format Portfolio images
        $portfolio = $portfolioContent;
        if (!empty($portfolio['items'])) {
            foreach ($portfolio['items'] as &$item) {
                if (!empty($item['imageUrl'])) {
                    $formattedImage = $this->formatImageWithResponsive([
                        'image' => $item['imageUrl'],
                        'alt' => $item['title'] ?? '',
                    ]);
                    if (isset($formattedImage['image'])) $item['imageUrl'] = $formattedImage['image'];
                    // We could add srcset to item if frontend uses it
                }
            }
        }

        $data = [
            'portfolio' => $portfolio,
            'seo' => SeoService::forHome(), // We might want to customize this for portfolio later
            'logoSettings' => [
                'logoLight' => $this->getLogoUrl('logo_light', '/images/logo.png'),
                'logoDark' => $this->getLogoUrl('logo_dark', '/images/logo.png'),
            ],
            'footer' => PageSection::getContent('home', 'footer', [
                'brandName' => 'PLS',
                'brandSubtitle' => 'Rental Division',
                'description' => 'Mitra terpercaya...',
                'contactPhone' => '0822-5728-9604',
                'contactEmail' => 'plsrental@yahoo.com',
                'contactAddress' => 'JL.Raya Kandangan . Kare . MADIUN - Jawa Timur.',
            ]),
            'finalCTA' => PageSection::getContent('home', 'finalCTA', [
                 'heading' => 'Siap Wujudkan Event Berkelas?',
                 'subheading' => 'Dapatkan penawaran terbaik...',
                 'buttonText' => 'Konsultasi Sekarang',
                 'buttonLink' => 'https://wa.me/6282257289604',
                 'phoneNumber' => '0822-5728-9604',
             ]),
        ];

        return view('landing.portfolio', $data);
    }

    /**
     * Format image data with responsive URLs if it's from media library.
     * Copied from HomeController for consistency.
     */
    private function formatImageWithResponsive(array $imageData): array
    {
        if (! isset($imageData['image']) || empty($imageData['image'])) {
            return $imageData;
        }

        $imageUrl = $imageData['image'];

        // Only process if it's from media library (/storage/)
        if (! str_contains($imageUrl, '/storage/')) {
            return $imageData;
        }

        // Extract path from URL
        $path = str_replace('/storage/', '', $imageUrl);
        $path = ltrim($path, '/');

        $media = null;

        // Check if this is a conversion URL (pattern: /storage/{id}/conversions/...)
        // Extract Spatie media ID from conversion URLs
        if (preg_match('#^(\d+)/conversions/#', $path, $matches)) {
            $spatieMediaId = (int) $matches[1];
            // Find Media record by spatie_media_id
            $media = Media::where('spatie_media_id', $spatieMediaId)->first();
        }

        // If not found via conversion URL, try to find Media record by path
        if (! $media) {
            $media = Media::where('path', $path)
                ->orWhere('path', 'like', '%/'.basename($path))
                ->first();
        }

        if ($media && $media->spatie_media_id) {
            // Format with responsive data
            $formatted = MediaService::formatSingleMedia($media, 'xxlarge');

            return [
                'image' => $formatted['url'] ?? $imageUrl,
                'alt' => $imageData['alt'] ?? $media->alt_text ?? '',
                'srcset' => $formatted['srcset'] ?? '',
                'responsive_urls' => $formatted['responsive_urls'] ?? [],
            ];
        }

        // Return original if no media found
        return $imageData;
    }

    /**
     * Get logo URL from settings (handles both media IDs and legacy paths).
     */
    private function getLogoUrl(string $key, string $fallbackPath): string
    {
        // Get media URL using the Setting model's helper method
        $url = Setting::getMediaUrl($key, $fallbackPath);

        // Ensure URL is properly formatted
        if (!$url) {
            return $fallbackPath;
        }

        // If it's an absolute URL, extract the path for frontend compatibility
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            $parsed = parse_url($url);
            return $parsed['path'] ?? $url;
        }

        // If it already starts with /, return as is
        if (str_starts_with($url, '/')) {
            return $url;
        }

        // Otherwise, assume it's a storage path
        return '/storage/' . ltrim($url, '/');
    }
}
