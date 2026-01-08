import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface SystemElement {
    id: number;
    name: string;
    slug: string;
}

interface SystemElementsSelectorProps {
    value: Array<{ product_id: number; order: number }>;
    onChange: (value: Array<{ product_id: number; order: number }>) => void;
    availableProducts: SystemElement[];
    currentProductId?: number;
    error?: string;
}

export function SystemElementsSelector({
    value,
    onChange,
    availableProducts,
    currentProductId,
    error,
}: SystemElementsSelectorProps) {
    // Filter out current product from available products
    const filteredProducts = availableProducts.filter(
        (p) => p.id !== currentProductId
    );

    const addElement = () => {
        const firstAvailable = filteredProducts[0];
        if (firstAvailable) {
            const validValue = Array.isArray(value) 
                ? value.filter((el) => el && typeof el.product_id === 'number')
                : [];
            onChange([
                ...validValue,
                {
                    product_id: firstAvailable.id,
                    order: validValue.length,
                },
            ]);
        }
    };

    const removeElement = (index: number) => {
        const validValue = Array.isArray(value) 
            ? value.filter((el) => el && typeof el.product_id === 'number')
            : [];
        onChange(validValue.filter((_, i) => i !== index));
    };

    const updateElement = (index: number, productId: number) => {
        const validValue = Array.isArray(value) 
            ? value.filter((el) => el && typeof el.product_id === 'number')
            : [];
        const newValue = [...validValue];
        newValue[index] = {
            ...newValue[index],
            product_id: productId,
        };
        onChange(newValue);
    };

    const moveElement = (index: number, direction: 'up' | 'down') => {
        const validValue = Array.isArray(value) 
            ? value.filter((el) => el && typeof el.product_id === 'number')
            : [];
        const newValue = [...validValue];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newValue.length) {
            return;
        }

        // Swap orders
        const temp = newValue[index].order;
        newValue[index].order = newValue[targetIndex].order;
        newValue[targetIndex].order = temp;

        // Swap positions
        [newValue[index], newValue[targetIndex]] = [
            newValue[targetIndex],
            newValue[index],
        ];

        onChange(newValue);
    };

    const getProductName = (productId: number): string => {
        const product = availableProducts.find((p) => p.id === productId);
        return product?.name || 'Unknown Product';
    };

    // Ensure value is an array and filter out invalid entries
    const validValue = Array.isArray(value) 
        ? value.filter((el) => el && typeof el.product_id === 'number')
        : [];

    return (
        <div className="space-y-3">
            {validValue.map((element, index) => (
                <div
                    key={index}
                    className="flex items-center gap-2 p-3 border border-border rounded-lg bg-card"
                >
                    <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => moveElement(index, 'up')}
                            disabled={index === 0}
                            className="h-8 w-8"
                            aria-label="Move up"
                        >
                            <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => moveElement(index, 'down')}
                            disabled={index === validValue.length - 1}
                            className="h-8 w-8"
                            aria-label="Move down"
                        >
                            <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <Select
                        value={element.product_id?.toString() || ''}
                        onValueChange={(val) =>
                            updateElement(index, parseInt(val))
                        }
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredProducts.map((product) => (
                                <SelectItem
                                    key={product.id}
                                    value={product.id.toString()}
                                >
                                    {product.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                        Order: {element.order}
                    </span>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeElement(index)}
                        className="text-destructive hover:text-destructive"
                        aria-label="Remove element"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={addElement}
                className="w-full"
                disabled={filteredProducts.length === 0}
            >
                Add System Element
            </Button>

            {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
            )}
        </div>
    );
}


