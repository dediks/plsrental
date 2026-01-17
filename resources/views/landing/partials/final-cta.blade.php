@php
    $heading = $finalCTA['heading'] ?? "Siap Wujudkan Event Berkelas?";
    $subheading = $finalCTA['subheading'] ?? "Dapatkan penawaran terbaik dan konsultasi teknis gratis untuk kesuksesan acara Anda. Respon cepat dan profesional.";
    $buttonText = $finalCTA['buttonText'] ?? "Konsultasi Sekarang";
    $buttonLink = $finalCTA['buttonLink'] ?? "https://wa.me/6282257289604";
    $phoneNumber = $finalCTA['phoneNumber'] ?? "0822-5728-9604";
@endphp

<section id="contact" class="py-24 bg-brand-accent relative overflow-hidden">
    {{-- Pattern Overlay --}}
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
    
    <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-5xl font-bold text-brand-dark mb-6">
            {{ $heading }}
        </h2>
        <p class="text-brand-dark/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
            {{ $subheading }}
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
                href="{{ $buttonLink }}" 
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-brand-dark hover:bg-brand-charcoal transition-all rounded-sm shadow-[0_10px_40px_rgba(10,22,40,0.3)] hover:shadow-[0_15px_50px_rgba(10,22,40,0.5)] hover:-translate-y-1"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square mr-3 h-5 w-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {{ $buttonText }}
            </a>
        </div>
        <p class="mt-6 text-sm text-brand-dark/60 font-medium">
            Hubungi kami: {{ $phoneNumber }} (WhatsApp/Call)
        </p>
    </div>
</section>
