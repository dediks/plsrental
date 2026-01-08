import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const VISIBILITY_OFFSET = 240;

export function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = (): void => {
            if (ticking) {
                return;
            }

            ticking = true;

            window.requestAnimationFrame(() => {
                setIsVisible(window.scrollY > VISIBILITY_OFFSET);
                ticking = false;
            });
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
    }, []);

    const scrollToTop = useCallback((): void => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }, []);

    return (
        <div
            className={cn(
                'fixed bottom-6 right-4 z-40 transition-all duration-300 ease-out md:bottom-8 md:right-8 lg:bottom-10 lg:right-10',
                isVisible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
            )}
        >
            <Button
                type="button"
                size="icon"
                variant="default"
                aria-label="Scroll to top"
                className="shadow-lg shadow-black/10 hover:shadow-black/20 dark:shadow-white/10 dark:hover:shadow-white/20"
                onClick={scrollToTop}
            >
                <ArrowUp className="size-4" />
            </Button>
        </div>
    );
}

