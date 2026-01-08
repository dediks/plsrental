import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProvinceFilterProps {
    value: string;
    provinces: string[];
    provincesWithData: string[];
    onValueChange: (province: string) => void;
    id?: string;
    variant?: 'default' | 'mobile';
}

export function ProvinceFilter({
    value,
    provinces,
    provincesWithData,
    onValueChange,
    id = 'province-select',
    variant = 'default',
}: ProvinceFilterProps) {
    const labelClassName = variant === 'mobile' 
        ? 'text-sm font-semibold text-foreground mb-2 block'
        : 'text-sm font-semibold text-foreground mb-2 block';

    return (
        <div>
            <Label htmlFor={id} className={labelClassName}>
                Province
            </Label>
            <Select
                value={value}
                onValueChange={onValueChange}
            >
                <SelectTrigger id={id} className="w-full">
                    <SelectValue placeholder="Select a province" />
                </SelectTrigger>
                <SelectContent {...(variant === 'mobile' ? { position: 'popper' as const, className: 'z-[200]' } : {})}>
                    <SelectItem value="__all__">All Provinces</SelectItem>
                    {provinces.map((province) => {
                        const hasData = provincesWithData.includes(province);
                        if (!hasData) {
                            return null; // Don't render provinces without data
                        }
                        return (
                            <SelectItem 
                                key={province} 
                                value={province}
                            >
                                {province}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}

