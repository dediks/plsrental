import { home } from '@/routes';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { useIsDarkMode } from '@/hooks/use-is-dark-mode';
import { type SharedData } from '@/types';

interface LogoProps {
    /** Whether to show the text "UAProfessional" next to the logo */
    showText?: boolean;
    /** Size of the logo */
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
    /** Variant: 'link' renders as a Link, 'img-only' renders as a div */
    variant?: 'link' | 'img-only';
    /** Invert logo colors (use white logo for dark backgrounds) */
    inverted?: boolean;
    /** Additional CSS classes */
    className?: string;
}

const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
    '2xl': 'h-14 w-14',
    '3xl': 'h-16 w-16',
    '4xl': 'h-18 w-18',
    '5xl': 'h-20 w-20'
} as const;

const textSizeClasses = {
    sm: 'body-sm',
    md: 'body',
    lg: 'body-lg',
    xl: 'body-xl',
    '2xl': 'body-2xl',
    '3xl': 'body-3xl',
    '4xl': 'body-4xl',
    '5xl': 'body-5xl'
} as const;

const gapClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-3',
    xl: 'gap-4',
    '2xl': 'gap-5',
    '3xl': 'gap-6',
    '4xl': 'gap-7',
    '5xl': 'gap-8'
} as const;

export function Logo({
    showText = true,
    size = 'md',
    variant = 'link',
    inverted = false,
    className,
}: LogoProps) {
    const isDark = useIsDarkMode();
    const { logoSettings } = usePage<SharedData>().props;

    // Get logo paths from settings, with fallback to default static paths
    const defaultLightLogo = '/images/black-logo.svg';
    const defaultDarkLogo = '/images/white-logo.svg';
    
    const logoLight = logoSettings?.logoLight || defaultLightLogo;
    const logoDark = logoSettings?.logoDark || defaultDarkLogo;

    // Determine logo source based on theme and inverted prop
    // If inverted: use light logo (for dark backgrounds in both light and dark modes)
    // If not inverted: use dark logo in light mode, light logo in dark mode
    const logoSrc = inverted
        ? logoLight
        : (isDark ? logoLight : logoDark);

    const logoImage = (
        <img
            src={logoSrc}
            alt="UAProfessional"
            className={cn(sizeClasses[size])}
        />
    );

    const logoText = showText && variant !== 'img-only' && (
        <span
            className={cn(
                'font-semibold',
                inverted
                    ? 'text-background dark:text-foreground'
                    : 'text-foreground',
                textSizeClasses[size],
            )}
        >
            UAProfessional
        </span>
    );

    const content = (
        <>
            {logoImage}
            {logoText}
        </>
    );

    const containerClasses = cn(
        'flex items-center transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]',
        gapClasses[size],
        className,
    );

    if (variant === 'img-only') {
        return <div className={containerClasses}>{logoImage}</div>;
    }

    return (
        <Link href={home()} className={containerClasses}>
            {content}
        </Link>
    );
}
