<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\PageSection;
use App\Services\MediaService;
use App\Services\SeoService;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        $intro = PageSection::getContent('about', 'intro', [
            'heading' => 'We Design and Manufacture High-Performance Sound Reinforcement Systems',
            'paragraph' => 'Our uncompromising approach to loudspeaker design avoids the use of corrective EQ and focuses on engineering loudspeakers that naturally perform at the highest level. The result is maximum resolution, realism and, ultimately, involving listening experiences.',
        ]);

        $imageContent = PageSection::getContent('about', 'image', [
            'image' => '/images/hero/hero-speakers-1.jpg',
            'alt' => 'UAP Sound Systems in Action',
        ]);

        // Format image with responsive data if it's from media library
        $image = $this->formatImageWithResponsive($imageContent);

        $philosophyContent = PageSection::getContent('about', 'philosophy', [
            'heading' => 'Our Design Philosophy',
            'intro' => 'Our approach to loudspeaker design was established by founder Ulung Ronggo S, who has been actively involved in the professional audio industry since 2016. Ulung continues to lead the UAP design team and its research and technological developments.',
            'subsections' => [
                [
                    'title' => 'Audio Quality',
                    'content' => 'Almost all modern loudspeakers require significant pre-set or controller EQ. In contrast, we have always designed acoustically flat loudspeaker systems, requiring only crossover filters, relative delays and gains. The advantages of this approach are headroom preservation and system linearity, as well as a clearer, more natural audio presentation. We design our own transducers and, in combination with our unique waveguide and loading technology, we achieve minimum distortion, maximum efficiency and controlled, consistent directivity.',
                ],
                [
                    'title' => 'Efficiency',
                    'content' => 'We believe it is good engineering to maximise the efficiency of our loudspeakers. As well as being kinder to the environment, high efficiency loudspeakers have such an exciting, dynamic and engaging sound quality. Significantly fewer UAP loudspeakers and amplifiers are required in comparison to other systems in the market, meaning reduced power consumption and CO2 emissions, and emotive listening experiences.',
                ],
                [
                    'title' => 'Research & Development',
                    'content' => 'Our R&D team has a history of innovation and is responsible for developing proprietary audio technologies. All critical design decisions at UAP are informed by comprehensive listening tests. The results of these tests are validated by in-depth electroacoustic measurements with both industry-standard and bespoke instrumentation and software. We continue to develop new measurement types and methods in our pursuit of audio excellence.',
                ],
            ],
        ]);

        // Format philosophy subsection images with responsive data
        $philosophy = $philosophyContent;
        if (isset($philosophy['subsections']) && is_array($philosophy['subsections'])) {
            foreach ($philosophy['subsections'] as $index => $subsection) {
                if (isset($subsection['image'])) {
                    $formattedImage = $this->formatImageWithResponsive([
                        'image' => $subsection['image'],
                        'alt' => $subsection['alt'] ?? $subsection['title'] ?? '',
                    ]);
                    $philosophy['subsections'][$index] = array_merge($subsection, $formattedImage);
                }
            }
        }

        $founder = PageSection::getContent('about', 'founder', [
            'heading' => 'Our Founder & Design Team',
            'paragraphs' => [
                'UAP loudspeaker designs are conceived by Ulung Ronggo S, founder of UAP, who has been actively involved in the professional audio industry since 2016.',
                'Ulung continues to lead the UAP design team, overseeing research, development, and the advancement of our proprietary audio technologies.',
            ],
        ]);

        return Inertia::render('About/Index', [
            'intro' => $intro,
            'image' => $image,
            'philosophy' => $philosophy,
            'founder' => $founder,
            'seo' => SeoService::forAbout(),
        ]);
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
            $formatted = MediaService::formatSingleMedia($media, 'large');

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
}
