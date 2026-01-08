import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

interface UseSearchReturn {
    searchOpen: boolean;
    searchQuery: string;
    searchVisible: boolean;
    setSearchOpen: (open: boolean) => void;
    setSearchQuery: (query: string) => void;
    handleSearchSubmit: (e: React.FormEvent) => void;
}

export function useSearch(): UseSearchReturn {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);

    useEffect(() => {
        if (searchOpen) {
            // Read all geometric properties BEFORE any DOM modifications to avoid forced reflow
            // This must happen before React state updates that may trigger DOM changes
            const scrollY = window.scrollY;
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            // Trigger fade-in animation
            requestAnimationFrame(() => {
                setSearchVisible(true);
            });
            
            // Apply DOM modifications using pre-read values
            // This ensures we follow the "read, then write" pattern
            requestAnimationFrame(() => {
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = `${scrollbarWidth}px`;
                // Store scroll position for restoration
                (document.body as HTMLElement).dataset.scrollY = scrollY.toString();
            });
        } else {
            // Trigger fade-out animation
            setSearchVisible(false);
            // Wait for animation to complete before restoring scroll
            const timer = setTimeout(() => {
                const scrollY = document.body.dataset.scrollY;
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                if (scrollY) {
                    window.scrollTo(0, parseInt(scrollY, 10));
                }
                delete document.body.dataset.scrollY;
            }, 100); // Match transition duration
            return () => {
                clearTimeout(timer);
            };
        }
    }, [searchOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent): void => {
            if (e.key === 'Escape' && searchOpen) {
                setSearchOpen(false);
                setSearchQuery('');
            }
        };

        if (searchOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [searchOpen]);

    const handleSearchSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/products', { search: searchQuery.trim() }, {
                preserveState: true,
                replace: true,
            });
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    return {
        searchOpen,
        searchQuery,
        searchVisible,
        setSearchOpen,
        setSearchQuery,
        handleSearchSubmit,
    };
}
