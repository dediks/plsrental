import { SpecificationTable } from './SpecificationTable';

interface ProductOverviewProps {
    shortDescription?: string;
    keySpecs: Array<{ label: string; value: string }>;
}

export function ProductOverview({ shortDescription, keySpecs }: ProductOverviewProps) {
    return (
        <div>
            <h2 className="h3 text-foreground mb-4 sm:mb-5 md:mb-6 pb-2 sm:pb-2.5 md:pb-3 border-b-2 border-border">
                Overview
            </h2>
            
            {/* Overview Text */}
            {shortDescription && (
                <p className="body-lg text-muted-foreground mb-6 sm:mb-8 md:mb-10">
                    {shortDescription}
                </p>
            )}

            {/* Key Specs Table */}
            {keySpecs.length > 0 && (
                <SpecificationTable specs={keySpecs} variant="table" />
            )}
        </div>
    );
}

