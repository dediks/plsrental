<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateHomeRequest;
use App\Models\Media;
use App\Models\PageSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function edit()
    {
        $sections = PageSection::where('page', 'home')
            ->orderBy('order')
            ->get()
            ->keyBy('section_key');

        return Inertia::render('admin/home/Edit', [
            'hero' => $sections->get('hero')?->content ?? $this->getDefaultHero(),
            'stats' => $sections->get('stats')?->content ?? $this->getDefaultStats(),
            'services' => $sections->get('services')?->content ?? $this->getDefaultServices(),
            'whyChoose' => $sections->get('whyChoose')?->content ?? $this->getDefaultWhyChoose(),
            'portfolio' => $sections->get('portfolio')?->content ?? $this->getDefaultPortfolio(),
            'process' => $sections->get('process')?->content ?? $this->getDefaultProcess(),
            'testimonials' => $sections->get('testimonials')?->content ?? $this->getDefaultTestimonials(),
            'finalCTA' => $sections->get('finalCTA')?->content ?? $this->getDefaultFinalCTA(),
            'footer' => $sections->get('footer')?->content ?? $this->getDefaultFooter(),
            // Keep old ones for now if needed, or just omit if I'm fully replacing. 
            // I'll keep them to avoid errors if Edit.tsx still expects them until I update Edit.tsx
            'about' => $sections->get('about')?->content ?? $this->getDefaultAbout(),
            'partners' => $sections->get('partners')?->content ?? $this->getDefaultPartners(),
        ]);
    }

    public function update(UpdateHomeRequest $request)
    {
        $validated = $request->validated();

        // Handle hero media
        $this->handleHeroMedia($validated);

        // Handle whyChoose image
        $this->handleWhyChooseMedia($validated);

        // Handle portfolio images
        $this->handlePortfolioMedia($validated);

        // Handle other sections (About/Partners legacy)
        $this->handleLegacyMedia($validated);

        $sections = [
            'hero', 'stats', 'services', 'whyChoose', 'portfolio', 
            'process', 'testimonials', 'finalCTA', 'footer',
            'about', 'partners'
        ];

        foreach ($sections as $key) {
            if (isset($validated[$key])) {
                PageSection::updateOrCreate(
                    [
                        'page' => 'home',
                        'section_key' => $key,
                    ],
                    [
                        'content' => $validated[$key],
                        'is_enabled' => true,
                    ]
                );
            }
        }

        return redirect()->route('admin.home.edit')
            ->with('success', 'Home page sections updated successfully.');
    }

    private function handleHeroMedia(array $validated): void
    {
        $heroSection = PageSection::where('page', 'home')->where('section_key', 'hero')->first();
        if (!$heroSection) return;

        // Carousel Images
        if (isset($heroSection->content['carouselImages']) && isset($validated['hero']['carouselImages'])) {
            $oldImages = $heroSection->content['carouselImages'] ?? [];
            $newImages = $validated['hero']['carouselImages'] ?? [];
            $removedImages = array_diff($oldImages, $newImages);
            foreach ($removedImages as $removedUrl) $this->deleteMediaByUrl($removedUrl);
        }

        // Trusted By Avatars
        if (isset($heroSection->content['trustedByAvatars']) && isset($validated['hero']['trustedByAvatars'])) {
            $oldAvatars = $heroSection->content['trustedByAvatars'] ?? [];
            $newAvatars = $validated['hero']['trustedByAvatars'] ?? [];
            $removedAvatars = array_diff($oldAvatars, $newAvatars);
            foreach ($removedAvatars as $removedUrl) $this->deleteMediaByUrl($removedUrl);
        }

        // Split Layout Image
        if (isset($heroSection->content['splitLayoutImage'])) {
            $old = $heroSection->content['splitLayoutImage'] ?? '';
            $new = $validated['hero']['splitLayoutImage'] ?? '';
            if ($old && $old !== $new) $this->deleteMediaByUrl($old);
        }

        // Background Video
        if (isset($heroSection->content['backgroundVideo'])) {
            $old = $heroSection->content['backgroundVideo'] ?? '';
            $new = $validated['hero']['backgroundVideo'] ?? '';
            if ($old && $old !== $new) $this->deleteMediaByUrl($old);
        }
    }

    private function handleWhyChooseMedia(array $validated): void
    {
        $section = PageSection::where('page', 'home')->where('section_key', 'whyChoose')->first();
        if (!$section) return;

        if (isset($section->content['image'])) {
            $old = $section->content['image'] ?? '';
            $new = $validated['whyChoose']['image'] ?? '';
            if ($old && $old !== $new) $this->deleteMediaByUrl($old);
        }
    }

    private function handlePortfolioMedia(array $validated): void
    {
        $section = PageSection::where('page', 'home')->where('section_key', 'portfolio')->first();
        if (!$section) return;

        if (isset($section->content['items']) && isset($validated['portfolio']['items'])) {
            $oldItems = $section->content['items'] ?? [];
            $newItems = $validated['portfolio']['items'] ?? [];
            
            $oldUrls = array_column($oldItems, 'imageUrl');
            $newUrls = array_column($newItems, 'imageUrl');
            
            $removedUrls = array_diff($oldUrls, $newUrls);
            foreach ($removedUrls as $removedUrl) {
                if ($removedUrl) $this->deleteMediaByUrl($removedUrl);
            }
        }
    }

    private function handleLegacyMedia(array $validated): void
    {
        // About Image
        $aboutSection = PageSection::where('page', 'home')->where('section_key', 'about')->first();
        if ($aboutSection && isset($aboutSection->content['image'])) {
            $old = $aboutSection->content['image'] ?? '';
            $new = $validated['about']['image'] ?? '';
            if ($old && $old !== $new) $this->deleteMediaByUrl($old);
        }

        // Partners Logos
        $partnersSection = PageSection::where('page', 'home')->where('section_key', 'partners')->first();
        if ($partnersSection && isset($partnersSection->content['logos'])) {
            $oldLogos = $partnersSection->content['logos'] ?? [];
            $newLogos = $validated['partners']['logos'] ?? [];
            $oldUrls = array_column($oldLogos, 'src');
            $newUrls = array_column($newLogos, 'src');
            $removedUrls = array_diff($oldUrls, $newUrls);
            foreach ($removedUrls as $removedUrl) $this->deleteMediaByUrl($removedUrl);
        }
    }

    private function getDefaultHero(): array
    {
        return [
            'carouselImages' => [],
            'splitLayoutImage' => '/images/hero/hero-uap.webp',
            'backgroundVideo' => '',
            'trustedByText' => 'Trusted by 100+ rentals',
            'showTrustedBy' => true,
            'trustedByAvatars' => [],
            'autoPlay' => true,
            'autoPlayInterval' => 5000,
            'showBadge' => true,
            'showScrollIndicator' => true,
            'showCarousel' => true,
            'showSplitLayoutImage' => true,
            'showOverlay' => true,
            'overlayOpacity' => 80,
            'contentMaxWidth' => '4xl',
            'heading' => 'Acoustic Engineering Excellence',
            'subheading' => 'Professional loudspeaker systems that deliver unparalleled clarity, precision, and power for the world\'s most demanding audio environments.',
            'showHeading' => true,
            'showSubheading' => true,
            'mobileHeading' => '',
            'mobileSubheading' => '',
            'showMobileHeading' => false,
            'showMobileSubheading' => false,
        ];
    }

    private function getDefaultStats(): array
    {
        return [
            'showStats' => true,
            'items' => [
                ['label' => "Tahun Pengalaman", 'value' => "10+"],
                ['label' => "Event Sukses", 'value' => "500+"],
                ['label' => "Klien Korporat & Instansi", 'value' => "200+"],
                ['label' => "Keandalan Teknis", 'value' => "100%"],
            ],
        ];
    }

    private function getDefaultServices(): array
    {
        return [
            'heading' => 'Solusi Audio Terintegrasi',
            'subheading' => 'Kami menyediakan lebih dari sekadar peralatan. PLS memberikan ketenangan pikiran melalui layanan teknis yang komprehensif.',
            'items' => [
                [
                    'title' => "Rental Sound System Premium",
                    'description' => "Sistem audio kelas dunia yang dikalibrasi presisi untuk kejernihan suara maksimal di setiap sudut venue.",
                    'icon' => "Speaker"
                ],
                [
                    'title' => "Corporate & Government Support",
                    'description' => "Layanan audio visual terintegrasi khusus untuk rapat umum, konferensi, pelantikan, dan gala dinner resmi.",
                    'icon' => "Users"
                ],
                [
                    'title' => "Event Skala Besar & Outdoor",
                    'description' => "Kapasitas daya dan cakupan audio luas untuk festival, gathering akbar, atau acara lapangan terbuka.",
                    'icon' => "Radio"
                ],
                [
                    'title' => "Lighting & Technical Production",
                    'description' => "Paket dukungan pencahayaan panggung dan tata teknis menyeluruh untuk estetika visual yang selaras.",
                    'icon' => "Settings"
                ],
                [
                    'title' => "Manpower & Audio Engineer",
                    'description' => "Operator berpengalaman dan teknisi bersertifikat yang memastikan kelancaran teknis dari awal hingga akhir.",
                    'icon' => "Mic2"
                ]
            ],
        ];
    }

    private function getDefaultWhyChoose(): array
    {
        return [
            'subtitle' => 'Mengapa PLS?',
            'heading' => 'Standar Tinggi untuk Acara Penting Anda.',
            'description' => 'Kami mengerti bahwa dalam event korporat dan kenegaraan, tidak ada ruang untuk kesalahan teknis. PLS hadir sebagai mitra teknis yang memprioritaskan detail dan kesempurnaan.',
            'image' => 'https://picsum.photos/id/431/800/1000',
            'quote' => '"Keberhasilan acara Anda adalah reputasi kami."',
            'items' => [
                [
                    'icon' => 'ShieldCheck',
                    'title' => "Tim Teknis Berpengalaman",
                    'text' => "Didukung oleh SDM yang memahami etika kerja profesional dan teknis audio mendalam."
                ],
                [
                    'icon' => 'CheckCircle2',
                    'title' => "Peralatan Terawat & Ready",
                    'text' => "Unit selalu melalui maintenance rutin. Kebersihan dan fungsi alat adalah prioritas kami."
                ],
                [
                    'icon' => 'Clock',
                    'title' => "Tepat Waktu & Rapi",
                    'text' => "Setup dilakukan jauh sebelum acara dimulai. Manajemen kabel yang rapi untuk estetika venue."
                ],
                [
                    'icon' => 'Activity',
                    'title' => "Monitoring Penuh",
                    'text' => "Standby operator selama acara berlangsung untuk antisipasi dan penanganan teknis instan."
                ]
            ],
        ];
    }

    private function getDefaultPortfolio(): array
    {
        return [
            'heading' => 'Pengalaman Nyata di Lapangan',
            'subheading' => 'Menangani berbagai skala acara dengan konsistensi kualitas, mulai dari ruang meeting eksklusif hingga panggung outdoor megah.',
            'items' => [
                [
                    'title' => "National Leadership Summit 2023",
                    'category' => "Corporate Conference",
                    'imageUrl' => "https://picsum.photos/id/449/800/600"
                ],
                [
                    'title' => "Gala Dinner BUMN",
                    'category' => "Gala & Awarding",
                    'imageUrl' => "https://picsum.photos/id/158/800/600"
                ],
                [
                    'title' => "Konser Outdoor City Festival",
                    'category' => "Live Music Production",
                    'imageUrl' => "https://picsum.photos/id/452/800/600"
                ],
            ],
        ];
    }

    private function getDefaultProcess(): array
    {
        return [
            'heading' => 'Alur Kerja Profesional',
            'subheading' => 'Proses sederhana untuk hasil maksimal tanpa kerumitan bagi Anda.',
            'items' => [
                [
                    'num' => "01",
                    'title' => "Konsultasi Kebutuhan",
                    'desc' => "Diskusikan detail acara, spesifikasi venue, dan target audiens Anda. Kami memberikan rekomendasi teknis yang efisien."
                ],
                [
                    'num' => "02",
                    'title' => "Perencanaan & Persiapan",
                    'desc' => "Tim kami menyusun skema layout audio dan loading list. Alat disiapkan dan dicek fungsi sebelum diberangkatkan."
                ],
                [
                    'num' => "03",
                    'title' => "Eksekusi & Dukungan",
                    'desc' => "Instalasi rapi tepat waktu, sound check mendetail, dan pendampingan teknis penuh selama acara berlangsung."
                ]
            ],
        ];
    }

    private function getDefaultTestimonials(): array
    {
        return [
            'heading' => 'Kepercayaan Klien',
            'items' => [
                [
                    'text' => "PLS memberikan standar audio yang sangat bersih. Tidak ada feedback, suara jernih di seluruh ballroom, dan timnya sangat kooperatif mengikuti rundown kami yang padat.",
                    'author' => "Budi Santoso",
                    'role' => "Head of Marketing",
                    'company' => "PT. Nusantara Jaya Tbk"
                ],
                [
                    'text' => "Ketepatan waktu saat loading barang sangat kami apresiasi. Setup rapi, kabel tidak berantakan, dan operator sangat responsif terhadap perubahan mendadak di lapangan.",
                    'author' => "Rina Wijaya",
                    'role' => "Event Director",
                    'company' => "Luxe Organizer Indonesia"
                ],
                [
                    'text' => "Solusi lighting dan sound yang diberikan membuat acara tahunan kementerian kami berjalan khidmat dan megah. Sangat direkomendasikan untuk event formal.",
                    'author' => "Drs. Hendra Kusuma",
                    'role' => "Kasubag Umum",
                    'company' => "Kementerian BUMN (Unit)"
                ]
            ],
        ];
    }

    private function getDefaultFinalCTA(): array
    {
        return [
            'heading' => 'Siap Wujudkan Event Berkelas?',
            'subheading' => 'Dapatkan penawaran terbaik dan konsultasi teknis gratis untuk kesuksesan acara Anda. Respon cepat dan profesional.',
            'buttonText' => 'Jadwalkan Konsultasi',
            'buttonLink' => 'https://wa.me/6282257289604',
            'phoneNumber' => '0822-5728-9604',
        ];
    }

    private function getDefaultFooter(): array
    {
        return [
            'brandName' => 'PLS',
            'brandSubtitle' => 'Rental Division',
            'description' => 'Mitra terpercaya penyewaan sound system dan produksi audio visual premium untuk kebutuhan korporat dan instansi.',
            'instagram' => '#',
            'linkedin' => '#',
            'contactPhone' => '0822-5728-9604',
            'contactEmail' => 'plsrental@yahoo.com',
            'contactAddress' => 'JL.Raya Kandangan . Kare . MADIUN - Jawa Timur.',
        ];
    }

    private function getDefaultAbout(): array
    {
        return [
            'tagline' => 'Acoustic Engineering Excellence',
            'heading' => 'We Design and Manufacture High-Performance Sound Reinforcement Systems',
            'paragraphs' => [
                'Our design philosophy is centered on acoustic engineering that delivers natural sound reproduction at the highest performance level.',
                'Every system is developed with the objective of achieving maximum resolution, realism, and an exceptional listening experience.',
            ],
            'image' => '',
            'imageAlt' => '',
            'imagePosition' => 'right',
            'imagePositionMobile' => 'bottom',
            'imageFlipHorizontal' => false,
        ];
    }

    /**
     * Delete media record by URL if it exists in the media library.
     */
    private function deleteMediaByUrl(string $url): void
    {
        // Only delete if URL is from media library (/storage/), not static files
        if (str_contains($url, '/storage/')) {
            // Extract path from URL (remove /storage/ prefix)
            $path = str_replace('/storage/', '', $url);
            $path = ltrim($path, '/');
            
            // Try to find media by exact path match first
            $media = Media::where('path', $path)->first();
            
            // If not found, try matching by filename
            if (!$media && !empty($path)) {
                $filename = basename($path);
                $media = Media::where('filename', $filename)->first();
            }
            
            // If found, delete media record (file will be deleted automatically by model event)
            if ($media) {
                $media->delete();
            }
        }
        // Note: Static files in public/images/ are not deleted automatically
        // as they may be intentionally placed there and not managed by the media system
    }

    private function getDefaultPartners(): array
    {
        return [
            'showPartners' => true,
            'logos' => [
                [
                    'src' => 'https://cdn.prod.website-files.com/5dca23595f1e4663d62cab0b/67ceb003cc34c81e63491b37_Mobbin_idHO6ZNvY__0%201.svg',
                    'alt' => 'Mobbin',
                    'href' => 'https://mobbin.com',
                ],
                [
                    'src' => 'https://cdn.prod.website-files.com/5dca23595f1e4663d62cab0b/67ceb003cc34c81e63491b3b_idgaNgeFw0_1739946667562%201.svg',
                    'alt' => 'Partner Company',
                    'href' => 'https://admin@uapsound.com',
                ],
                [
                    'src' => 'https://cdn.prod.website-files.com/5dca23595f1e4663d62cab0b/67ceb003cc34c81e63491b3a_Gojek%20Indonesia_Logo_0%201.svg',
                    'alt' => 'Gojek Indonesia',
                    'href' => 'https://www.gojek.com',
                ],
                [
                    'src' => 'https://cdn.prod.website-files.com/5dca23595f1e4663d62cab0b/67ceb003cc34c81e63491b38_TikTok_Logo_0%201.svg',
                    'alt' => 'TikTok',
                    'href' => 'https://www.tiktok.com',
                ],
                [
                    'src' => 'https://cdn.prod.website-files.com/5dca23595f1e4663d62cab0b/67ceb003cc34c81e63491b39_Grab_Logo_0%201.svg',
                    'alt' => 'Grab',
                    'href' => 'https://www.grab.com',
                ],
            ],
        ];
    }
}

