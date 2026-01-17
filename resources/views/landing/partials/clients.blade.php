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
            <div id="clients-scroll-container" class="relative overflow-x-auto flex-1 w-full min-w-0 no-scrollbar group" style="scrollbar-width: none; -ms-overflow-style: none;">
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
        const track = document.getElementById('clients-track');
        if (!container || !track) return;

        // Animation state
        const scrollSpeed = 0.8;
        let isPaused = false;
        let isDragging = false;
        let isTouching = false;
        let animationId = null;
        let startX = 0;
        let scrollLeftStart = 0;
        let resumeTimeout = null;
        let singleSetWidth = 0;

        // Calculate single set width (we have 6 duplicated sets)
        const totalSets = 6;
        
        function calculateDimensions() {
            // Force layout recalculation
            singleSetWidth = track.scrollWidth / totalSets;
        }

        // Core animation function
        function animate() {
            if (!isPaused && !isDragging && !isTouching && singleSetWidth > 0) {
                container.scrollLeft += scrollSpeed;
                
                // Seamless loop: when we've scrolled past one set, jump back
                if (container.scrollLeft >= singleSetWidth) {
                    container.scrollLeft -= singleSetWidth;
                }
            }
            animationId = requestAnimationFrame(animate);
        }

        // Start/stop animation helpers
        function startAnimation() {
            if (animationId === null) {
                calculateDimensions();
                animationId = requestAnimationFrame(animate);
            }
        }

        function stopAnimation() {
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }

        function pause() {
            isPaused = true;
            if (resumeTimeout) {
                clearTimeout(resumeTimeout);
                resumeTimeout = null;
            }
        }

        function resume(delay = 0) {
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                if (!isDragging && !isTouching) {
                    isPaused = false;
                }
            }, delay);
        }

        // --- Hover Events (desktop only) ---
        container.addEventListener('mouseenter', () => {
            if (!isDragging && !isTouching) pause();
        });

        container.addEventListener('mouseleave', () => {
            if (!isDragging && !isTouching) resume(100);
        });

        // --- Touch Events (mobile) ---
        container.addEventListener('touchstart', (e) => {
            isTouching = true;
            pause();
            if (e.touches.length > 0) {
                startX = e.touches[0].pageX;
                scrollLeftStart = container.scrollLeft;
            }
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!isTouching || e.touches.length === 0) return;
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 1.2;
            container.scrollLeft = scrollLeftStart - walk;
        }, { passive: true });

        container.addEventListener('touchend', () => {
            isTouching = false;
            resume(1500);
        }, { passive: true });

        // --- Mouse Drag (desktop) ---
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            pause();
            startX = e.pageX;
            scrollLeftStart = container.scrollLeft;
            container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = (x - startX) * 1.5;
            container.scrollLeft = scrollLeftStart - walk;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'grab';
                resume(500);
            }
        });

        // --- Wheel scroll (convert vertical to horizontal) ---
        container.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            e.preventDefault();
            container.scrollLeft += e.deltaY;
            pause();
            resume(1500);
        }, { passive: false });

        // --- Handle resize ---
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                calculateDimensions();
            }, 200);
        });

        // --- Initialize with delay to ensure DOM is ready ---
        setTimeout(() => {
            container.scrollLeft = 0;
            calculateDimensions();
            startAnimation();
        }, 100);
    });
</script>
