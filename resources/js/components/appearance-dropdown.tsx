import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export function useAppearanceToggle() {
    const { appearance, updateAppearance } = useAppearance();

    const isDark = appearance === 'dark' || (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const toggleAppearance = () => {
        // Toggle between light and dark only
        const newAppearance = isDark ? 'light' : 'dark';
        updateAppearance(newAppearance);
    };

    return { isDark, toggleAppearance };
}

export default function AppearanceToggleDropdown({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { isDark, toggleAppearance } = useAppearanceToggle();

    return (
        <div className={className} {...props}>
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleAppearance}
                className="h-9 w-9 rounded-md"
                aria-label="Toggle theme"
            >
                {isDark ? (
                    <Sun className="h-5 w-5" />
                ) : (
                    <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
    );
}
