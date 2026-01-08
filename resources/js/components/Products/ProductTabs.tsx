import { cn } from '@/lib/utils';

interface Tab {
    id: string;
    label: string;
}

interface ProductTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function ProductTabs({ tabs, activeTab, onTabChange }: ProductTabsProps) {
    return (
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 border-b border-border">
            <nav className="overflow-x-auto -mx-1 px-1">
                <div className="flex justify-center md:justify-start items-center gap-2 sm:gap-4 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                'cursor-pointer px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium uppercase tracking-[0.05em] whitespace-nowrap border-b-2 transition-colors',
                                activeTab === tab.id
                                    ? 'border-foreground text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}

