import { Trash, Trash2, X } from 'lucide-react';

interface ActiveFilter {
    key: string;
    label: string;
    value: string;
}

interface ActiveFiltersBarProps {
    activeFilters: ActiveFilter[];
    onClearFilter: (key: string) => void;
    onClearAll: () => void;
}

export function ActiveFiltersBar({
    activeFilters,
    onClearFilter,
    onClearAll,
}: ActiveFiltersBarProps) {
    if (activeFilters.length === 0) {
        return null;
    }

    return (
        <div className="mb-4 rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="hidden md:block text-sm font-medium text-muted-foreground">
                        Active filters:
                    </span>
                    {activeFilters.map((filter) => (
                        <span key={filter.key} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            <span>{filter.label}: {filter.value}</span>
                            <button
                                type="button"
                                onClick={() => onClearFilter(filter.key)}
                                className="ml-1 rounded-full hover:bg-primary/20 p-0.5 transition-colors cursor-pointer"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={onClearAll}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    <Trash2 className="h-3 w-3 md:hidden block" />
                    <span className="hidden md:block">Clear all</span>
                </button>
            </div>
        </div>
    );
}

