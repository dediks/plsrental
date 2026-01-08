import { memo } from 'react';
import { cn } from '@/lib/utils';
import { getVideoMimeType } from '@/lib/video-utils';
import type { VideoFormats } from './types';

interface BackgroundMediaProps {
    hasVideo: boolean;
    hasVideoError: boolean;
    isVideoLoaded: boolean;
    hasCarousel: boolean;
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundVideoFormats?: VideoFormats;
    images: string[];
    currentSlide: number;
    onVideoCanPlay: () => void;
    onVideoError: () => void;
}

export const BackgroundMedia = memo(function BackgroundMedia({
    hasVideo,
    hasVideoError,
    isVideoLoaded,
    hasCarousel,
    backgroundImage,
    backgroundVideo,
    backgroundVideoFormats,
    images,
    currentSlide,
    onVideoCanPlay,
    onVideoError,
}: BackgroundMediaProps) {
    const hasMultipleFormats =
        backgroundVideoFormats && (backgroundVideoFormats.webm || backgroundVideoFormats.mp4);

    return (
        <div className="absolute inset-0 z-0 w-full h-full">
            {hasVideo && !hasVideoError ? (
                <>
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={backgroundImage}
                        className={cn('h-full w-full object-cover', !isVideoLoaded && 'opacity-0')}
                        onCanPlay={onVideoCanPlay}
                        onError={onVideoError}
                    >
                        {hasMultipleFormats ? (
                            <>
                                {backgroundVideoFormats.webm && (
                                    <source src={backgroundVideoFormats.webm} type="video/webm" />
                                )}
                                {backgroundVideoFormats.mp4 && (
                                    <source src={backgroundVideoFormats.mp4} type="video/mp4" />
                                )}
                            </>
                        ) : backgroundVideo ? (
                            <source src={backgroundVideo} type={getVideoMimeType(backgroundVideo)} />
                        ) : null}
                        {backgroundImage && (
                            <img
                                src={backgroundImage}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        )}
                    </video>
                    {!isVideoLoaded && backgroundImage && (
                        <img
                            src={backgroundImage}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    )}
                </>
            ) : hasVideoError && backgroundImage ? (
                <img
                    src={backgroundImage}
                    alt=""
                    className="h-full w-full object-cover"
                />
            ) : hasCarousel ? (
                <div className="relative h-full w-full">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Hero slide ${index + 1}`}
                            className={cn(
                                'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out',
                                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0',
                            )}
                            style={{
                                willChange: 'opacity',
                                transform: 'translateZ(0)',
                            }}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            fetchPriority={index === 0 ? 'high' : 'auto'}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
});

