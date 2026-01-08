import { memo } from 'react';
import { Head } from '@inertiajs/react';
import { getVideoMimeType } from '@/lib/video-utils';
import type { VideoFormats } from './types';

interface HeroPreloadProps {
    hasVideo: boolean;
    hasMultipleFormats: boolean;
    backgroundVideo?: string;
    backgroundVideoFormats?: VideoFormats;
}

export const HeroPreload = memo(function HeroPreload({
    hasVideo,
    hasMultipleFormats,
    backgroundVideo,
    backgroundVideoFormats,
}: HeroPreloadProps) {
    if (!hasVideo) {
        return null;
    }

    // Note: Video preloading is handled by the video element's preload attribute
    // Using <link rel="preload"> with as="video" is not supported by the HTML spec
    // The video element in BackgroundMedia.tsx already has preload="metadata" set
    return null;
});

