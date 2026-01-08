import { useEffect, useState } from 'react';

/**
 * Hook to detect if dark mode is currently active.
 * Watches for changes to the 'dark' class on document.documentElement.
 */
export function useIsDarkMode(): boolean {
    const [isDark, setIsDark] = useState(() => {
        if (typeof document === 'undefined') {
            return false;
        }
        return document.documentElement.classList.contains('dark');
    });

    useEffect(() => {
        const checkDarkMode = (): void => {
            const isDarkMode =
                document.documentElement.classList.contains('dark');
            setIsDark(isDarkMode);
        };

        // Check initial state
        checkDarkMode();

        // Watch for class changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return isDark;
}
