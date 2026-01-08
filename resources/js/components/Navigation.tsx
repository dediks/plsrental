import { useCallback, useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { useSearch } from '@/hooks/use-search';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import { HeaderBar } from './Navigation/HeaderBar';
import { BottomNav } from './Navigation/BottomNav';
import { MobileMenu } from './Navigation/MobileMenu';
import { SearchOverlay } from './Navigation/SearchOverlay';
import { HEADER_HEIGHT, MOBILE_HEADER_HEIGHT, NAV_HEIGHT, navigation } from './Navigation/constants';

export function Navigation() {
    const isMobile = useIsMobile();

    const { isScrolled, showBottomElements } = useScrollPosition({
        isMobile,
        headerHeight: isMobile ? MOBILE_HEADER_HEIGHT : HEADER_HEIGHT,
    });

    const {
        searchOpen,
        searchQuery,
        searchVisible,
        setSearchOpen,
        setSearchQuery,
        handleSearchSubmit,
    } = useSearch();

    const { mobileMenuOpen, setMobileMenuOpen } = useMobileMenu({
        searchOpen,
        setSearchOpen,
        setSearchQuery,
    });

    const handleSearchToggle = useCallback((): void => {
        if (mobileMenuOpen) {
            setMobileMenuOpen(false);
        }
        setSearchOpen(!searchOpen);
    }, [mobileMenuOpen, searchOpen, setMobileMenuOpen, setSearchOpen]);

    const handleMenuToggle = useCallback((): void => {
        if (searchOpen) {
            setSearchOpen(false);
            setSearchQuery('');
        }
        setMobileMenuOpen(!mobileMenuOpen);
    }, [mobileMenuOpen, searchOpen, setMobileMenuOpen, setSearchOpen, setSearchQuery]);

    const handleSearchClose = useCallback((): void => {
        setSearchOpen(false);
        setSearchQuery('');
    }, [setSearchOpen, setSearchQuery]);

    const searchOverlayTopOffset = useMemo((): number => {
        if (isMobile) {
            return MOBILE_HEADER_HEIGHT;
        }
        return isScrolled ? NAV_HEIGHT : HEADER_HEIGHT + NAV_HEIGHT;
    }, [isMobile, isScrolled]);

    const searchOverlayHeight = useMemo((): string => {
        if (isMobile) {
            return `calc(100vh - ${MOBILE_HEADER_HEIGHT}px)`;
        }
        return `calc(100vh - ${isScrolled ? NAV_HEIGHT : HEADER_HEIGHT + NAV_HEIGHT}px)`;
    }, [isMobile, isScrolled]);

    return (
        <nav className="absolute w-full overflow-x-hidden">
            <HeaderBar
                isScrolled={isScrolled}
                mobileMenuOpen={mobileMenuOpen}
                onSearchToggle={handleSearchToggle}
                onMenuToggle={handleMenuToggle}
            />

            {/* Spacer to prevent content jump when header is visible */}
            {/* Desktop: only show when header is visible, Mobile: always show since header is fixed */}
            <div className="hidden md:block">
                {!isScrolled && <div className="h-20" />}
            </div>
            <div className="md:hidden">
                <div className="h-14 md:h-20" />
            </div>

            <BottomNav
                isScrolled={isScrolled}
                showBottomElements={showBottomElements}
                onSearchToggle={handleSearchToggle}
                navigationItems={navigation}
            />

            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => {
                    setMobileMenuOpen(false);
                }}
                navigationItems={navigation}
            />

            {!mobileMenuOpen && (
                <SearchOverlay
                    isOpen={searchOpen}
                    isVisible={searchVisible}
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    onSubmit={handleSearchSubmit}
                    onClose={handleSearchClose}
                    topOffset={searchOverlayTopOffset}
                    height={searchOverlayHeight}
                />
            )}
        </nav>
    );
}
