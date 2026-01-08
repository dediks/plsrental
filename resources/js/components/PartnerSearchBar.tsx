import { forwardRef } from 'react';
import { Search } from 'lucide-react';

interface PartnerSearchBarProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    placeholder?: string;
    className?: string;
}

export const PartnerSearchBar = forwardRef<HTMLInputElement, PartnerSearchBarProps>(
    ({ id, value, onChange, onKeyDown, onFocus, onBlur, placeholder = 'Search by name', className = '' }, ref) => {
        return (
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                    ref={ref}
                    id={id}
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    className={`w-full rounded-md border border-input dark:border-slate-600 bg-input/60 pl-10 pr-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring ${className}`}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>
        );
    }
);

PartnerSearchBar.displayName = 'PartnerSearchBar';

