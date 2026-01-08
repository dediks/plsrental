import { ProductCard } from '@/components/ProductCard';

interface SystemElement {
    id: number;
    name: string;
    slug: string;
    short_description?: string;
    featured_image?: string;
    media?: Array<{
        id: number;
        url?: string;
        path?: string;
        srcset?: string;
        is_featured: boolean;
        order?: number;
    }>;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
}

interface ProductSystemElementsProps {
    systemElements: SystemElement[];
}

export function ProductSystemElements({ systemElements }: ProductSystemElementsProps) {
    // Debug: Log system elements data
    if (process.env.NODE_ENV === 'development') {
        console.log('System Elements:', systemElements);
        systemElements.forEach((element) => {
            console.log(`Element ${element.id} (${element.name}):`, {
                media: element.media,
                featured_image: element.featured_image,
                mediaWithSrcset: element.media?.map(m => ({ url: m.url, srcset: m.srcset, hasSrcset: !!m.srcset })),
            });
        });
    }

    return (
        <div>
            <h2 className="h3 text-foreground mb-4 sm:mb-5 md:mb-6 pb-2 sm:pb-2.5 md:pb-3 border-b-2 border-border">
                System Elements
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4 sm:mt-5 md:mt-6">
                {systemElements.map((element) => (
                    <ProductCard key={element.id} product={element} />
                ))}
            </div>
        </div>
    );
}

