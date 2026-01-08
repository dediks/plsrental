import { memo } from 'react';
import type { HeroContentProps, HeroTrustedByProps } from './types';
import { TrustedBy } from './TrustedBy';

interface CenteredLayoutProps extends HeroContentProps, HeroTrustedByProps {}

export const CenteredLayout = memo(function CenteredLayout({
    trustedByText,
    showTrustedBy = true,
    trustedByAvatars = [],
    heading,
    subheading,
    showHeading = true,
    showSubheading = true,
    mobileHeading,
    mobileSubheading,
    showMobileHeading = false,
    showMobileSubheading = false,
}: CenteredLayoutProps) {
    // Use mobile-specific text if provided and enabled, otherwise fall back to regular text
    const displayHeading = showMobileHeading && mobileHeading ? mobileHeading : heading;
    const displaySubheading =
        showMobileSubheading && mobileSubheading ? mobileSubheading : subheading;
    const shouldShowHeading = (showMobileHeading && mobileHeading) || showHeading;
    const shouldShowSubheading = (showMobileSubheading && mobileSubheading) || showSubheading;

    return (
        <div className="w-full">
            {/* Main Heading */}
            {shouldShowHeading && displayHeading && (
                <h1 className="h1 text-slate-50 tracking-tight drop-shadow-lg pb-2">
                    <span className="block bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/90 bg-clip-text text-transparent drop-shadow-md">
                        {displayHeading}
                    </span>
                </h1>
            )}

            {/* Subheading */}
            {shouldShowSubheading && displaySubheading && (
                <p className="mx-auto px-4 mt-3 sm:mt-6 max-w-2xl body-lg leading-relaxed text-slate-100 drop-shadow-md">
                    {displaySubheading}
                </p>
            )}

            {/* Trusted by section with avatars */}
            <TrustedBy
                trustedByText={trustedByText}
                showTrustedBy={showTrustedBy}
                trustedByAvatars={trustedByAvatars}
                avatarSize="sm"
                className="flex flex-col items-center gap-3 mt-8 sm:mt-10"
            />
        </div>
    );
});

