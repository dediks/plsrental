export type ContentMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';

export type HeroVariant = 'centered' | 'split';

export interface VideoFormats {
    webm?: string;
    mp4?: string;
}

export interface HeroContentProps {
    heading?: string;
    subheading?: string;
    showHeading?: boolean;
    showSubheading?: boolean;
    mobileHeading?: string;
    mobileSubheading?: string;
    showMobileHeading?: boolean;
    showMobileSubheading?: boolean;
}

export interface HeroBackgroundProps {
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundVideoFormats?: VideoFormats;
    carouselImages?: string[];
    showCarousel?: boolean;
}

export interface HeroLayoutProps {
    variant?: HeroVariant;
    contentMaxWidth?: ContentMaxWidth;
    showBadge?: boolean;
    showSplitLayoutImage?: boolean;
    splitLayoutImage?: string;
}

export interface HeroOverlayProps {
    showOverlay?: boolean;
    overlayOpacity?: number;
}

export interface HeroTrustedByProps {
    trustedByText?: string;
    showTrustedBy?: boolean;
    trustedByAvatars?: string[];
}

export interface HeroCarouselProps {
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

export interface HeroProps
    extends HeroContentProps,
        HeroBackgroundProps,
        HeroLayoutProps,
        HeroOverlayProps,
        HeroTrustedByProps,
        HeroCarouselProps {
    className?: string;
    showScrollIndicator?: boolean;
}

