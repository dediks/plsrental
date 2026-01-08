import { useEffect, useState } from 'react';

interface UseMobileMenuOptions {
    searchOpen: boolean;
    setSearchOpen: (open: boolean) => void;
    setSearchQuery: (query: string) => void;
}

interface UseMobileMenuReturn {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export function useMobileMenu({
    searchOpen,
    setSearchOpen,
    setSearchQuery,
}: UseMobileMenuOptions): UseMobileMenuReturn {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Close menu when search opens
        if (searchOpen && mobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    }, [searchOpen, mobileMenuOpen]);

    useEffect(() => {
        // Close search when menu opens
        if (mobileMenuOpen && searchOpen) {
            setSearchOpen(false);
            setSearchQuery('');
        }
    }, [mobileMenuOpen, searchOpen, setSearchOpen, setSearchQuery]);

    return {
        mobileMenuOpen,
        setMobileMenuOpen,
    };
}
