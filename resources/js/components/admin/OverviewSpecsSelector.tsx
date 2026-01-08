import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { decodeSpecifications } from '@/lib/specifications';

interface OverviewSpec {
    section: string;
    label: string;
}

interface OverviewSpecsSelectorProps {
    value: OverviewSpec[];
    onChange: (value: OverviewSpec[]) => void;
    specifications: Record<string, string>;
    error?: string;
}

export function OverviewSpecsSelector({
    value,
    onChange,
    specifications,
    error,
}: OverviewSpecsSelectorProps) {
    // Decode specifications to get available options
    const sections = decodeSpecifications(specifications);

    // Build flat list of all available spec rows
    const availableOptions = sections.flatMap((section) =>
        section.rows
            .filter((row) => row.label && row.value)
            .map((row) => ({
                section: section.label,
                label: row.label,
                key: `${section.label}::${row.label}`,
            }))
    );

    // Get options that are not yet selected
    const selectedKeys = new Set(
        value.map((item) => `${item.section}::${item.label}`)
    );
    const unselectedOptions = availableOptions.filter(
        (opt) => !selectedKeys.has(opt.key)
    );

    const addSpec = (option: { section: string; label: string }) => {
        onChange([...value, { section: option.section, label: option.label }]);
    };

    const removeSpec = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newValue = [...value];
        [newValue[index - 1], newValue[index]] = [
            newValue[index],
            newValue[index - 1],
        ];
        onChange(newValue);
    };

    const moveDown = (index: number) => {
        if (index === value.length - 1) return;
        const newValue = [...value];
        [newValue[index], newValue[index + 1]] = [
            newValue[index + 1],
            newValue[index],
        ];
        onChange(newValue);
    };

    return (
        <div className="space-y-4">
            {/* Selected specs list */}
            {value.length > 0 && (
                <div className="space-y-2">
                    {value.map((spec, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 p-3 border border-border rounded-lg bg-card"
                        >
                            <div className="flex-1">
                                <div className="text-sm font-medium text-foreground">
                                    {spec.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {spec.section}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => moveUp(index)}
                                    disabled={index === 0}
                                    className="h-8 w-8"
                                    aria-label="Move up"
                                >
                                    <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => moveDown(index)}
                                    disabled={index === value.length - 1}
                                    className="h-8 w-8"
                                    aria-label="Move down"
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeSpec(index)}
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    aria-label="Remove spec"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add new spec dropdown */}
            {unselectedOptions.length > 0 ? (
                <Select
                    value=""
                    onValueChange={(selectedKey) => {
                        const option = unselectedOptions.find(
                            (opt) => opt.key === selectedKey
                        );
                        if (option) {
                            addSpec(option);
                        }
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a spec to add to overview" />
                    </SelectTrigger>
                    <SelectContent>
                        {unselectedOptions.map((option) => (
                            <SelectItem key={option.key} value={option.key}>
                                <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {option.section}
                                    </div>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <div className="text-sm text-muted-foreground p-3 border border-border rounded-lg bg-muted/30">
                    {availableOptions.length === 0
                        ? 'No specifications available. Add specifications first.'
                        : 'All available specs have been added to the overview.'}
                </div>
            )}

            {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
            )}
        </div>
    );
}

