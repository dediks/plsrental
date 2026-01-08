import { memo } from 'react';
import type { HeroOverlayProps } from './types';
import { OVERLAY_OPACITY_BLUE_MULTIPLIER } from './constants';

export const HeroOverlay = memo(function HeroOverlay({
    showOverlay = true,
    overlayOpacity = 80,
}: HeroOverlayProps) {
    if (!showOverlay) {
        return null;
    }

    const baseOpacity = overlayOpacity / 100;
    const blueOpacity = baseOpacity * OVERLAY_OPACITY_BLUE_MULTIPLIER;

    return (
        <>
            {/* Base dark overlay */}
            <div
                className="absolute top-0 left-0 w-full h-full z-[1] bg-gradient-to-r from-black via-black to-black"
                style={{
                    opacity: baseOpacity,
                }}
            />
            {/* Blue effect overlay - desktop only */}
            <div
                className="absolute top-0 left-0 w-full h-full z-[1] lg:bg-gradient-to-br lg:from-blue-900 lg:via-blue-800 lg:to-blue-700"
                style={{
                    opacity: blueOpacity,
                }}
            />
        </>
    );
});

