import type { PartnerLogo } from '@/components/PartnerLogos';

// Dark mode styling constants
export const HOME_SECTION_DARK_GRADIENT = 'dark:from-slate-950/98 dark:via-slate-900/95 dark:to-slate-950/98';
export const HOME_SECTION_DARK_BORDER = 'dark:border-slate-800/30';

// Animation delay constants
export const FADE_IN_BASE_DELAY = 0.15;
export const FADE_IN_INCREMENT = 0.05;
export const FADE_IN_INITIAL_DELAY = 0.1;

// Default partner logo fallback
export const DEFAULT_PARTNER_LOGO: PartnerLogo = {
    src: '#', // partner logo will be added here
    alt: 'PLS',
    href: '#', // partner link will be added here
};

