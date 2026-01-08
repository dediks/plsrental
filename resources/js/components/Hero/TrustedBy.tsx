import { memo } from 'react';
import type { HeroTrustedByProps } from './types';
import { MAX_AVATARS_TO_SHOW } from './constants';

interface TrustedByProps extends HeroTrustedByProps {
    avatarSize?: 'sm' | 'md';
    className?: string;
}

export const TrustedBy = memo(function TrustedBy({
    trustedByText,
    showTrustedBy = true,
    trustedByAvatars = [],
    avatarSize = 'md',
    className,
}: TrustedByProps) {
    if (!showTrustedBy) {
        return null;
    }

    const avatarsToShow =
        trustedByAvatars && trustedByAvatars.length > 0
            ? trustedByAvatars.slice(0, MAX_AVATARS_TO_SHOW)
            : Array(MAX_AVATARS_TO_SHOW).fill(null);

    const avatarClasses =
        avatarSize === 'sm'
            ? 'h-6 w-6 -space-x-2'
            : 'h-12 w-12 -space-x-3';
    const avatarBorderClasses =
        avatarSize === 'sm'
            ? 'border-2'
            : 'border-2';

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        // Fallback to gradient if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const gradient = target.parentElement?.querySelector('.gradient-fallback');
        if (gradient) {
            (gradient as HTMLElement).style.display = 'block';
        }
    };

    return (
        <div className={className}>
            <div className={`flex items-center ${avatarClasses}`}>
                {avatarsToShow.map((avatar, index) => (
                    <div
                        key={index}
                        className={`relative ${avatarSize === 'sm' ? 'h-6 w-6' : 'h-12 w-12'} rounded-full ${avatarBorderClasses} border-white dark:border-slate-50 overflow-hidden bg-slate-200 dark:bg-slate-700`}
                    >
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={`Trusted partner ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                            />
                        ) : null}
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 gradient-fallback"
                            style={{ display: avatar ? 'none' : 'block' }}
                        />
                    </div>
                ))}
            </div>
            {trustedByText && (
                <p
                    className={`body-sm font-medium drop-shadow-md ${
                        avatarSize === 'sm'
                            ? 'text-slate-50/60 mt-3'
                            : 'text-slate-50/80 mt-4'
                    }`}
                >
                    {trustedByText}
                </p>
            )}
        </div>
    );
});

