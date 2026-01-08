import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for managing image loading state.
 * Resets loading state when the image URL changes.
 */
export function useImageLoader(imageUrl: string | null | undefined) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);

    // Reset loading state when image URL changes
    useEffect(() => {
        setIsImageLoaded(false);
        
        // Check if image is already loaded (from cache)
        if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight !== 0) {
            setIsImageLoaded(true);
        }
    }, [imageUrl]);

    const handleImageLoad = useCallback(() => {
        setIsImageLoaded(true);
    }, []);

    const setImgRef = useCallback((img: HTMLImageElement | null) => {
        imgRef.current = img;
        // Check if image is already loaded when ref is set
        if (img && img.complete && img.naturalHeight !== 0) {
            setIsImageLoaded(true);
        }
    }, []);

    return {
        isImageLoaded,
        handleImageLoad,
        setImgRef,
    };
}

