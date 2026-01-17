@php
    $clients = $clients ?? [];
    
    // Default clients list if not provided
    $clientsList = !empty($clients['logos']) ? $clients['logos'] : [
        ['name' => 'UAProfessional', 'logo' => '/images/clients/nusa-tekno.svg'],
    ];
    
    $heading = $clients['heading'] ?? 'Dipercaya Oleh';
    $subheading = $clients['subheading'] ?? null;
@endphp

@if($clients['showClients'] ?? false)
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
            <div id="clients-scroll-container" class="relative overflow-x-auto flex-1 no-scrollbar group" style="scrollbar-width: none; -ms-overflow-style: none;">
                <style>
                    #clients-scroll-container::-webkit-scrollbar {
                        display: none;
                    }
                </style>
                {{-- Gradient overlays --}}
                <div class="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-brand-charcoal/90 via-brand-charcoal/50 to-transparent z-10 pointer-events-none"></div>
                <div class="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-brand-charcoal/90 via-brand-charcoal/50 to-transparent z-10 pointer-events-none"></div>
                
                {{-- Marquee Track --}}
                <div class="flex items-center gap-12 md:gap-16 lg:gap-20 w-max px-4 cursor-grab active:cursor-grabbing" id="clients-track">
                    {{-- Generate multiple sets for seamless infinite scrolling on large screens --}}
                    @for ($i = 0; $i < 6; $i++)
                        @foreach($clientsList as $client)
                            <div class="flex-shrink-0 w-32 md:w-40 lg:w-48 h-16 md:h-20 flex items-center justify-center transition-all duration-500 opacity-40 hover:opacity-100 hover:scale-105 select-none">
                                <div class="w-full h-full flex items-center justify-center pointer-events-none">
                                    @if(!empty($client['logo']))
                                        {{-- Display uploaded logo image --}}
                                        <img src="{{ $client['logo'] }}" alt="{{ $client['name'] }}" class="max-w-full max-h-full object-contain opacity-80" />
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
                    @endfor
                </div>
            </div>
        </div>
    </div>
</section>
@endif

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('clients-scroll-container');
        if (!container) return;

        let scrollSpeed = 0.5;
        let isPaused = false;
        let isDown = false;
        let startX;
        let scrollLeft;
        let animationId;

        // --- Mouse Drag Logic ---
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            isPaused = true;
            container.classList.add('active:cursor-grabbing');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            cancelAnimationFrame(animationId); // Stop auto-scroll immediately
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            isPaused = false;
            requestAnimationFrame(autoScroll); // Resume
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            // Delay resume slightly key for UX
            setTimeout(() => {
                if (!isDown) {
                    isPaused = false;
                    requestAnimationFrame(autoScroll); 
                }
            }, 500);
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            container.scrollLeft = scrollLeft - walk;
        });

        // --- Touch Logic ---
        container.addEventListener('touchstart', () => {
            isPaused = true;
            cancelAnimationFrame(animationId);
        }, { passive: true });
        
        container.addEventListener('touchend', () => {
            setTimeout(() => {
                isPaused = false;
                requestAnimationFrame(autoScroll);
            }, 1000);
        });

        // --- Hover Pause ---
        container.addEventListener('mouseenter', () => {
            if (!isDown) isPaused = true;
        });

        // --- Infinite Scroll Logic ---
        function autoScroll() {
            if (!isPaused && !isDown) {
                // We have 6 sets. Reset when we pass the first set.
                // Estimating single set width based on total scrollWidth
                const totalSets = 6;
                const singleSetWidth = container.scrollWidth / totalSets;

                if (container.scrollLeft >= singleSetWidth) {
                    // Seamlessly jump back
                    container.scrollLeft -= singleSetWidth;
                } else {
                    container.scrollLeft += scrollSpeed;
                }
            }
            animationId = requestAnimationFrame(autoScroll);
        }

        // Initialize
        container.scrollLeft = 0;
        animationId = requestAnimationFrame(autoScroll);
    });
</script>
