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
    // Hero Section
    public function editHero()
    {
        $section = PageSection::where('page', 'home')
            ->where('section_key', 'hero')
            ->first();

        return Inertia::render('admin/home/Hero', [
            'hero' => $section?->content ?? $this->getDefaultHero(),
        ]);
    }

    public function updateHero(Request $request)
    {
        $validated = $request->validate([
            'hero.heading' => 'nullable|string',
            'hero.subheading' => 'nullable|string',
            'hero.badgeText' => 'nullable|string',
            'hero.carouselImages' => 'nullable|array',
            'hero.backgroundImage' => 'nullable|string',
            'hero.splitLayoutImage' => 'nullable|string',
            'hero.backgroundVideo' => 'nullable|string',
            'hero.trustedByText' => 'nullable|string',
            'hero.showTrustedBy' => 'nullable|boolean',
            'hero.trustedByAvatars' => 'nullable|array',
            'hero.autoPlay' => 'nullable|boolean',
            'hero.autoPlayInterval' => 'nullable|integer',
            'hero.showBadge' => 'nullable|boolean',
            'hero.showScrollIndicator' => 'nullable|boolean',
            'hero.showCarousel' => 'nullable|boolean',
            'hero.showSplitLayoutImage' => 'nullable|boolean',
            'hero.showOverlay' => 'nullable|boolean',
            'hero.overlayOpacity' => 'nullable|integer',
            'hero.contentMaxWidth' => 'nullable|string',
            'hero.showHeading' => 'nullable|boolean',
            'hero.showSubheading' => 'nullable|boolean',
            'hero.mobileHeading' => 'nullable|string',
            'hero.mobileSubheading' => 'nullable|string',
            'hero.showMobileHeading' => 'nullable|boolean',
            'hero.showMobileSubheading' => 'nullable|boolean',
        ]);

        $this->handleHeroMedia($validated);

        PageSection::updateOrCreate(
            ['page' => 'home', 'section_key' => 'hero'],
            ['content' => $validated['hero'], 'is_enabled' => true]
        );

        return redirect()->route('admin.home.hero.edit')
            ->with('success', 'Hero section updated successfully.');
    }

    // Stats Section
    public function editStats()
    {
        $section = PageSection::where('page', 'home')
            ->where('section_key', 'stats')
            ->first();

        return Inertia::render('admin/home/Stats', [
            'stats' => $section?->content ?? $this->getDefaultStats(),
        ]);
    }

    public function updateStats(Request $request)
    {
        $validated = $request->validate([
            'stats.showStats' => 'nullable|boolean',
            'stats.items' => 'nullable|array',
            'stats.items.*.label' => 'nullable|string',
            'stats.items.*.value' => 'nullable|string',
        ]);

        PageSection::updateOrCreate(
            ['page' => 'home', 'section_key' => 'stats'],
            ['content' => $validated['stats'], 'is_enabled' => true]
        );

        return redirect()->route('admin.home.stats.edit')
            ->with('success', 'Stats section updated successfully.');
    }

    // Clients Section
    public function editClients()
    {
        $section = PageSection::where('page', 'home')
            ->where('section_key', 'clients')
            ->first();

        return Inertia::render('admin/home/Clients', [
            'clients' => $section?->content ?? $this->getDefaultClients(),
        ]);
    }

    public function updateClients(Request $request)
    {
        $validated = $request->validate([
            'clients.showClients' => 'nullable|boolean',
            'clients.heading' => 'nullable|string|max:100',
            'clients.subheading' => 'nullable|string|max:200',
            'clients.logos' => 'nullable|array|max:20',
            'clients.logos.*.name' => 'required|string|max:100',
            'clients.logos.*.logo' => 'nullable|string|max:500',
        ], [
            'clients.logos.*.name.required' => 'Client name is required',
            'clients.logos.*.name.max' => 'Client name must not exceed 100 characters',
            'clients.logos.*.logo.max' => 'Logo URL must not exceed 500 characters',
            'clients.logos.max' => 'Maximum 20 clients allowed',
        ]);

        $this->handleClientsMedia($validated);

        PageSection::updateOrCreate(
            ['page' => 'home', 'section_key' => 'clients'],
            ['content' => $validated['clients'], 'is_enabled' => true]
        );

        return redirect()->route('admin.home.clients.edit')
            ->with('success', 'Clients section updated successfully.');
    }

    // Services Section
    public function editServices()
    {
        $section = PageSection::where('page', 'home')
            ->where('section_key', 'services')
            ->first();

        return Inertia::render('admin/home/Services', [
            'services' => $section?->content ?? $this->getDefaultServices(),
        ]);
    }

    public function updateServices(Request $request)
    {
        $validated = $request->validate([
            'services.heading' => 'nullable|string',
            'services.subheading' => 'nullable|string',
            'services.items' => 'nullable|array',
            'services.items.*.title' => 'nullable|string',
            'services.items.*.description' => 'nullable|string',
            'services.items.*.icon' => 'nullable|string',
        ]);

        PageSection::updateOrCreate(
            ['page' => 'home', 'section_key' => 'services'],
            ['content' => $validated['services'], 'is_enabled' => true]
        );

        return redirect()->route('admin.home.services.edit')
            ->with('success', 'Services section updated successfully.');
    }

    // Why Choose Section
    public function editWhyChoose()
    {
        $section = PageSection::where('page', 'home')
            ->where('section_key', 'whyChoose')
            ->first();

        return Inertia::render('admin/home/WhyChoose', [
            'whyChoose' => $section?->content ?? $this->getDefaultWhyChoose(),
        ]);
    }

    public function updateWhyChoose(Request $request)
    {
        $validated = $request->validate([
            'whyChoose.subtitle' => 'nullable|string',
            'whyChoose.heading' => 'nullable|string',
            'whyChoose.description' => 'nullable|string',
            'whyChoose.quote' => 'nullable|string',
            'whyChoose.image' => 'nullable|string',
            'whyChoose.items' => 'nullable|array',
            'whyChoose.items.*.title' => 'nullable|string',
            'whyChoose.items.*.text' => 'nullable|string',
            'whyChoose.items.*.icon' => 'nullable|string',
        ]);

        $this->handleWhyChooseMedia($validated);

        PageSection::updateOrCreate(
            ['page' => 'home', 'section_key' => 'whyChoose'],
            ['content' => $validated['whyChoose'], 'is_enabled' => true]
        );

        return redirect()->route('admin.home.why-choose.edit')
            ->with('success', 'Why Choose section updated successfully.');
    }

    // Portfolio Section
    public function editPortfolio()
    {
        $section = PageSection::where('page', 'home')
            ->where('section_key', 'portfolio')
            ->first();

        return Inertia::render('admin/home/Portfolio', [
            'portfolio' => $section?->content ?? $this->getDefaultPortfolio(),
        ]);
    }

    public function updatePortfolio(Request $request)
    {
        $validated = $request->validate([
            'portfolio.heading' => 'nullable|string',
            'portfolio.subheading' => 'nullable|string',
            'portfolio.items' => 'nullable|array',
            'portfolio.items.*.title' => 'nullable|string',
            'portfolio.items.*.category' => 'nullable|string',
            'portfolio.items.*.imageUrl' => 'nullable|string',
        ]);

        $this->handlePortfolioMedia($validated);

        PageSection::updateOrCreate(
            ['page' => 'home', 'section_key' => 'portfolio'],
            ['content' => $validated['portfolio'], 'is_enabled' => true]
        );

        return redirect()->route('admin.home.portfolio.edit')
            ->with('success', 'Portfolio section updated successfully.');
    }

    // Process Section
    public function editProcess()
    {
        $section = PageSection::where('page', 'home')
            ->where('section_key', 'process')
            ->first();

        return Inertia::render('admin/home/Process', [
            'process' => $section?->content ?? $this->getDefaultProcess(),
        ]);
    }

    public function updateProcess(Request $request)
    {
        $validated = $request->validate([
            'process.heading' => 'nullable|string',
            'process.subheading' => 'nullable|string',
            'process.items' => 'nullable|array',
            'process.items.*.num' => 'nullable|string',
            'process.items.*.title' => 'nullable|string',
            'process.items.*.desc' => 'nullable|string',
        ]);

        PageSection::updateOrCreate(
            ['page' => 'home', 'section_key' => 'process'],
            ['content' => $validated['process'], 'is_enabled' => true]
        );

        return redirect()->route('admin.home.process.edit')
            ->with('success', 'Process section updated successfully.');
    }

    // Testimonials Section
    public function editTestimonials()
    {
        $section = PageSection::where('page', 'home')
            ->where('section_key', 'testimonials')
            ->first();

        return Inertia::render('admin/home/Testimonials', [
            'testimonials' => $section?->content ?? $this->getDefaultTestimonials(),
        ]);
    }

    public function updateTestimonials(Request $request)
    {
        $validated = $request->validate([
            'testimonials.heading' => 'nullable|string',
            'testimonials.items' => 'nullable|array',
            'testimonials.items.*.text' => 'nullable|string',
            'testimonials.items.*.author' => 'nullable|string',
            'testimonials.items.*.role' => 'nullable|string',
            'testimonials.items.*.company' => 'nullable|string',
        ]);

        PageSection::updateOrCreate(
            ['page' => 'home', 'section_key' => 'testimonials'],
            ['content' => $validated['testimonials'], 'is_enabled' => true]
        );

        return redirect()->route('admin.home.testimonials.edit')
            ->with('success', 'Testimonials section updated successfully.');
    }

    // Final CTA Section
    public function editFinalCTA()
    {
        $section = PageSection::where('page', 'home')
            ->where('section_key', 'finalCTA')
            ->first();

        return Inertia::render('admin/home/FinalCTA', [
            'finalCTA' => $section?->content ?? $this->getDefaultFinalCTA(),
        ]);
    }

    public function updateFinalCTA(Request $request)
    {
        $validated = $request->validate([
            'finalCTA.heading' => 'nullable|string',
            'finalCTA.subheading' => 'nullable|string',
            'finalCTA.buttonText' => 'nullable|string',
            'finalCTA.buttonLink' => 'nullable|string',
            'finalCTA.phoneNumber' => 'nullable|string',
        ]);

        PageSection::updateOrCreate(
            ['page' => 'home', 'section_key' => 'finalCTA'],
            ['content' => $validated['finalCTA'], 'is_enabled' => true]
        );

        return redirect()->route('admin.home.final-cta.edit')
            ->with('success', 'Final CTA section updated successfully.');
    }

    // Footer Section
    public function editFooter()
    {
        $section = PageSection::where('page', 'home')
            ->where('section_key', 'footer')
            ->first();

        return Inertia::render('admin/home/Footer', [
            'footer' => $section?->content ?? $this->getDefaultFooter(),
        ]);
    }

    public function updateFooter(Request $request)
    {
        $validated = $request->validate([
            'footer.brandName' => 'nullable|string',
            'footer.brandSubtitle' => 'nullable|string',
            'footer.description' => 'nullable|string',
            'footer.instagram' => 'nullable|string',
            'footer.linkedin' => 'nullable|string',
            'footer.contactPhone' => 'nullable|string',
            'footer.contactEmail' => 'nullable|string',
            'footer.contactAddress' => 'nullable|string',
        ]);

        PageSection::updateOrCreate(
            ['page' => 'home', 'section_key' => 'footer'],
            ['content' => $validated['footer'], 'is_enabled' => true]
        );

        return redirect()->route('admin.home.footer.edit')
            ->with('success', 'Footer section updated successfully.');
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

        // Background Image
        if (isset($heroSection->content['backgroundImage'])) {
            $old = $heroSection->content['backgroundImage'] ?? '';
            $new = $validated['hero']['backgroundImage'] ?? '';
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

    private function handleClientsMedia(array $validated): void
    {
        $section = PageSection::where('page', 'home')->where('section_key', 'clients')->first();
        if (!$section) return;

        if (isset($section->content['logos']) && isset($validated['clients']['logos'])) {
            $oldLogos = $section->content['logos'] ?? [];
            $newLogos = $validated['clients']['logos'] ?? [];
            
            $oldUrls = array_column($oldLogos, 'logo');
            $newUrls = array_column($newLogos, 'logo');
            
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
            'heading' => 'Premium Sound for Remarkable Events',
            'subheading' => 'Professional loudspeaker systems that deliver unparalleled clarity, precision, and power for the world\'s most demanding audio environments.',
            'backgroundImage' => '',
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

    private function getDefaultClients(): array
    {
        return [
            'showClients' => true,
            'heading' => 'Dipercaya Oleh',
            'subheading' => 'Klien Korporat & Instansi Terkemuka',
            'logos' => [
                ['name' => 'Nusa Tekno', 'logo' => ''],
                ['name' => 'Bangun Karya', 'logo' => ''],
                ['name' => 'Badan Publik Indonesia', 'logo' => ''],
                ['name' => 'Harmoni Mart', 'logo' => ''],
                ['name' => 'Modal Kilat', 'logo' => ''],
                ['name' => 'Industri Maju', 'logo' => ''],
                ['name' => 'Sinyal Nusantara', 'logo' => ''],
                ['name' => 'Pesona Hotel & Resort', 'logo' => ''],
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
            'buttonText' => 'Konsultasi Sekarang',
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
}

