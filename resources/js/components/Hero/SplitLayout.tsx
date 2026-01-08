import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { HeroContentProps, HeroLayoutProps, HeroTrustedByProps } from './types';
import { TrustedBy } from './TrustedBy';

interface SplitLayoutProps extends HeroContentProps, HeroLayoutProps, HeroTrustedByProps {}

export const SplitLayout = memo(function SplitLayout({
    splitLayoutImage,
    trustedByText,
    showTrustedBy = true,
    trustedByAvatars = [],
    showBadge = true,
    showSplitLayoutImage = true,
    heading,
    subheading,
    showHeading = true,
    showSubheading = true,
}: SplitLayoutProps) {
    return (
        <div
            className={cn(
                'grid grid-cols-1 md:px-16 2xl:px-0 md:mt-56 2xl:mt-64 items-center gap-8 lg:gap-12 w-full',
                showSplitLayoutImage ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-4xl mx-auto',
            )}
        >
            {/* Left: Content */}
            <div className={cn(showSplitLayoutImage ? 'order-2 lg:order-1' : 'order-1')}>
                {showBadge && (
                    <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-slate-50/20 dark:border-slate-50/20 bg-slate-50/10 dark:bg-slate-50/10 backdrop-blur-md px-5 py-2 body-sm font-medium text-slate-50 dark:text-slate-50 shadow-lg">
                        <span>Professional Audio Solutions</span>
                    </div>
                )}

                {showHeading && heading && (
                    <h1 className="h1 text-slate-50 tracking-tight drop-shadow-lg mb-3 sm:mb-4">
                        <span className="block bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/90 bg-clip-text text-transparent drop-shadow-md">
                            {heading}
                        </span>
                    </h1>
                )}

                {showSubheading && subheading && (
                    <p className="mt-4 sm:mt-6 body-lg leading-relaxed text-slate-50/95 drop-shadow-md">
                        {subheading}
                    </p>
                )}

                {/* Trusted by section with avatars */}
                <TrustedBy
                    trustedByText={trustedByText}
                    showTrustedBy={showTrustedBy}
                    trustedByAvatars={trustedByAvatars}
                    avatarSize="md"
                    className="flex flex-col gap-4 mt-8 sm:mt-10"
                />
            </div>
        </div>
    );
});

