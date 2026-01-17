@php
    $heading = $services['heading'] ?? "Solusi Audio Terintegrasi";
    $subheading = $services['subheading'] ?? "Kami menyediakan lebih dari sekadar peralatan. PLS memberikan ketenangan pikiran melalui layanan teknis yang komprehensif.";
    $items = $services['items'] ?? [];

    if (empty($items)) {
        $items = [
            [
                'id' => 1,
                'title' => "Rental Sound System Premium",
                'description' => "Sistem audio kelas dunia yang dikalibrasi presisi untuk kejernihan suara maksimal di setiap sudut venue.",
                'icon' => "Speaker"
            ],
            [
                'id' => 2,
                'title' => "Corporate & Government Support",
                'description' => "Layanan audio visual terintegrasi khusus untuk rapat umum, konferensi, pelantikan, dan gala dinner resmi.",
                'icon' => "Users"
            ],
            [
                'id' => 3,
                'title' => "Event Skala Besar & Outdoor",
                'description' => "Kapasitas daya dan cakupan audio luas untuk festival, gathering akbar, atau acara lapangan terbuka.",
                'icon' => "Radio"
            ],
            [
                'id' => 4,
                'title' => "Lighting & Technical Production",
                'description' => "Paket dukungan pencahayaan panggung dan tata teknis menyeluruh untuk estetika visual yang selaras.",
                'icon' => "Settings"
            ],
            [
                'id' => 5,
                'title' => "Manpower & Audio Engineer",
                'description' => "Operator berpengalaman dan teknisi bersertifikat yang memastikan kelancaran teknis dari awal hingga akhir.",
                'icon' => "Mic2"
            ]
        ];
    }
@endphp

<section id="services" class="py-24 bg-brand-dark relative">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div class="md:text-left max-w-2xl">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">{{ $heading }}</h2>
                <p class="text-neutral-300 text-lg">
                    {{ $subheading }}
                </p>
            </div>
            
            {{-- Search bar commented out in original React --}}
        </div>

        @if(count($items) > 0)
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                @foreach($items as $index => $service)
                    <div class="group p-8 bg-brand-charcoal border border-brand-accent/20 hover:border-brand-accent/50 transition-all duration-300 rounded-sm hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)] animate-fade-in-up" style="animation-delay: {{ $index * 100 }}ms">
                        <div class="w-12 h-12 bg-brand-gray rounded-sm flex items-center justify-center mb-6 text-brand-accent-light group-hover:bg-brand-accent group-hover:text-brand-dark transition-colors">
                            @switch($service['icon'])
                                @case('Mic2')
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic-2"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><path d="m19 15 2 2"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>
                                    @break
                                @case('Users')
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    @break
                                @case('Settings')
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                                    @break
                                @case('Radio')
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-radio"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>
                                    @break
                                @case('Speaker')
                                @default
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-speaker"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M12 6h.01"/><circle cx="12" cy="14" r="4"/><path d="M12 14h.01"/></svg>
                            @endswitch
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-3">{{ $service['title'] }}</h3>
                        <p class="text-neutral-300 leading-relaxed text-sm">{{ $service['description'] }}</p>
                    </div>
                @endforeach
            </div>
        @else
            <div class="text-center py-16 bg-brand-charcoal/30 border border-white/5 rounded-sm">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800 text-neutral-500 mb-4">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <p class="text-neutral-400 text-lg mb-2">Tidak ada layanan ditemukan</p>
                <p class="text-neutral-500 text-sm mb-6">Coba kata kunci lain atau reset pencarian Anda.</p>
            </div>
        @endif
    </div>
</section>
