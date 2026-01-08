import type { ContentMaxWidth } from './types';

export const AUTO_PLAY_RESUME_DELAY = 10000;
export const OVERLAY_OPACITY_BLUE_MULTIPLIER = 0.2;
export const OVERLAY_OPACITY_CAROUSEL_MULTIPLIER = 0.6;
export const DEFAULT_OVERLAY_OPACITY = 80;
export const DEFAULT_AUTO_PLAY_INTERVAL = 5000;
export const DEFAULT_TRUSTED_BY_TEXT = 'Trusted by 100+ rentals';
export const DEFAULT_HEADING = 'Acoustic Engineering Excellence';
export const DEFAULT_SUBHEADING =
    "Professional loudspeaker systems that deliver unparalleled clarity, precision, and power for the world's most demanding audio environments.";
export const DEFAULT_IMAGE = '/images/hero/hero-uap.webp';
export const MAX_AVATARS_TO_SHOW = 4;

export const MAX_WIDTH_MAP: Record<ContentMaxWidth, string> = {
    sm: 'max-w-2xl', // 672px
    md: 'max-w-3xl', // 768px
    lg: 'max-w-4xl', // 896px
    xl: 'max-w-5xl', // 1024px
    '2xl': 'max-w-6xl', // 1152px
    '3xl': 'max-w-7xl', // 1280px
    '4xl': 'max-w-7xl', // 1280px (same as 3xl for consistency)
    full: 'max-w-full', // 100%
};

export const getMaxWidthClass = (contentMaxWidth: ContentMaxWidth = '4xl'): string => {
    return MAX_WIDTH_MAP[contentMaxWidth] || MAX_WIDTH_MAP['4xl'];
};

