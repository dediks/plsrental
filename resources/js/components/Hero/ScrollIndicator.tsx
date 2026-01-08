import { memo } from 'react';

interface ScrollIndicatorProps {
    show?: boolean;
}

export const ScrollIndicator = memo(function ScrollIndicator({
    show = true,
}: ScrollIndicatorProps) {
    if (!show) {
        return null;
    }

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div className="h-8 w-0.5 bg-foreground/40" />
        </div>
    );
});

