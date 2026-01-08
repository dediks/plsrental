import { Search } from 'lucide-react';
import { NavLink } from './NavLink';
import { Logo } from '@/components/Logo';
import { HEADER_HEIGHT } from './constants';
import { Button } from '@/components/ui/button';
import { useIsDarkMode } from '@/hooks/use-is-dark-mode';
import type { NavigationItem } from './constants';

interface BottomNavProps {
    isScrolled: boolean;
    showBottomElements: boolean;
    onSearchToggle: () => void;
    navigationItems: NavigationItem[];
}

export function BottomNav({
    isScrolled,
    showBottomElements,
    onSearchToggle,
    navigationItems,
}: BottomNavProps) {
    const isDark = useIsDarkMode();
    
    // When scrolled: use inverted logo in dark mode (light logo for dark background)
    // In light mode, default behavior (dark logo) works fine
    const shouldInvert = isScrolled && isDark;
    
    return (
        <div
            className="hidden md:block fixed left-0 right-0 z-50 border-b border-border/50 dark:border-primary/10 bg-background/80 dark:bg-gradient-to-r dark:from-slate-800 dark:via-slate-800/30 dark:to-slate-900/90 backdrop-blur-md shadow-lg dark:shadow-primary/5 transition-all duration-100 w-full"
            style={{ top: isScrolled ? 0 : HEADER_HEIGHT }}
        >
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 w-full">
                <div className="flex h-16 lg:h-12 2xl:h-16 items-center">
                    {/* Logo - Fixed width container prevents layout shift */}
                    <div
                        className={`flex items-center border-r border-border dark:border-primary/10 transition-[width,opacity,padding] duration-300 ease-out overflow-hidden shrink-0 ${
                            showBottomElements
                                ? 'opacity-100 w-[200px] px-4'
                                : 'opacity-0 w-0 px-0 border-r-0 pointer-events-none'
                        }`}
                    >
                        <Logo 
                            size="lg" 
                            variant="link" 
                            showText={false}
                            inverted={shouldInvert}
                            className={isScrolled && !isDark ? 'dark:invert' : ''}
                        />
                    </div>

                    {/* Desktop Navigation with Dividers - Middle column */}
                    <div className="text-foreground flex h-full items-center flex-1 min-w-0">
                        {navigationItems.map((item, index) => (
                            <NavLink
                                key={item.name}
                                item={item}
                                className={`flex h-full flex-1 items-center justify-center border-r-2 border-border dark:border-primary/10 body font-medium text-foreground last:border-r-0 hover:bg-slate-200/50 dark:hover:bg-gradient-to-b dark:hover:from-primary/15 dark:hover:via-accent/10 dark:hover:to-primary/5 hover:text-foreground dark:hover:text-primary-foreground transition-all duration-200 ${
                                    index === 0 && !showBottomElements ? 'border-l border-border dark:border-primary/10' : ''
                                }`}
                            />
                        ))}
                    </div>

                    {/* Search Button - Fixed width container prevents layout shift */}
                    <div
                        className={`flex items-center border-l border-border dark:border-primary/10 transition-[width,opacity,padding] duration-300 ease-out overflow-hidden shrink-0 ${
                            showBottomElements
                                ? 'opacity-100 w-[80px] px-4'
                                : 'opacity-0 w-0 px-0 border-l-0 pointer-events-none'
                        }`}
                    >
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Search"
                            onClick={onSearchToggle}
                            className="text-foreground hover:text-accent-foreground dark:hover:text-primary dark:hover:bg-primary/10"
                        >
                            <Search className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
