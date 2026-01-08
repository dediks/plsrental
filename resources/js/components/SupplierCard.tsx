import { Link } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SupplierCardProps {
    supplier: {
        id: number;
        name: string;
        slug: string;
        type?: string | null;
        description?: string | null;
        city?: string | null;
        country?: string | null;
        phone?: string | null;
        email?: string | null;
        website?: string | null;
    };
    baseUrl?: string;
}

const TYPE_LABELS: Record<string, string> = {
    distributor: 'Distributor',
    dealer: 'Dealer',
};

export function SupplierCard({ supplier, baseUrl = '/suppliers' }: SupplierCardProps) {
    return (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">
                    {supplier.name}
                </h3>
                {supplier.type && (
                    <Badge variant="secondary" className="text-xs font-semibold uppercase tracking-wider flex-shrink-0">
                        {TYPE_LABELS[supplier.type] || supplier.type}
                    </Badge>
                )}
            </div>

            {(supplier.city || supplier.country) && (
                <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                        {supplier.city}
                        {supplier.city && supplier.country && ', '}
                        {supplier.country}
                    </span>
                </div>
            )}

            <Link
                href={`${baseUrl}/${supplier.slug}`}
                className="mt-4 inline-block text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
                View Details →
            </Link>
        </div>
    );
}
