/**
 * Utility functions for encoding/decoding flexible product specifications
 * 
 * Storage format (flat JSON):
 * - Value keys: `spec__{sectionSlug}__{rowSlug}` → value string
 * - Section labels: `spec_section_label__{sectionSlug}` → original section name
 * - Row labels: `spec_label__{sectionSlug}__{rowSlug}` → original row label
 */

export interface SpecSection {
    id: string;
    label: string;
    rows: SpecRow[];
}

export interface SpecRow {
    id: string;
    label: string;
    value: string;
}

/**
 * Convert a string to a URL-friendly slug
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '_')
        .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique ID for sections/rows
 */
function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

/**
 * Decode flat specifications format into structured sections/rows
 */
export function decodeSpecifications(
    flatSpecs: Record<string, string> | null | undefined
): SpecSection[] {
    if (!flatSpecs || typeof flatSpecs !== 'object') {
        return [];
    }

    const sectionsMap = new Map<string, SpecSection>();

    // Iterate through all keys
    for (const [key, value] of Object.entries(flatSpecs)) {
        // Check if it's a section label
        if (key.startsWith('spec_section_label__')) {
            const sectionSlug = key.replace('spec_section_label__', '');
            if (!sectionsMap.has(sectionSlug)) {
                sectionsMap.set(sectionSlug, {
                    id: sectionSlug,
                    label: value,
                    rows: [],
                });
            } else {
                sectionsMap.get(sectionSlug)!.label = value;
            }
        }
        // Check if it's a row label
        else if (key.startsWith('spec_label__')) {
            const parts = key.replace('spec_label__', '').split('__');
            if (parts.length === 2) {
                const [sectionSlug, rowSlug] = parts;
                if (!sectionsMap.has(sectionSlug)) {
                    sectionsMap.set(sectionSlug, {
                        id: sectionSlug,
                        label: '',
                        rows: [],
                    });
                }
                const section = sectionsMap.get(sectionSlug)!;
                const existingRow = section.rows.find((r) => r.id === rowSlug);
                if (existingRow) {
                    existingRow.label = value;
                } else {
                    section.rows.push({
                        id: rowSlug,
                        label: value,
                        value: '',
                    });
                }
            }
        }
        // Check if it's a row value
        else if (key.startsWith('spec__')) {
            const parts = key.replace('spec__', '').split('__');
            if (parts.length === 2) {
                const [sectionSlug, rowSlug] = parts;
                if (!sectionsMap.has(sectionSlug)) {
                    sectionsMap.set(sectionSlug, {
                        id: sectionSlug,
                        label: '',
                        rows: [],
                    });
                }
                const section = sectionsMap.get(sectionSlug)!;
                const existingRow = section.rows.find((r) => r.id === rowSlug);
                if (existingRow) {
                    existingRow.value = value;
                } else {
                    section.rows.push({
                        id: rowSlug,
                        label: '',
                        value: value,
                    });
                }
            }
        }
    }

    // Filter out sections with no rows and sort rows
    const sections = Array.from(sectionsMap.values())
        .filter((section) => section.rows.length > 0)
        .map((section) => ({
            ...section,
            rows: section.rows.filter((row) => row.label || row.value),
        }))
        .filter((section) => section.rows.length > 0);

    return sections;
}

/**
 * Encode structured sections/rows into flat specifications format
 */
export function encodeSpecifications(
    sections: SpecSection[]
): Record<string, string> {
    const flat: Record<string, string> = {};

    for (const section of sections) {
        if (!section.label.trim()) continue;

        const sectionSlug = slugify(section.label) || generateId();
        flat[`spec_section_label__${sectionSlug}`] = section.label;

        for (const row of section.rows) {
            if (!row.label.trim() && !row.value.trim()) continue;

            const rowSlug = slugify(row.label) || generateId();
            flat[`spec_label__${sectionSlug}__${rowSlug}`] = row.label;
            flat[`spec__${sectionSlug}__${rowSlug}`] = row.value || '';
        }
    }

    return flat;
}

/**
 * Check if specifications use the new structured format
 */
export function isStructuredFormat(
    specs: Record<string, string> | null | undefined
): boolean {
    if (!specs || typeof specs !== 'object') {
        return false;
    }

    return Object.keys(specs).some((key) => key.startsWith('spec__'));
}

/**
 * Group flat specifications by section for display
 */
export function groupSpecificationsForDisplay(
    flatSpecs: Record<string, string> | null | undefined
): Array<{ sectionLabel: string; rows: Array<{ label: string; value: string }> }> {
    const sections = decodeSpecifications(flatSpecs);
    return sections.map((section) => ({
        sectionLabel: section.label,
        rows: section.rows.map((row) => ({
            label: row.label,
            value: row.value,
        })),
    }));
}


