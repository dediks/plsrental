import { cn } from '@/lib/utils';
import { HOME_SECTION_DARK_GRADIENT, HOME_SECTION_DARK_BORDER } from '@/utils/home-constants';

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'muted' | 'light' | 'dark';
    style?: React.CSSProperties;
}

const variantStyles = {
    default: 'bg-gradient-to-b from-background/90 via-muted/20 to-background/80',
    muted: 'bg-gradient-to-b sm:bg-gradient-to-br from-muted/60 via-muted/40 to-muted/20',
    light: 'bg-gradient-to-b from-slate-50/80 via-slate-100/60 to-slate-100/80',
    dark: 'bg-gradient-to-b from-slate-800/90 via-slate-700/80 to-slate-800/90',
};

export function SectionWrapper({ children, className, variant = 'default', style }: SectionWrapperProps) {
    return (
        <section
            className={cn(
                'relative',
                variantStyles[variant],
                HOME_SECTION_DARK_GRADIENT,
                'py-16 sm:py-20 lg:py-24',
                'border-t border-border/50',
                HOME_SECTION_DARK_BORDER,
                className
            )}
            style={style}
        >
            {children}
        </section>
    );
}

