import { useMemo } from 'react';
import { normalizeImageUrl } from '@/utils/media-helpers';

interface MediaItem {
    id: number;
    path?: string;
    url?: string;
    alt_text?: string;
    caption?: string;
    order?: number;
    is_featured: boolean;
}

interface ProductMedia {
    media?: MediaItem[];
    featured_image?: string; // Legacy support
    gallery_images?: string[]; // Legacy support
}

export function useProductMedia(product: ProductMedia) {
    return useMemo(() => {
        let galleryImages: string[] = [];
        let featuredImage: string | undefined = undefined;
        
        // Check if media exists and is an array with items
        const hasMedia = product.media && Array.isArray(product.media) && product.media.length > 0;
        
        if (hasMedia && product.media) {
            // Sort by order, featured first
            const sortedMedia = [...product.media].sort((a, b) => {
                if (a.is_featured && !b.is_featured) {
                    return -1;
                }
                if (!a.is_featured && b.is_featured) {
                    return 1;
                }
                return (a.order || 0) - (b.order || 0);
            });
            
            // Map URLs and filter out null/undefined/invalid URLs
            galleryImages = sortedMedia
                .map(m => {
                    if (m.url) {
                        return m.url;
                    }
                    if (m.path) {
                        return normalizeImageUrl(m.path) || null;
                    }
                    return null;
                })
                .filter((url): url is string => url !== null && url !== undefined && url !== '');
            
            // Get featured image or first image
            const featuredMedia = sortedMedia.find(m => m.is_featured);
            featuredImage = featuredMedia?.url 
                || (featuredMedia?.path ? normalizeImageUrl(featuredMedia.path) ?? undefined : undefined)
                || sortedMedia[0]?.url 
                || (sortedMedia[0]?.path ? normalizeImageUrl(sortedMedia[0].path) ?? undefined : undefined);
        } else {
            // Fallback to legacy fields
            const rawGalleryImages = Array.isArray(product.gallery_images) ? product.gallery_images : [];
            galleryImages = rawGalleryImages
                .map(img => normalizeImageUrl(img))
                .filter((img): img is string => img !== null);
            featuredImage = product.featured_image ? normalizeImageUrl(product.featured_image) ?? undefined : undefined;
        }
        
        return {
            galleryImages,
            featuredImage,
        };
    }, [product.media, product.featured_image, product.gallery_images]);
}

