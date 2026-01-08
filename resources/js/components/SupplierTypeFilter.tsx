import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SupplierTypeFilterProps {
    distributors: boolean;
    dealers: boolean;
    onDistributorsChange: (checked: boolean) => void;
    onDealersChange: (checked: boolean) => void;
    idPrefix?: string;
    variant?: 'default' | 'mobile';
}

export function SupplierTypeFilter({
    distributors,
    dealers,
    onDistributorsChange,
    onDealersChange,
    idPrefix = 'filter',
    variant = 'default',
}: SupplierTypeFilterProps) {
    const labelClassName = variant === 'mobile' 
        ? 'text-sm font-semibold text-foreground mb-3 block'
        : 'text-sm font-semibold text-foreground mb-3 block';

    const checkboxClassName = variant === 'default' 
        ? 'h-4 w-4 text-primary border-primary'
        : 'h-4 w-4 text-primary border-primary';

    return (
        <div className="space-y-4">
            <Label className={labelClassName}>
                Supplier Type
            </Label>
            <div className="space-y-3">
                <div className="flex items-center space-x-3 group">
                    <Checkbox
                        id={`${idPrefix}-distributors`}
                        className={checkboxClassName}
                        checked={distributors}
                        onCheckedChange={(checked) => onDistributorsChange(checked === true)}
                    />
                    <Label
                        htmlFor={`${idPrefix}-distributors`}
                        className="text-sm font-medium text-foreground cursor-pointer group-hover:text-primary transition-colors flex-1"
                    >
                        Distributors
                    </Label>
                </div>
                <div className="flex items-center space-x-3 group">
                    <Checkbox
                        id={`${idPrefix}-dealers`}
                        className={checkboxClassName}
                        checked={dealers}
                        onCheckedChange={(checked) => onDealersChange(checked === true)}
                    />
                    <Label
                        htmlFor={`${idPrefix}-dealers`}
                        className="text-sm font-medium text-foreground cursor-pointer group-hover:text-primary transition-colors flex-1"
                    >
                        Dealers
                    </Label>
                </div>
            </div>
        </div>
    );
}

