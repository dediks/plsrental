import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
    value?: string;
    placeholder?: string;
    onSearch?: (query: string) => void;
    autoFocus?: boolean;
}

export function SearchBar({
    value = '',
    placeholder = 'Search...',
    onSearch,
    autoFocus = false,
}: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState(value);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        } else {
            router.get(window.location.pathname, { search: searchQuery }, {
                preserveState: true,
                replace: true,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border border-input bg-input py-2 pl-10 pr-3 text-sm text-foreground placeholder-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                />
            </div>
        </form>
    );
}
