@php
    $isHome = request()->routeIs('home');
    $navLinks = [
        ['name' => 'Layanan', 'href' => $isHome ? '#services' : route('home') . '#services'],
        ['name' => 'Keunggulan', 'href' => $isHome ? '#why-us' : route('home') . '#why-us'],
        ['name' => 'Portfolio', 'href' => route('portfolio.index')],
        ['name' => 'Testimoni', 'href' => $isHome ? '#testimonials' : route('home') . '#testimonials'],
    ];
    
    // Use logo from settings if available, otherwise fallback
    $logoSrc = $logoSettings['logoLight'] ?? '/images/logo.png';
    
    // Consultation link (WhatsApp)
    $consultationLink = $finalCTA['buttonLink'] ?? 'https://wa.me/6282257289604';
@endphp

<nav
    id="main-navbar"
    class="fixed w-full z-50 transition-all duration-300 py-5 bg-transparent"
>
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between">
            {{-- Logo --}}
            <div class="flex-shrink-0">
                <a href="{{ route('home') }}" class="block group">
                    <img
                        src="{{ $logoSrc }}"
                        alt="PLS Rental Division"
                        class="h-8 md:h-9 w-auto transition-transform group-hover:scale-105"
                    />
                </a>
            </div>

            {{-- Desktop Nav --}}
            <div class="hidden md:flex items-center space-x-8">
                @foreach($navLinks as $link)
                    <a
                        href="{{ $link['href'] }}"
                        class="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                    >
                        {{ $link['name'] }}
                    </a>
                @endforeach
            </div>

            {{-- CTA Button --}}
            <div class="hidden md:block">
                <a
                    href="{{ $consultationLink }}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-5 py-2.5 text-sm font-semibold text-brand-dark bg-white hover:bg-neutral-200 transition-colors rounded-sm"
                >
                    Konsultasi
                </a>
            </div>

            {{-- Mobile Menu Button --}}
            <div class="md:hidden">
                <button
                    id="mobile-menu-btn"
                    class="text-white hover:text-brand-gold transition-colors"
                >
                    <svg id="menu-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    <svg id="close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
                </button>
            </div>
        </div>
    </div>

    {{-- Mobile Menu Overlay --}}
    <div id="mobile-menu" class="hidden md:hidden absolute top-full left-0 w-full bg-brand-charcoal border-b border-white/10 shadow-2xl">
        <div class="px-6 py-8 space-y-4 flex flex-col">
            @foreach($navLinks as $link)
                <a
                    href="{{ $link['href'] }}"
                    class="mobile-nav-link text-base font-medium text-neutral-300 hover:text-white"
                >
                    {{ $link['name'] }}
                </a>
            @endforeach
            <a
                href="{{ $consultationLink }}"
                target="_blank"
                rel="noopener noreferrer"
                class="mobile-nav-link inline-block text-center mt-4 px-5 py-3 text-sm font-semibold text-brand-dark bg-white rounded-sm"
            >
                Jadwalkan Konsultasi
            </a>
        </div>
    </div>
</nav>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const navbar = document.getElementById('main-navbar');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        const desktopNavLinks = document.querySelectorAll('.desktop-nav-link'); // Add class to desktop links too

        // Smooth scroll implementation
        const handleSmoothScroll = (e) => {
            const link = e.currentTarget;
            const url = new URL(link.href);

            // Check if it's a link to the current page with a hash
            if (url.origin === window.location.origin && 
                url.pathname === window.location.pathname && 
                url.hash) {
                
                const targetId = url.hash.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();

                    // Mobile menu closing logic
                    if (!mobileMenu.classList.contains('hidden')) {
                         mobileMenu.classList.add('hidden');
                         menuIcon.classList.remove('hidden');
                         closeIcon.classList.add('hidden');
                    }

                    // Smooth scroll
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for header
                        behavior: 'smooth'
                    });
                }
            }
        };

        // Attach scroll handler to all links with hashes
        document.querySelectorAll('a[href*="#"]').forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-brand-dark/95', 'backdrop-blur-md', 'border-b', 'border-white/5', 'py-3');
                navbar.classList.remove('bg-transparent', 'py-5');
            } else {
                navbar.classList.remove('bg-brand-dark/95', 'backdrop-blur-md', 'border-b', 'border-white/5', 'py-3');
                navbar.classList.add('bg-transparent', 'py-5');
            }
        });

        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    });
</script>
