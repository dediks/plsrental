export interface ActiveFilter {
    key: string;
    label: string;
    value: string;
}

interface FilterConfig {
    search?: string;
    province?: string;
    city?: string;
    distributors?: boolean;
    dealers?: boolean;
}

interface FilterDefinition {
    key: string;
    label: string;
    getValue: (filters: FilterConfig) => string | null;
}

interface UseActiveFiltersOptions {
    filters: FilterConfig;
    filterDefinitions: FilterDefinition[];
}

export function useActiveFilters({ filters, filterDefinitions }: UseActiveFiltersOptions): {
    activeFilters: ActiveFilter[];
    activeFilterCount: number;
    hasActiveFilters: boolean;
} {
    const activeFilters: ActiveFilter[] = [];

    filterDefinitions.forEach(({ key, label, getValue }) => {
        const value = getValue(filters);
        if (value) {
            activeFilters.push({ key, label, value });
        }
    });

    const activeFilterCount = activeFilters.length;
    const hasActiveFilters = activeFilterCount > 0;

    return {
        activeFilters,
        activeFilterCount,
        hasActiveFilters,
    };
}

