import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    decodeSpecifications,
    encodeSpecifications,
    type SpecSection,
    type SpecRow,
    isStructuredFormat,
} from '@/lib/specifications';

interface ProductSpecificationsEditorProps {
    value: Record<string, string>;
    onChange: (value: Record<string, string>) => void;
    error?: string;
}

export function ProductSpecificationsEditor({
    value,
    onChange,
    error,
}: ProductSpecificationsEditorProps) {
    // Decode flat specs into structured format
    const [sections, setSections] = useState<SpecSection[]>(() => {
        // If it's already structured format, decode it
        if (isStructuredFormat(value)) {
            return decodeSpecifications(value);
        }
        // Otherwise, start with empty sections
        return [];
    });

    // Update flat format whenever sections change
    useEffect(() => {
        const flat = encodeSpecifications(sections);
        onChange(flat);
    }, [sections, onChange]);

    const addSection = () => {
        const newSection: SpecSection = {
            id: Math.random().toString(36).substring(2, 9),
            label: '',
            rows: [],
        };
        setSections([...sections, newSection]);
    };

    const removeSection = (sectionId: string) => {
        setSections(sections.filter((s) => s.id !== sectionId));
    };

    const updateSectionLabel = (sectionId: string, label: string) => {
        setSections(
            sections.map((s) => (s.id === sectionId ? { ...s, label } : s))
        );
    };

    const addRow = (sectionId: string) => {
        setSections(
            sections.map((s) => {
                if (s.id === sectionId) {
                    return {
                        ...s,
                        rows: [
                            ...s.rows,
                            {
                                id: Math.random().toString(36).substring(2, 9),
                                label: '',
                                value: '',
                            },
                        ],
                    };
                }
                return s;
            })
        );
    };

    const removeRow = (sectionId: string, rowId: string) => {
        setSections(
            sections.map((s) => {
                if (s.id === sectionId) {
                    return {
                        ...s,
                        rows: s.rows.filter((r) => r.id !== rowId),
                    };
                }
                return s;
            })
        );
    };

    const updateRow = (
        sectionId: string,
        rowId: string,
        field: 'label' | 'value',
        newValue: string
    ) => {
        setSections(
            sections.map((s) => {
                if (s.id === sectionId) {
                    return {
                        ...s,
                        rows: s.rows.map((r) =>
                            r.id === rowId ? { ...r, [field]: newValue } : r
                        ),
                    };
                }
                return s;
            })
        );
    };

    return (
        <div className="space-y-4">
            {sections.map((section, sectionIndex) => (
                <div
                    key={section.id}
                    className="border border-border rounded-lg p-4 space-y-4 bg-card"
                >
                    <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Section name (e.g., Electroacoustic specs)"
                            value={section.label}
                            onChange={(e) =>
                                updateSectionLabel(section.id, e.target.value)
                            }
                            className="flex-1 font-semibold"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeSection(section.id)}
                            className="text-destructive hover:text-destructive"
                            aria-label="Delete section"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2 pl-6">
                        {section.rows.map((row) => (
                            <div key={row.id} className="space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Label (e.g., Usable bandwidth)"
                                        value={row.label}
                                        onChange={(e) =>
                                            updateRow(
                                                section.id,
                                                row.id,
                                                'label',
                                                e.target.value
                                            )
                                        }
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            removeRow(section.id, row.id)
                                        }
                                        aria-label="Delete row"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    placeholder="Value (e.g., 45 Hz – 20 kHz or HTML like &lt;p&gt;Full element: 155 dB&lt;/p&gt;)"
                                    value={row.value}
                                    onChange={(e) =>
                                        updateRow(
                                            section.id,
                                            row.id,
                                            'value',
                                            e.target.value
                                        )
                                    }
                                    rows={3}
                                    className="w-full resize-y font-mono text-sm"
                                />
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addRow(section.id)}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Row
                        </Button>
                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={addSection}
                className="w-full"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
            </Button>

            {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
            )}
        </div>
    );
}


