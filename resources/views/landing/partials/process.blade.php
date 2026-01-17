@php
    $heading = $process['heading'] ?? "Alur Kerja Profesional";
    $subheading = $process['subheading'] ?? "Proses sederhana untuk hasil maksimal tanpa kerumitan bagi Anda.";
    $items = $process['items'] ?? [];

    if (empty($items)) {
        $items = [
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
            ],
        ];
    }
@endphp

<section class="py-20 bg-brand-charcoal border-y border-white/5">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-white mb-4">{{ $heading }}</h2>
            <p class="text-neutral-400">{{ $subheading }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {{-- Connector Line (Desktop) --}}
            <div class="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-white/10 -z-0"></div>

            @foreach($items as $step)
                <div class="relative z-10 flex flex-col items-center text-center">
                    <div class="w-24 h-24 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-3xl font-bold text-brand-accent mb-6 shadow-xl">
                        {{ $step['num'] }}
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-3">{{ $step['title'] }}</h3>
                    <p class="text-neutral-400 text-sm leading-relaxed max-w-xs">{{ $step['desc'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
