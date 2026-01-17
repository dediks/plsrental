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
                class="w-full h-full object-cover opacity-80 grayscale"
            />
            <div class="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-charcoal/90 to-brand-navy-light/40"></div>
        </div>
    @endif

    {{-- Content --}}
    <div class="relative lg:flex-1 z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left pt-20">
        <div class="max-w-3xl animate-fade-in-up">
            <div class="inline-block px-3 py-1 mb-6 border border-brand-accent/40 rounded-full bg-brand-accent/15 backdrop-blur-sm">
                <span class="text-xs font-semibold tracking-wider text-brand-accent-light uppercase">{{ $badgeText }}</span>
            </div>
            
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
                {{ $heading }}
            </h1>
            
            <p class="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl leading-relaxed font-light">
                {{ $subheading }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                    href="#contact"
                    class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-brand-dark bg-brand-accent hover:bg-brand-accent-light transition-all rounded-sm shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="mr-2 h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    Konsultasi Sekarang
                </a>
                <a
                    href="#portfolio"
                    class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-neutral-200 border border-brand-accent/50 hover:text-white hover:border-brand-accent hover:bg-brand-accent/10 transition-all rounded-sm bg-transparent"
                >
                    Lihat Portfolio
                </a>
            </div>
        </div>
    </div>
</section>
