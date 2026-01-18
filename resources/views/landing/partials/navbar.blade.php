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
                    class="bg-white px-5 py-2.5 text-sm font-semibold text-brand-dark bg-brand-accent hover:bg-brand-accent-light transition-all rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                    Konsultasi
                </a>
            </div>

            {{-- Mobile Menu Button --}}
            <div class="md:hidden">
                <button
                    id="mobile-menu-btn"
                    class="text-white hover:text-brand-accent-light transition-colors"
                >
                    <svg id="menu-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    <svg id="close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
                </button>
            </div>
        </div>
    </div>

    {{-- Mobile Menu Overlay --}}
    <div id="mobile-menu" class="hidden md:hidden fixed inset-0 top-0 left-0 w-full h-screen bg-brand-dark/98 backdrop-blur-md z-40">
        {{-- Close Button --}}
        <button id="mobile-menu-close" class="absolute top-6 right-6 text-white hover:text-brand-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
            </svg>
        </button>
        
        <div class="h-full flex flex-col justify-center items-center px-6 py-20 space-y-6">
            @foreach($navLinks as $link)
                <a
                    href="{{ $link['href'] }}"
                    class="mobile-nav-link text-xl font-medium text-neutral-300 hover:text-brand-accent transition-colors"
                >
                    {{ $link['name'] }}
                </a>
            @endforeach
            <a
                href="{{ $consultationLink }}"
                target="_blank"
                rel="noopener noreferrer"
                class="mobile-nav-link flex items-center justify-center inline-flex text-center mt-8 px-8 py-4 text-base font-semibold text-brand-dark bg-brand-accent hover:bg-brand-accent-light rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="mr-2 h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                Konsultasi Sekarang
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
                navbar.classList.add('bg-brand-dark/95', 'backdrop-blur-md', 'border-b', 'border-brand-accent/10', 'py-3');
                navbar.classList.remove('bg-transparent', 'py-5');
            } else {
                navbar.classList.remove('bg-brand-dark/95', 'backdrop-blur-md', 'border-b', 'border-brand-accent/10', 'py-3');
                navbar.classList.add('bg-transparent', 'py-5');
            }
        });

        // Mobile menu toggle
        const closeMobileMenu = () => {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        };

        const openMobileMenu = () => {
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        };

        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                openMobileMenu();
            } else {
                closeMobileMenu();
            }
        });

        // Close button in overlay
        const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
        if (mobileMenuCloseBtn) {
            mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
        }
    });
</script>
