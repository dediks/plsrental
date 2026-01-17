@php
    $clients = $clients ?? [];
    
    // Default clients list if not provided
    $clientsList = !empty($clients['logos']) ? $clients['logos'] : [
        ['name' => 'Nusa Tekno', 'logo' => '/images/clients/nusa-tekno.svg'],
        ['name' => 'Bangun Karya', 'logo' => '/images/clients/bangun-karya.svg'],
        ['name' => 'Badan Publik Indonesia', 'logo' => '/images/clients/badan-publik.svg'],
        ['name' => 'Harmoni Mart', 'logo' => '/images/clients/harmoni-mart.svg'],
        ['name' => 'Modal Kilat', 'logo' => '/images/clients/modal-kilat.svg'],
        ['name' => 'Industri Maju', 'logo' => '/images/clients/industri-maju.svg'],
        ['name' => 'Sinyal Nusantara', 'logo' => '/images/clients/sinyal-nusantara.svg'],
        ['name' => 'Pesona Hotel & Resort', 'logo' => '/images/clients/pesona-hotel.svg'],
    ];
    
    $heading = $clients['heading'] ?? 'Dipercaya Oleh';
    $subheading = $clients['subheading'] ?? null;
@endphp

<section class="py-12 md:py-16 bg-gradient-to-b from-brand-dark via-brand-charcoal/30 to-brand-dark relative overflow-hidden">
    {{-- Subtle decorative glow --}}
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-brand-accent/5 to-transparent pointer-events-none"></div>
    
    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {{-- Horizontal Layout: Title Left, Marquee Right --}}
        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {{-- Left: Title Section --}}
            <div class="flex-shrink-0 md:w-44 lg:w-52 text-center md:text-left">
                <p class="text-brand-accent/70 uppercase tracking-[0.2em] text-xs font-medium mb-2">{{ $heading }}</p>
                <h3 class="text-white/60 text-xs md:text-sm font-light tracking-wide leading-relaxed">{{ $subheading }}</h3>
            </div>

            {{-- Right: Marquee Container --}}
            <div class="relative overflow-hidden flex-1">
                {{-- Gradient overlays --}}
                <div class="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-brand-charcoal/90 via-brand-charcoal/50 to-transparent z-10 pointer-events-none"></div>
                <div class="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-brand-charcoal/90 via-brand-charcoal/50 to-transparent z-10 pointer-events-none"></div>
                
                {{-- Marquee Track --}}
                <div class="flex items-center gap-12 md:gap-16 lg:gap-20 partner-marquee animate-marquee-slow">
                    {{-- First set of logos --}}
                    @foreach($clientsList as $client)
                        <div class="flex-shrink-0 w-32 md:w-40 lg:w-48 h-16 md:h-20 flex items-center justify-center transition-all duration-500 opacity-40 hover:opacity-100 hover:scale-105">
                            <div class="w-full h-full flex items-center justify-center">
                                @if(!empty($client['logo']))
                                    {{-- Display uploaded logo image --}}
                                    <img src="{{ $client['logo'] }}" alt="{{ $client['name'] }}" class="max-w-full max-h-full object-contain filter brightness-0 invert opacity-80" />
                                @else
                                    {{-- Fallback to text display --}}
                                    <svg class="w-full h-full" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
                                        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
                                              class="fill-white font-light tracking-widest" 
                                              style="font-size: 12px; font-family: 'Inter', sans-serif; letter-spacing: 0.08em;">
                                            {{ strtoupper($client['name']) }}
                                        </text>
                                    </svg>
                                @endif
                            </div>
                        </div>
                    @endforeach
                    
                    {{-- Duplicate set for seamless loop --}}
                    @foreach($clientsList as $client)
                        <div class="flex-shrink-0 w-32 md:w-40 lg:w-48 h-16 md:h-20 flex items-center justify-center transition-all duration-500 opacity-40 hover:opacity-100 hover:scale-105">
                            <div class="w-full h-full flex items-center justify-center">
                                @if(!empty($client['logo']))
                                    {{-- Display uploaded logo image --}}
                                    <img src="{{ $client['logo'] }}" alt="{{ $client['name'] }}" class="max-w-full max-h-full object-contain filter brightness-0 invert opacity-80" />
                                @else
                                    {{-- Fallback to text display --}}
                                    <svg class="w-full h-full" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
                                        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
                                              class="fill-white font-light tracking-widest" 
                                              style="font-size: 12px; font-family: 'Inter', sans-serif; letter-spacing: 0.08em;">
                                            {{ strtoupper($client['name']) }}
                                        </text>
                                    </svg>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    /* Marquee animation - smooth infinite scroll */
    @keyframes marquee-slow {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }

    .animate-marquee-slow {
        animation: marquee-slow 60s linear infinite;
    }

    /* Pause animation on hover */
    .partner-marquee:hover {
        animation-play-state: paused;
    }

    /* Ensure smooth animation */
    .partner-marquee {
        will-change: transform;
    }
</style>
