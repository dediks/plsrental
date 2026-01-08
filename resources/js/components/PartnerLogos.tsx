import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export interface PartnerLogo {
    src: string;
    alt: string;
    href?: string;
}

interface PartnerLogosProps {
    logos: PartnerLogo[];
    className?: string;
    animationDuration?: number;
    hasTrustedSection?: boolean;
}

export function PartnerLogos({
    logos,
    className,
    animationDuration = 15,
    hasTrustedSection = false,
}: PartnerLogosProps) {
    if (!logos || logos.length === 0) {
        return null;
    }

    // Duplicate logos for seamless infinite loop (mobile only)
    const duplicatedLogos = [...logos, ...logos];

    const renderLogo = (logo: PartnerLogo, index: number, isMobile = false) => {
        // Container dimensions for consistent sizing - all logos will fit within these bounds
        const containerHeight = isMobile ? '2.5rem' : '1.75rem'; // 40px mobile, 28px desktop
        const containerMaxWidth = isMobile ? '150px' : '180px';
        
        const imageElement = (
            <img
                src={logo.src}
                alt={logo.alt}
                className="opacity-80 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0 object-contain w-full h-full"
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                }}
                loading="lazy"
            />
        );

        const containerClass = "flex-shrink-0 flex items-center justify-center";
        const containerStyle: React.CSSProperties = {
            height: containerHeight,
            maxWidth: containerMaxWidth,
            width: 'auto',
            minWidth: isMobile ? '100px' : '120px',
        };

        if (logo.href) {
            return (
                <Link
                    key={`${logo.src}-${index}`}
                    href={logo.href}
                    className={containerClass}
                    style={containerStyle}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {imageElement}
                </Link>
            );
        }

        return (
            <div
                key={`${logo.src}-${index}`}
                className={containerClass}
                style={containerStyle}
            >
                {imageElement}
            </div>
        );
    };

    return (
        <div
            className={cn(
                'absolute md:relative z-10 w-full overflow-hidden dark:border-b dark:border-slate-800/30',
                'backdrop-blur-sm top-130 md:top-0',
                className,
            )}
            style={{
                // CSS custom property for animation duration
                ['--animation-duration' as string]: `${animationDuration}s`,
            }}
        >
            {/* Subtle divider when connected to trusted section */}
            {hasTrustedSection && (
                <div className="h-px w-full bg-gradient-to-r from-slate-50/20 via-slate-50/20 to-transparent mb-4 sm:mb-5" />
            )}
            <div className={cn(
                "relative w-full",
                hasTrustedSection 
                    ? "backdrop-blur-md py-3 sm:py-4 md:py-5" 
                    : "md:bg-slate-200/80 dark:md:bg-transparent px-4 md:px-16 py-2 sm:py-8"
            )}>
                <div className="sm:px-6 lg:px-8">
                    {/* Mobile: Animated marquee */}
                    <div className="md:hidden overflow-hidden">
                        <div
                            className="flex gap-6 partner-marquee"
                            style={{
                                animation: 'marquee var(--animation-duration) linear infinite',
                                animationPlayState: 'running',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transition = 'animation-play-state 0.2s ease-out';
                                e.currentTarget.style.animationPlayState = 'paused';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transition = 'animation-play-state 0.2s ease-out';
                                e.currentTarget.style.animationPlayState = 'running';
                            }}
                        >
                            {/* Initial spacer to ensure logos appear from within padding */}
                            <div className="flex-shrink-0 w-4" aria-hidden="true" />
                            {duplicatedLogos.map((logo, index) => renderLogo(logo, index, true))}
                        </div>
                    </div>

                    {/* Desktop: Static grid layout */}
                    <div 
                        className="hidden md:grid px-16 place-items-center gap-6 md:gap-8 lg:gap-10 xl:gap-12"
                        style={{
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        }}
                    >
                        {logos.map((logo, index) => renderLogo(logo, index, false))}
                    </div>
                </div>
            </div>
        </div>
    );
}

