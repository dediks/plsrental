import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Search, X } from 'lucide-react';
import { router } from '@inertiajs/react';

interface MediaFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    typeFilter?: string;
    onTypeChange: (value: string) => void;
    unassignedFilter: boolean;
    onUnassignedChange: (checked: boolean) => void;
    onSearch: () => void;
    onClear: () => void;
    activeFilterCount: number;
    variant?: 'inline' | 'vertical';
    showApplyButton?: boolean;
    onClose?: () => void;
}

export function MediaFilters({
    searchQuery,
    onSearchChange,
    typeFilter,
    onTypeChange,
    unassignedFilter,
    onUnassignedChange,
    onSearch,
    onClear,
    activeFilterCount,
    variant = 'vertical',
    showApplyButton = true,
    onClose,
}: MediaFiltersProps) {
    const isInline = variant === 'inline';

    if (isInline) {
        return (
            <div className="flex flex-wrap items-end gap-4 justify-between">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px] max-w-md">
                        <Label htmlFor="search-input-desktop" className="text-sm font-medium">
                            Search
                        </Label>
                        <div className="relative mt-1.5">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search-input-desktop"
                                type="text"
                                placeholder="Filename, alt text, caption..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSearch();
                                    }
                                }}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="w-48">
                        <Label className="text-sm font-medium">Type</Label>
                        <Select
                            value={typeFilter || undefined}
                            onValueChange={onTypeChange}
                        >
                            <SelectTrigger className="mt-1.5">
                                <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="App\Models\Product">Products</SelectItem>
                                <SelectItem value="App\Models\Article">Articles</SelectItem>
                                <SelectItem value="App\Models\Gallery">Gallery</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {showApplyButton && (
                        <div>
                            <Label className="text-sm font-medium block mb-1.5 opacity-0">Actions</Label>
                            <div className="flex gap-2">
                                <Button onClick={onSearch}>
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                                {activeFilterCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        onClick={onClear}
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Label htmlFor="unassigned-switch" className="text-sm font-medium cursor-pointer">
                        Unassigned Only
                    </Label>
                    <Switch
                        id="unassigned-switch"
                        checked={unassignedFilter}
                        onCheckedChange={onUnassignedChange}
                    />
                </div>
            </div>
        );
    }

    // Vertical variant (for mobile sheet or sidebar)
    return (
        <div className="space-y-4 px-4 sm:px-6 py-4 sm:py-6">
            {/* Search */}
            <div>
                <Label htmlFor="search-input" className="text-sm font-medium mb-1.5 block">
                    Search
                </Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="search-input"
                        type="text"
                        placeholder="Filename, alt text, caption..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSearch();
                            }
                        }}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Type Filter */}
            <div>
                <Label className="text-sm font-medium mb-1.5 block">Type</Label>
                <Select
                    value={typeFilter || undefined}
                    onValueChange={onTypeChange}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="App\Models\Product">Products</SelectItem>
                        <SelectItem value="App\Models\Article">Articles</SelectItem>
                        <SelectItem value="App\Models\Gallery">Gallery</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Unassigned Toggle */}
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border bg-card">
                <div className="flex-1 pr-3">
                    <Label htmlFor="unassigned-switch-vertical" className="text-sm font-medium cursor-pointer block">
                        Unassigned Only
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Show only media not assigned to any item
                    </p>
                </div>
                <Switch
                    id="unassigned-switch-vertical"
                    checked={unassignedFilter}
                    onCheckedChange={onUnassignedChange}
                />
            </div>

            {/* Action Buttons */}
            {showApplyButton && (
                <div className="space-y-2 pt-3 border-t">
                    <Button onClick={onSearch} className="w-full" size="lg">
                        <Search className="h-4 w-4 mr-2" />
                        Apply Filters
                    </Button>
                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            onClick={onClear}
                            className="w-full"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Clear All Filters
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

