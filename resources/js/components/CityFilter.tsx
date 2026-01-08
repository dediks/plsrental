import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CityFilterProps {
    value: string;
    province: string;
    citiesByProvince: Record<string, string[]>;
    citiesWithData: string[];
    onValueChange: (city: string) => void;
    id?: string;
    variant?: 'default' | 'mobile';
}

export function CityFilter({
    value,
    province,
    citiesByProvince,
    citiesWithData,
    onValueChange,
    id = 'city-select',
    variant = 'default',
}: CityFilterProps) {
    // Get available cities for selected province
    const getAvailableCities = () => {
        if (province && province !== '__all__') {
            return citiesByProvince[province] || [];
        }
        return [];
    };

    const availableCities = getAvailableCities();
    const isDisabled = province === '__all__' || availableCities.length === 0;

    const labelClassName = variant === 'mobile' 
        ? 'text-sm font-semibold text-foreground mb-2 block'
        : 'text-sm font-semibold text-foreground mb-2 block';

    return (
        <div>
            <Label htmlFor={id} className={labelClassName}>
                City
            </Label>
            <Select
                value={value}
                onValueChange={onValueChange}
                disabled={isDisabled}
            >
                <SelectTrigger id={id} className="w-full">
                    <SelectValue 
                        placeholder={
                            province === '__all__' 
                                ? "Select a province first" 
                                : availableCities.length === 0 
                                    ? "No cities available" 
                                    : "Select a city"
                        } 
                    />
                </SelectTrigger>
                <SelectContent 
                    {...(variant === 'mobile' 
                        ? { position: 'popper' as const, className: 'z-[200] max-h-60 overflow-y-auto' } 
                        : { className: 'max-h-60 overflow-y-auto' }
                    )}
                >
                    <SelectItem value="__all__">All Cities</SelectItem>
                    {availableCities.map((city) => {
                        const hasData = citiesWithData.includes(city);
                        if (!hasData) {
                            return null; // Don't render cities without data
                        }
                        return (
                            <SelectItem key={city} value={city}>
                                {city}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}

