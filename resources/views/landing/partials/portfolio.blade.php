@php
    $heading = $portfolio['heading'] ?? "Pengalaman Nyata di Lapangan";
    $subheading = $portfolio['subheading'] ?? "Menangani berbagai skala acara dengan konsistensi kualitas, mulai dari ruang meeting eksklusif hingga panggung outdoor megah.";
    $items = $portfolio['items'] ?? [];

    if (empty($items)) {
        $items = [
            [
                'id' => 1,
                'title' => "National Leadership Summit 2023",
                'category' => "Corporate Conference",
                'imageUrl' => "https://picsum.photos/id/449/800/600"
            ],
            [
                'id' => 2,
                'title' => "Gala Dinner BUMN",
                'category' => "Gala & Awarding",
                'imageUrl' => "https://picsum.photos/id/158/800/600"
            ],
            [
                'id' => 3,
                'title' => "Konser Outdoor City Festival",
                'category' => "Live Music Production",
                'imageUrl' => "https://picsum.photos/id/452/800/600"
            ],
        ];
    }
@endphp

<section id="portfolio" class="py-24 bg-brand-dark">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row justify-between items-end mb-12">
            <div class="max-w-xl">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ $heading }}</h2>
                <p class="text-neutral-300">
                    {{ $subheading }}
                </p>
            </div>
            <a href="/portfolio" class="hidden md:flex items-center text-brand-accent-light hover:text-brand-accent transition-colors font-medium mt-6 md:mt-0">
                Lihat Pengalaman Kami 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right ml-2 w-4 h-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @foreach($items as $index => $item)
                <div class="group relative overflow-hidden rounded-sm cursor-pointer animate-fade-in-up" style="animation-delay: {{ $index * 100 }}ms">
                    <div class="aspect-[4/3] w-full bg-neutral-800">
                        @php
                            $itemSrcset = $item['srcset'] ?? '';
                        @endphp
                        <img 
                            src="{{ $item['imageUrl'] }}" 
                            @if($itemSrcset)
                            srcset="{{ $itemSrcset }}"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 400px"
                            @endif
                            alt="{{ $item['title'] }}" 
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        />
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <span class="text-brand-accent-light text-xs font-semibold uppercase tracking-wider mb-2">{{ $item['category'] }}</span>
                        <h3 class="text-white text-xl font-bold">{{ $item['title'] }}</h3>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="mt-8 md:hidden text-center">
           <a href="#contact" class="inline-flex items-center text-brand-accent-light hover:text-brand-accent font-medium">
            Lihat Pengalaman Kami 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right ml-2 w-4 h-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
    </div>
</section>
