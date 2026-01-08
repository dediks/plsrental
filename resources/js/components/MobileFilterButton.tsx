import { SlidersHorizontal } from 'lucide-react';

interface MobileFilterButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    activeFilterCount: number;
}

export function MobileFilterButton({ onClick, activeFilterCount }: MobileFilterButtonProps) {
    return (
        <button
            type="button"
            onClick={(e) => onClick(e)}
            className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer flex-shrink-0"
        >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {activeFilterCount}
                </span>
            )}
        </button>
    );
}

