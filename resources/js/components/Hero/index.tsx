import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { HeroProps } from './types';
import {
    DEFAULT_HEADING,
    DEFAULT_SUBHEADING,
    DEFAULT_TRUSTED_BY_TEXT,
    DEFAULT_OVERLAY_OPACITY,
    DEFAULT_AUTO_PLAY_INTERVAL,
    getMaxWidthClass,
} from './constants';
import { useCarousel } from '@/hooks/use-carousel';
import { useVideoLoader } from '@/hooks/use-video-loader';
import { CenteredLayout } from './CenteredLayout';
import { SplitLayout } from './SplitLayout';
import { BackgroundMedia } from './BackgroundMedia';
import { HeroOverlay } from './HeroOverlay';
import { ScrollIndicator } from './ScrollIndicator';
import { HeroPreload } from './HeroPreload';

export function Hero({
    className,
    backgroundImage,
    backgroundVideo,
    backgroundVideoFormats,
    variant = 'centered',
    carouselImages = [],
    splitLayoutImage,
    trustedByText = DEFAULT_TRUSTED_BY_TEXT,
    showTrustedBy = true,
    trustedByAvatars = [],
    autoPlay = true,
    autoPlayInterval = DEFAULT_AUTO_PLAY_INTERVAL,
    showBadge = true,
    showScrollIndicator = true,
    showCarousel = true,
    showSplitLayoutImage = true,
    showOverlay = true,
    overlayOpacity = DEFAULT_OVERLAY_OPACITY,
    contentMaxWidth = '4xl',
    heading = DEFAULT_HEADING,
    subheading = DEFAULT_SUBHEADING,
    showHeading = true,
    showSubheading = true,
    mobileHeading,
    mobileSubheading,
    showMobileHeading = false,
    showMobileSubheading = false,
}: HeroProps) {
    const { isVideoLoaded, hasVideoError, handleVideoCanPlay, handleVideoError } =
        useVideoLoader();

    // Memoize computed values
    const hasMultipleFormats = useMemo(
        () => !!(backgroundVideoFormats && (backgroundVideoFormats.webm || backgroundVideoFormats.mp4)),
        [backgroundVideoFormats],
    );

    const hasVideo = useMemo(
        () => !!(backgroundVideo || hasMultipleFormats),
        [backgroundVideo, hasMultipleFormats],
    );

    const images = useMemo(
        () =>
            showCarousel && carouselImages.length > 0
                ? carouselImages
                : backgroundImage
                  ? [backgroundImage]
                  : [],
        [showCarousel, carouselImages, backgroundImage],
    );

    const hasCarousel = useMemo(
        () => showCarousel && carouselImages.length > 0,
        [showCarousel, carouselImages.length],
    );

    const hasBackground = useMemo(
        () => hasVideo || hasCarousel || !!backgroundImage,
        [hasVideo, hasCarousel, backgroundImage],
    );

    const { currentSlide } = useCarousel({
        images,
        autoPlay,
        autoPlayInterval,
        enabled: hasCarousel,
    });

    const maxWidthClass = useMemo(
        () => getMaxWidthClass(contentMaxWidth),
        [contentMaxWidth],
    );

    const contentProps = useMemo(
        () => ({
            heading,
            subheading,
            showHeading,
            showSubheading,
            mobileHeading,
            mobileSubheading,
            showMobileHeading,
            showMobileSubheading,
        }),
        [
            heading,
            subheading,
            showHeading,
            showSubheading,
            mobileHeading,
            mobileSubheading,
            showMobileHeading,
            showMobileSubheading,
        ],
    );

    const trustedByProps = useMemo(
        () => ({
            trustedByText,
            showTrustedBy,
            trustedByAvatars,
        }),
        [trustedByText, showTrustedBy, trustedByAvatars],
    );

    return (
        <>
            <HeroPreload
                hasVideo={hasVideo}
                hasMultipleFormats={hasMultipleFormats}
                backgroundVideo={backgroundVideo}
                backgroundVideoFormats={backgroundVideoFormats}
            />
            <section
                className={cn(
                    'relative isolate overflow-hidden -mt-16 lg:-mt-6',
                    hasBackground
                        ? 'min-h-[650px] md:min-h-screen flex flex-col'
                        : 'bg-background py-20 sm:py-24 md:py-32',
                    className,
                )}
            >
                {/* Background Image/Video/Carousel */}
                {hasBackground && (
                    <BackgroundMedia
                        hasVideo={hasVideo}
                        hasVideoError={hasVideoError}
                        isVideoLoaded={isVideoLoaded}
                        hasCarousel={hasCarousel}
                        backgroundImage={backgroundImage}
                        backgroundVideo={backgroundVideo}
                        backgroundVideoFormats={backgroundVideoFormats}
                        images={images}
                        currentSlide={currentSlide}
                        onVideoCanPlay={handleVideoCanPlay}
                        onVideoError={handleVideoError}
                    />
                )}

                {/* Dark overlay for text readability */}
                {hasBackground && (
                    <HeroOverlay
                        showOverlay={showOverlay}
                        overlayOpacity={overlayOpacity}
                    />
                )}

                {/* Content */}
                <div
                    className={cn(
                        'relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex items-center xl:-mt-32 2xl:-mt-24',
                        variant === 'centered'
                            ? `text-center lg:text-left ${maxWidthClass}`
                            : maxWidthClass,
                        'py-8 sm:py-12 xl:py-32',
                    )}
                >
                    {/* Gradient overlay behind content - desktop only */}
                    {showOverlay && (
                        <div className="hidden lg:block absolute -inset-4 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    )}
                    {/* Darker overlay behind content when carousel is active */}
                    {hasCarousel && showOverlay && (
                        <div
                            className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-black to-black left-1/4 w-full h-full"
                            style={{
                                opacity: (overlayOpacity / 100) * 0.6,
                            }}
                        />
                    )}
                    {variant === 'centered' ? (
                        <>
                            {/* Mobile: Centered Layout */}
                            <div className="lg:hidden">
                                <CenteredLayout {...contentProps} {...trustedByProps} />
                            </div>
                            {/* Desktop: Split Layout */}
                            <div className="hidden lg:block">
                                <SplitLayout
                                    {...contentProps}
                                    {...trustedByProps}
                                    splitLayoutImage={splitLayoutImage}
                                    showBadge={showBadge}
                                    showSplitLayoutImage={showSplitLayoutImage}
                                />
                            </div>
                        </>
                    ) : (
                        <SplitLayout
                            {...contentProps}
                            {...trustedByProps}
                            splitLayoutImage={splitLayoutImage}
                            showBadge={showBadge}
                            showSplitLayoutImage={showSplitLayoutImage}
                        />
                    )}
                </div>

                {/* Scroll indicator */}
                <ScrollIndicator
                    show={hasBackground && !hasCarousel && showScrollIndicator}
                />
            </section>
        </>
    );
}

