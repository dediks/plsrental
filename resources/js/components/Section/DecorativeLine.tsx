import { cn } from '@/lib/utils';

interface DecorativeLineProps {
    alignment?: 'left' | 'center' | 'right';
    className?: string;
}

export function DecorativeLine({ alignment = 'left', className }: DecorativeLineProps) {
    const alignmentClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    };

    return (
        <div className={cn('mt-4 sm:mt-6 lg:mt-8 flex', alignmentClasses[alignment], className)}>
            <div className="h-px w-20 sm:w-24 lg:w-28 bg-gradient-to-r from-foreground/40 via-foreground/60 to-transparent dark:from-white/40 dark:via-white/60 dark:to-transparent" />
        </div>
    );
}

