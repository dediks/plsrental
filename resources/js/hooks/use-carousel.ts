import { useState, useEffect, useCallback } from 'react';
import { AUTO_PLAY_RESUME_DELAY, DEFAULT_AUTO_PLAY_INTERVAL } from '@/components/Hero/constants';

interface UseCarouselOptions {
    images: string[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    enabled?: boolean;
}

export function useCarousel({
    images,
    autoPlay = true,
    autoPlayInterval = DEFAULT_AUTO_PLAY_INTERVAL,
    enabled = true,
}: UseCarouselOptions) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-play carousel
    useEffect(() => {
        if (!enabled || !autoPlay || isPaused || images.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [enabled, autoPlay, isPaused, images.length, autoPlayInterval]);

    const goToSlide = useCallback(
        (index: number) => {
            setCurrentSlide(index);
            setIsPaused(true);
            // Resume auto-play after delay
            setTimeout(() => setIsPaused(false), AUTO_PLAY_RESUME_DELAY);
        },
        [],
    );

    return {
        currentSlide,
        goToSlide,
        isPaused,
    };
}

