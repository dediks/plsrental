import type { PartnerLogo } from '@/components/PartnerLogos';
import type { PartnersConfig } from '@/types/home';
import { DEFAULT_PARTNER_LOGO } from './home-constants';

/**
 * Get partner logos from config with fallback to default
 */
export function getPartnerLogos(partners: PartnersConfig): PartnerLogo[] {
    if (partners.logos && partners.logos.length > 0) {
        return partners.logos;
    }
    return [DEFAULT_PARTNER_LOGO];
}

/**
 * Calculate animation delay for staggered fade-in animations
 */
export function getAnimationDelay(baseDelay: number, index: number, increment: number = 0.05): string {
    return `${baseDelay + index * increment}s`;
}

