import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchOverlayProps {
    isOpen: boolean;
    isVisible: boolean;
    query: string;
    onQueryChange: (query: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    topOffset: number;
    height: string;
}

export function SearchOverlay({
    isOpen,
    isVisible,
    query,
    onQueryChange,
    onSubmit,
    onClose,
    topOffset,
    height,
}: SearchOverlayProps) {
    if (!isOpen && !isVisible) {
        return null;
    }

    return (
        <div
            className={`fixed md:-mt-4 2xl:mt-0 opacity-0 border-t border-border dark:border-primary/10 left-0 right-0 bottom-0 z-[100] bg-background/80 dark:bg-gradient-to-r dark:from-slate-900/40 dark:via-slate-800/30 dark:to-slate-900/40 backdrop-blur-md shadow-lg dark:shadow-primary/5 duration-100 ease-in-out w-full ${
                isVisible && isOpen
                    ? 'opacity-80 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
            }`}
            style={{
                top: `${topOffset}px`,
                height,
            }}
        >
            <div className="flex h-full flex-col">
                {/* Close Button */}
                <div className="flex justify-end p-2 md:p-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close search"
                        className="text-foreground hover:text-foreground/70"
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {/* Search Content */}
                <div
                    className={`flex items-start md:items-center justify-center px-4 md:px-6 pt-4 md:pt-0 transition-all duration-100 ease-in-out ${
                        isVisible ? 'opacity-100 translate-y-0 delay-75' : 'opacity-0 translate-y-4 delay-0'
                    }`}
                >
                    <form onSubmit={onSubmit} className="w-full max-w-4xl">
                        <div className="space-y-3 md:space-y-6">
                            {/* Search Label */}
                            <label htmlFor="search-input" className="block text-2xl md:text-4xl font-semibold text-foreground">
                                Search
                            </label>

                            {/* Search Input */}
                            <div className="relative">
                                <Input
                                    id="search-input"
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        onQueryChange(e.target.value);
                                    }}
                                    placeholder=""
                                    autoFocus
                                    className="h-10 md:h-16 border-0 border-b-2 border-foreground rounded-none bg-transparent text-lg md:text-2xl text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-foreground"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    variant="default"
                                    size="default"
                                    className="px-4 md:px-8 text-sm md:text-base h-9 md:h-10"
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
