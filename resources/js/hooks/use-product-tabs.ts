import { useState, useMemo } from 'react';
import {
    isStructuredFormat,
    groupSpecificationsForDisplay,
} from '@/lib/specifications';

interface ProductData {
    short_description?: string;
    key_specs?: Array<{ label: string; value: string }>;
    specifications?: Record<string, string>;
    dimension_image?: string | null;
    system_elements?: Array<unknown>;
    downloads?: Array<unknown>;
    description?: string;
}

interface Tab {
    id: string;
    label: string;
    hasContent: boolean;
}

export function useProductTabs(product: ProductData) {
    // Handle specifications - check if structured format or flat
    const specifications = product.specifications || {};
    const isStructured = isStructuredFormat(specifications);
    const groupedSpecs = isStructured
        ? groupSpecificationsForDisplay(specifications)
        : [];
    const flatSpecEntries = isStructured
        ? []
        : Object.entries(specifications);

    // Check which sections should be shown
    const keySpecs = product.key_specs ?? [];
    const hasOverview = !!product.short_description || keySpecs.length > 0;
    const hasSpecification =
        (isStructured && groupedSpecs.length > 0) ||
        (!isStructured && flatSpecEntries.length > 0) ||
        !!product.dimension_image;
    const hasSystemElements =
        product.system_elements && product.system_elements.length > 0;
    const hasDownloads = product.downloads && product.downloads.length > 0;
    const hasDescription = !!product.description;

    // Determine initial active tab
    const getInitialTab = (): string => {
        if (hasOverview) {
            return 'overview';
        }
        if (hasSpecification) {
            return 'specification';
        }
        if (hasSystemElements) {
            return 'system-elements';
        }
        if (hasDownloads) {
            return 'downloads';
        }
        if (hasDescription) {
            return 'description';
        }
        return 'overview';
    };

    // Tab navigation state
    const [activeTab, setActiveTab] = useState<string>(getInitialTab());

    // Tabs configuration
    const tabs = useMemo<Tab[]>(() => {
        return [
            { id: 'overview', label: 'Overview', hasContent: hasOverview },
            { id: 'specification', label: 'Full Specs', hasContent: hasSpecification },
            { id: 'system-elements', label: 'System Elements', hasContent: hasSystemElements },
            { id: 'downloads', label: 'Downloads', hasContent: hasDownloads },
            { id: 'description', label: 'Description', hasContent: hasDescription },
        ].filter((tab) => tab.hasContent);
    }, [hasOverview, hasSpecification, hasSystemElements, hasDownloads, hasDescription]);

    return {
        activeTab,
        setActiveTab,
        tabs,
        hasOverview,
        hasSpecification,
        hasSystemElements,
        hasDownloads,
        hasDescription,
        isStructured,
        groupedSpecs,
        flatSpecEntries,
        keySpecs,
    };
}

