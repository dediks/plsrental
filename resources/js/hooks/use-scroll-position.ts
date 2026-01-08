import { useEffect, useState } from 'react';

interface UseScrollPositionOptions {
    isMobile: boolean;
    headerHeight: number;
}

interface UseScrollPositionReturn {
    isScrolled: boolean;
    showBottomElements: boolean;
}

export function useScrollPosition({
    isMobile,
    headerHeight,
}: UseScrollPositionOptions): UseScrollPositionReturn {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showBottomElements, setShowBottomElements] = useState(false);

    useEffect(() => {
        let ticking = false;

                const handleScroll = (): void => {
                    if (!ticking) {
                        window.requestAnimationFrame(() => {
                            const scrollY = window.scrollY;
                            // On mobile: detect any scroll, on desktop: detect when scrolled past header
                            const scrolled = isMobile ? scrollY > 10 : scrollY >= headerHeight;
                            setIsScrolled(scrolled);

                            // Show bottom elements after header has fully disappeared (desktop only)
                            // Use a threshold that accounts for the transition and prevents glitches
                            const shouldShow = !isMobile && scrollY > headerHeight + 20;
                            setShowBottomElements(shouldShow);

                            ticking = false;
                        });
                        ticking = true;
                    }
                };

        // Check initial scroll position after DOM updates complete to avoid forced reflow
        // Defer to next frame to ensure all DOM modifications (e.g., from Head component) are done
        window.requestAnimationFrame(() => {
            handleScroll();
        });
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [headerHeight, isMobile]);

    return { isScrolled, showBottomElements };
}
