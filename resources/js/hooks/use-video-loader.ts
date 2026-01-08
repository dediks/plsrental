import { useState, useCallback } from 'react';

export function useVideoLoader() {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [hasVideoError, setHasVideoError] = useState(false);

    const handleVideoCanPlay = useCallback(() => {
        setIsVideoLoaded(true);
    }, []);

    const handleVideoError = useCallback(() => {
        setHasVideoError(true);
        setIsVideoLoaded(false);
    }, []);

    return {
        isVideoLoaded,
        hasVideoError,
        handleVideoCanPlay,
        handleVideoError,
    };
}

