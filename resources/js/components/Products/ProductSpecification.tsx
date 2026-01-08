import { useState } from 'react';
import { Lightbox } from '@/components/Lightbox';
import { GroupedSpecificationTable, FlatSpecificationTable } from './SpecificationTable';

interface ProductSpecificationProps {
    isStructured: boolean;
    groupedSpecs: Array<{ sectionLabel: string; rows: Array<{ label: string; value: string }> }>;
    flatSpecEntries: Array<[string, string]>;
    dimensionImage?: string | null;
}

export function ProductSpecification({
    isStructured,
    groupedSpecs,
    flatSpecEntries,
    dimensionImage,
}: ProductSpecificationProps) {
    const [selectedDimensionImage, setSelectedDimensionImage] = useState<string | null>(null);

    return (
        <>
            <div>
                <h2 className="h3 text-foreground mb-4 sm:mb-5 md:mb-6 pb-2 sm:pb-2.5 md:pb-3 border-b-2 border-border">
                    Technical Specification
                </h2>
                {isStructured ? (
                    <GroupedSpecificationTable groups={groupedSpecs} />
                ) : (
                    <FlatSpecificationTable entries={flatSpecEntries} />
                )}
                
                {/* Dimension Image */}
                {dimensionImage && (
                    <div className="mt-6 sm:mt-8 md:mt-10 space-y-3 sm:space-y-4">
                        <h3 className="text-sm sm:text-base font-semibold uppercase tracking-[0.05em] text-muted-foreground">
                            Dimensions
                        </h3>
                        <div className="rounded-lg overflow-hidden border border-border cursor-pointer hover:opacity-90 transition-opacity">
                            <div className="p-4 sm:p-6">
                                <img
                                    src={dimensionImage}
                                    alt="Product dimensions"
                                    className="w-full h-auto object-contain dark:invert"
                                    onClick={() => setSelectedDimensionImage(dimensionImage)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Lightbox
                image={selectedDimensionImage}
                alt="Product dimensions - enlarged view"
                onClose={() => setSelectedDimensionImage(null)}
                className="dark:invert"
            />
        </>
    );
}

