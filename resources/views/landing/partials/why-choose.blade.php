@php
    $subtitle = $whyChoose['subtitle'] ?? "Mengapa PLS?";
    $heading = $whyChoose['heading'] ?? "Standar Tinggi untuk Acara Penting Anda.";
    $description = $whyChoose['description'] ?? "Kami mengerti bahwa dalam event korporat dan kenegaraan, tidak ada ruang untuk kesalahan teknis. PLS hadir sebagai mitra teknis yang memprioritaskan detail dan kesempurnaan.";
    $image = $whyChoose['image'] ?? "https://picsum.photos/id/431/800/1000";
    $quote = $whyChoose['quote'] ?? "\"Keberhasilan acara Anda adalah reputasi kami.\"";
    $items = $whyChoose['items'] ?? [];

    if (empty($items)) {
        $items = [
            [
                'icon' => "ShieldCheck",
                'title' => "Tim Teknis Berpengalaman",
                'text' => "Didukung oleh SDM yang memahami etika kerja profesional dan teknis audio mendalam."
            ],
            [
                'icon' => "CheckCircle2",
                'title' => "Peralatan Terawat & Ready",
                'text' => "Unit selalu melalui maintenance rutin. Kebersihan dan fungsi alat adalah prioritas kami."
            ],
            [
                'icon' => "Clock",
                'title' => "Tepat Waktu & Rapi",
                'text' => "Setup dilakukan jauh sebelum acara dimulai. Manajemen kabel yang rapi untuk estetika venue."
            ],
            [
                'icon' => "Activity",
                'title' => "Monitoring Penuh",
                'text' => "Standby operator selama acara berlangsung untuk antisipasi dan penanganan teknis instan."
            ]
        ];
    }
@endphp

<section id="why-us" class="py-24 bg-brand-navy-light border-t border-brand-accent/20">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {{-- Text Content --}}
            <div>
                <span class="text-brand-accent-light font-semibold tracking-wider text-sm uppercase">{{ $subtitle }}</span>
                <h2 class="text-3xl md:text-5xl font-bold text-white mt-3 mb-8">{{ $heading }}</h2>
                <p class="text-neutral-300 text-lg mb-10 leading-relaxed">
                    {{ $description }}
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                    @foreach($items as $reason)
                        <div class="flex flex-col">
                            <div class="flex items-center mb-3 text-white font-semibold text-lg">
                                <div class="text-brand-accent-light mr-3 h-5 w-5">
                                    @switch($reason['icon'])
                                        @case('ShieldCheck')
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                                            @break
                                        @case('CheckCircle2')
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                                            @break
                                        @case('Clock')
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                            @break
                                        @case('Activity')
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                                            @break
                                        @default
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                                    @endswitch
                                </div>
                                {{ $reason['title'] }}
                            </div>
                            <p class="text-sm text-neutral-400 pl-8 leading-relaxed">
                                {{ $reason['text'] }}
                            </p>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Image/Visual --}}
            <div class="relative h-[350px] md:h-[450px] lg:h-[500px] -mx-6 lg:mx-0 w-[calc(100%+3rem)] lg:w-full bg-neutral-800 rounded-none lg:rounded-sm overflow-hidden">
                @php
                    $srcset = $whyChoose['srcset'] ?? '';
                @endphp
                <img 
                    src="{{ $image }}"
                    @if($srcset)
                    srcset="{{ $srcset }}"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                    @endif
                    alt="Sound Engineer Working" 
                    class="w-full h-full object-cover object-center opacity-100"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
                    <div class="border-l-4 border-brand-accent-light pl-6">
                        <p class="text-white text-xl font-medium italic">{{ $quote }}</p>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</section>
