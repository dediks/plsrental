/**
 * Normalize an image path to a URL.
 * Handles paths that are already URLs, start with /storage/, or need to be prefixed.
 */
export function normalizeImageUrl(path: string | undefined | null): string | null {
    if (!path) {
        return null;
    }

    // If already a full URL or starts with /storage/, return as is
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/storage/')) {
        return path;
    }

    // Convert path to /storage/ URL
    return '/storage/' + path.replace(/^\/+/, '');
}

/**
 * Media item type for frontend use
 */
export interface MediaItem {
    id: number;
    url?: string;
    path?: string;
    srcset?: string;
    is_featured: boolean;
    order?: number;
}

/**
 * Get the featured media item from an array, or fallback to the first item.
 */
export function getFeaturedMedia(media: MediaItem[] | undefined | null): MediaItem | null {
    if (!media || !Array.isArray(media) || media.length === 0) {
        return null;
    }

    return media.find(m => m.is_featured) || media[0] || null;
}

/**
 * Get image URL and srcset from a media item, with fallback to path normalization.
 */
export function getMediaImageUrl(media: MediaItem | null): { url: string | null; srcset?: string } {
    if (!media) {
        return { url: null };
    }

    const url = media.url || (media.path ? normalizeImageUrl(media.path) : null);

    return {
        url,
        srcset: media.srcset,
    };
}

/**
 * Get featured image URL and srcset from a product/article with media array or legacy featured_image.
 */
export function getFeaturedImage(
    media: MediaItem[] | undefined | null,
    legacyFeaturedImage?: string | null
): { url: string | null; srcset?: string } {
    const featuredMedia = getFeaturedMedia(media);

    if (featuredMedia) {
        return getMediaImageUrl(featuredMedia);
    }

    // Fallback to legacy featured_image
    if (legacyFeaturedImage) {
        return {
            url: normalizeImageUrl(legacyFeaturedImage),
        };
    }

    return { url: null };
}

