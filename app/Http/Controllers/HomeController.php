<?php

namespace App\Http\Controllers;


use App\Models\Media;
use App\Models\PageSection;
use App\Models\Setting;
use App\Models\SocialMedia;

use App\Services\MediaService;
use App\Services\SeoService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function indexBlade()
    {
        $data = $this->getHomeData();
        return view('landing.index', $data);
    }

    private function getHomeData()
    {
        // Load section content
        $hero = PageSection::getContent('home', 'hero', [          
            'showBadge' => true,
            'heading' => 'Premium Sound for Remarkable Events',
            'subheading' => 'Professional loudspeaker systems that deliver unparalleled clarity, precision, and power for the world\'s most demanding audio environments.',
            'backgroundImage' => Setting::getMediaUrl('hero_background_image', '/images/hero/hero-background.jpg'),
        ]);

        $stats = PageSection::getContent('home', 'stats', [
            'showStats' => true,
            'items' => [
                ['label' => "Tahun Pengalaman", 'value' => "10+"],
                ['label' => "Event Sukses", 'value' => "500+"],
                ['label' => "Klien Korporat & Instansi", 'value' => "200+"],
                ['label' => "Keandalan Teknis", 'value' => "100%"],
            ],
        ]);

        $clients = PageSection::getContent('home', 'clients', [
            'heading' => 'Dipercaya Oleh',
            'subheading' => null,
            'logos' => [
                ['name' => 'Nusa Tekno'],
                ['name' => 'Bangun Karya'],
                ['name' => 'Badan Publik Indonesia'],
                ['name' => 'Harmoni Mart'],
                ['name' => 'Modal Kilat'],
                ['name' => 'Industri Maju'],
                ['name' => 'Sinyal Nusantara'],
                ['name' => 'Pesona Hotel & Resort'],
            ],
        ]);

        $services = PageSection::getContent('home', 'services', [
            'heading' => 'Solusi Audio Terintegrasi',
            'subheading' => 'Kami menyediakan lebih dari sekadar peralatan. PLS memberikan ketenangan pikiran melalui layanan teknis yang komprehensif.',
            'items' => [
                ['title' => "Rental Sound System Premium", 'description' => "Sistem audio kelas dunia...", 'icon' => "Speaker"], // Fallbacks will be handled by default content in AdminController if missing, but good to have minimal here or rely on DB
            ],
        ]);

        $whyChooseContent = PageSection::getContent('home', 'whyChoose', [
            'subtitle' => 'Mengapa PLS?',
            'heading' => 'Standar Tinggi untuk Acara Penting Anda.',
            'description' => 'Kami mengerti bahwa...',
            'image' => '',
            'quote' => '"Keberhasilan acara Anda adalah reputasi kami."',
            'items' => [],
        ]);

        // Format WhyChoose image
        $whyChoose = $whyChooseContent;
        if (!empty($whyChoose['image'])) {
            $formattedImage = $this->formatImageWithResponsive([
                'image' => $whyChoose['image'],
                'alt' => '', // Add alt if we add it to schema later
            ]);
            if (isset($formattedImage['image'])) $whyChoose['image'] = $formattedImage['image'];
            if (isset($formattedImage['srcset'])) $whyChoose['srcset'] = $formattedImage['srcset'];
            // Responsive URLs if needed
        }

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

        $process = PageSection::getContent('home', 'process', [
            'heading' => 'Alur Kerja Profesional',
            'subheading' => 'Proses sederhana...',
            'items' => [],
        ]);

        $testimonials = PageSection::getContent('home', 'testimonials', [
            'heading' => 'Kepercayaan Klien',
            'items' => [],
        ]);

        $finalCTA = PageSection::getContent('home', 'finalCTA', [
            'heading' => 'Siap Wujudkan Event Berkelas?',
            'subheading' => 'Dapatkan penawaran terbaik...',
            'buttonText' => 'Jadwalkan Konsultasi',
            'buttonLink' => 'https://wa.me/6282257289604',
            'phoneNumber' => '0822-5728-9604',
        ]);

        $footer = PageSection::getContent('home', 'footer', [
            'brandName' => 'PLS',
            'brandSubtitle' => 'Rental Division',
            'description' => 'Mitra terpercaya...',
            'contactPhone' => '0822-5728-9604',
            'contactEmail' => 'plsrental@yahoo.com',
            'contactAddress' => 'JL.Raya Kandangan . Kare . MADIUN - Jawa Timur.',
        ]);
        
        // Legacy sections
        $about = PageSection::getContent('home', 'about', []);
        $partners = PageSection::getContent('home', 'partners', []);

        return [
            'hero' => $hero,
            'stats' => $stats,
            'clients' => $clients,
            'services' => $services,
            'whyChoose' => $whyChoose,
            'portfolio' => $portfolio,
            'process' => $process,
            'testimonials' => $testimonials,
            'finalCTA' => $finalCTA,
            'footer' => $footer,
            'about' => $about, // Legacy
            'partners' => $partners, // Legacy
            'seo' => SeoService::forHome(),
            'logoSettings' => [
                'logoLight' => $this->getLogoUrl('logo_light', '/images/logo.png'),
                'logoDark' => $this->getLogoUrl('logo_dark', '/images/logo.png'),
            ],
            'socialMedia' => SocialMedia::where('is_active', true)->orderBy('order')->get(),
        ];
    }

    /**
     * Format image data with responsive URLs if it's from media library.
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
