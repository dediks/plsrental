import { Link } from '@inertiajs/react';
import { Image, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getFeaturedImage } from '@/utils/media-helpers';
import { useImageLoader } from '@/hooks/use-image-loader';

interface ProductCardProps {
    product: {
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
        }>;
        category?: {
            id: number;
            name: string;
            slug: string;
        };
    };
}

export function ProductCard({ product }: ProductCardProps) {
    const { url: imageUrl, srcset: imageSrcset } = getFeaturedImage(
        product.media,
        product.featured_image
    );
    
    const { isImageLoaded, handleImageLoad, setImgRef } = useImageLoader(imageUrl);

    return (
        <div 
            className="dark:bg-slate-800 group relative block h-full overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-300 hover:border-border hover:shadow-lg dark:hover:shadow-black/20"
            style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
            }}
        >
            <Link
                href={`/products/${product.slug}`}
                className="block"
            >
                {/* Product Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted dark:bg-slate-800">
                    <div 
                        className="absolute inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-300 dark:hover:opacity-50 dark:opacity-100 dark:bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.32)_0%,_rgba(255,255,255,0)_95%)]"
                        style={{
                            willChange: 'opacity',
                        }}
                    />
                    {imageUrl ? (
                        <>
                            {/* Skeleton placeholder */}
                            {!isImageLoaded && (
                                <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-none" />
                            )}
                            <img
                                key={`product-${product.id}-${imageUrl}`}
                                ref={setImgRef}
                                src={imageUrl ?? undefined}
                                srcSet={imageSrcset}
                                sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 360px"
                                alt={product.name}
                                className={`h-full w-full object-contain relative z-10 transition-opacity duration-300 ${
                                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{
                                    transform: 'translateZ(0)',
                                    willChange: 'opacity',
                                }}
                                loading="lazy"
                                onLoad={handleImageLoad}
                            />
                            <div 
                                className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    willChange: 'opacity',
                                }}
                            />
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center relative z-10">
                            <Image className="h-16 w-16 text-muted-foreground/20" />
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-5">
                    <h3 className="h5 hover:text-accent hover:font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 min-h-[3.5rem] dark:text-white">
                        {product.name}
                    </h3>
                    
                    <p className="mt-2 body-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                        {product.short_description || '\u00A0'}
                    </p>
                </div>
            </Link>
            
            {/* View link and category */}
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex items-center justify-between gap-3">
                {product.category && (
                    <span className="body-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {product.category.name}
                    </span>
                )}
                <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 body-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded min-h-[44px] min-w-[44px] px-3 py-2"
                    onClick={(e) => {
                        // Prevent event bubbling since the parent card is also a link
                        e.stopPropagation();
                    }}
                >
                    <span>Detail</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}
