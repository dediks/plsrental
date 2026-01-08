import { home } from '@/routes';
import { Logo } from '@/components/Logo';
import { usePage } from '@inertiajs/react';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

interface HeaderBarProps {
    isScrolled: boolean;
    mobileMenuOpen: boolean;
    onSearchToggle: () => void;
    onMenuToggle: () => void;
}

export function HeaderBar({
    isScrolled,
    mobileMenuOpen,
    onSearchToggle,
    onMenuToggle,
}: HeaderBarProps) {
    const { url } = usePage();
    const isHomePage = url === home.url();

    const getBackgroundClasses = (): string => {
        if (mobileMenuOpen) {
            return 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl md:bg-transparent md:dark:bg-transparent';
        }
        if (isScrolled) {
            return 'md:bg-transparent md:dark:bg-transparent md:shadow-none bg-foreground/50 shadow-xl dark:bg-black/50 backdrop-blur-xl md:backdrop-blur-none';
        }
        return `${isHomePage ? 'bg-transparent dark:bg-transparent md:dark:bg-background' : 'bg-foreground'} md:bg-foreground dark:bg-background`;
    };

    return (
        <div
            className={`fixed left-0 right-0 top-0 z-40 overflow-hidden ${getBackgroundClasses()} transition-all duration-100 w-full max-h-14 md:max-h-20 opacity-100 translate-y-0`}
        >
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                {/* Desktop Layout */}
                <div className="hidden md:flex h-20 items-center justify-between">
                    {/* Logo on Left */}
                    <div className={`flex items-center transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <Logo size="lg" inverted={true} />
                    </div>

                    {/* Search and Theme Toggle on Right */}
                    <div className="flex items-center gap-2">
                        <AppearanceToggleDropdown className="text-background dark:text-foreground h-9 w-9 rounded-md" />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Search"
                            onClick={onSearchToggle}
                            className="text-background dark:text-foreground"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden flex h-14 items-center justify-between">
                    {/* Logo on Left */}
                    <div className={`flex items-center transition-all duration-300 ${mobileMenuOpen ? 'pl-4' : ''} ${isScrolled ? 'opacity-90 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                        <Logo size={isScrolled ? 'md' : 'md'} inverted={!mobileMenuOpen} showText={false} />
                    </div>

                    {/* Theme Toggle, Search, and Menu Button on Right */}
                    <div className="flex items-center gap-2">
                        {mobileMenuOpen && (
                            <AppearanceToggleDropdown className="h-9 w-9 rounded-md text-foreground dark:text-foreground transition-transform duration-200 hover:scale-105 active:scale-95" />
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Search"
                            onClick={onSearchToggle}
                            className={mobileMenuOpen ? "text-foreground dark:text-foreground" : "text-background dark:text-foreground"}
                        >
                            <Search className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                            onClick={onMenuToggle}
                            className={mobileMenuOpen ? "text-foreground dark:text-foreground" : "text-background dark:text-foreground"}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6 transition-transform duration-200 rotate-0" />
                            ) : (
                                <Menu className="h-6 w-6 transition-transform duration-200 rotate-0" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
