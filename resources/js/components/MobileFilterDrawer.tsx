import { X } from 'lucide-react';
import { ReactNode } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface ActiveFilter {
    key: string;
    label: string;
    value: string;
}

interface MobileFilterDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activeFilterCount: number;
    activeFilters: ActiveFilter[];
    onClearAll: () => void;
    onClearFilter: (key: string) => void;
    children: ReactNode;
    onApplyFilters?: () => void;
    showApplyButton?: boolean;
}

export function MobileFilterDrawer({
    open,
    onOpenChange,
    activeFilterCount,
    activeFilters,
    onClearAll,
    onClearFilter,
    children,
    onApplyFilters,
    showApplyButton = false,
}: MobileFilterDrawerProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent 
                side="bottom" 
                className="max-h-[85vh] min-h-[85vh] flex flex-col rounded-t-2xl border-t-2 border-border/50 p-0 [&>button]:hidden bg-background"
                onOpenAutoFocus={(e) => {
                    // Focus on the first input in the drawer
                    const target = e.currentTarget as HTMLElement | null;
                    if (target) {
                        const firstInput = target.querySelector('input, button, [role="combobox"]') as HTMLElement | null;
                        if (firstInput) {
                            setTimeout(() => firstInput.focus(), 0);
                            e.preventDefault();
                        }
                    }
                }}
                onCloseAutoFocus={(e) => {
                    // Prevent focus from returning to the trigger button
                    e.preventDefault();
                }}
            >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                    <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
                </div>

                {/* Header */}
                <SheetHeader className="px-6 pb-4 border-b border-border/50 flex-shrink-0">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4 dark:border-b-white">
                        <SheetTitle className="text-xl font-semibold">Filters</SheetTitle>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            aria-label="Close filters"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <SheetDescription className="sr-only">
                        Filter rental partners by search, province, and city
                    </SheetDescription>
                </SheetHeader>

                {/* Filter Content - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {children}
                </div>

                {/* Apply Filters Button */}
                {showApplyButton && onApplyFilters && (
                    <div className="px-6 pb-6 flex-shrink-0 border-t border-border/50 pt-4">
                        <Button 
                            type="button" 
                            className="w-full" 
                            onClick={() => {
                                onApplyFilters();
                                onOpenChange(false);
                            }}
                        >
                            Apply Filters
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

