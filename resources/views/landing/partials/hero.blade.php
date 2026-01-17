@php
    $heading = $hero['heading'] ?? "Kualitas Suara Tanpa Kompromi.";
    $subheading = $hero['subheading'] ?? "PLS menghadirkan solusi sound system premium dengan standar eksekusi tinggi untuk event korporat, instansi pemerintah, dan produksi skala besar. Tenang, rapi, dan profesional.";
    $backgroundImage = $hero['backgroundImage'] ?? null;
    $badgeText = $hero['badgeText'] ?? "Professional Audio Production";
@endphp

<section class="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
    {{-- Background Image with Overlay --}}
    @if($backgroundImage)
        <div class="absolute inset-0 z-0">
            <img
                src="{{ $backgroundImage }}"
                alt="Premium Event Audio Setup"
                class="w-full h-full object-cover opacity-40 grayscale"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/30"></div>
        </div>
    @endif

    {{-- Content --}}
    <div class="relative lg:flex-1 z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left pt-20">
        <div class="max-w-3xl animate-fade-in-up">
            <div class="inline-block px-3 py-1 mb-6 border border-brand-gold/30 rounded-full bg-brand-gold/10 backdrop-blur-sm">
                <span class="text-xs font-semibold tracking-wider text-brand-gold uppercase">{{ $badgeText }}</span>
            </div>
            
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
                {{ $heading }}
            </h1>
            
            <p class="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl leading-relaxed font-light">
                {{ $subheading }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                    href="#contact"
                    class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-brand-gold hover:bg-yellow-600 transition-all rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]"
                >
                    Konsultasi Sekarang
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right ml-2 h-5 w-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
                <a
                    href="#portfolio"
                    class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-neutral-300 border border-neutral-700 hover:text-white hover:border-white transition-all rounded-sm bg-transparent"
                >
                    Lihat Portfolio
                </a>
            </div>
        </div>
    </div>
</section>
