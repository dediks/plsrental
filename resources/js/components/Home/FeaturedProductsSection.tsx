import { Link } from '@inertiajs/react';
import { ArrowRight, ArrowRightCircle } from 'lucide-react';
import type { FeaturedProduct } from '@/types/home';
import { ProductCard } from '@/components/ProductCard';
import { SectionWrapper } from '@/components/Section/SectionWrapper';
import { SectionHeader } from '@/components/Section/SectionHeader';

interface FeaturedProductsSectionProps {
    products: FeaturedProduct[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
    if (products.length === 0) {
        return null;
    }

    return (
        <SectionWrapper 
            variant="light" 
            className="shadow-inner opacity-0 animate-[fadeInUp_0.7s_ease-out_0.3s_forwards]"
            style={{
                contentVisibility: 'auto',
                containIntrinsicSize: 'auto 500px',
            }}
        >
            <div className="mx-auto max-w-7xl px-4 md:px-16 sm:px-8 lg:px-12">
                <SectionHeader title="Our Premium Products" viewAllHref="/products" />
                <div className="relative">
                    {/* Horizontal Scroll Container */}
                    <div 
                        className="overflow-x-auto scrollbar-hide -mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
                        style={{
                            willChange: 'scroll-position',
                            overscrollBehaviorX: 'contain',
                            WebkitOverflowScrolling: 'touch',
                            transform: 'translateZ(0)',
                        }}
                    >
                        <div className="flex gap-5 pb-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px]"
                                    style={{
                                        transform: 'translateZ(0)',
                                        willChange: 'transform',
                                    }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                            <div 
                                className="dark:bg-slate-900 rounded-lg sm:hidden min-h-full flex items-center justify-center flex-shrink-0 w-[180px] sm:w-[320px] lg:w-[360px]"
                                style={{
                                    transform: 'translateZ(0)',
                                }}
                            >
                                <div className="flex items-center justify-center">
                                    <Link
                                        aria-label="View all products"
                                        href="/products"
                                        className="inline-flex md:hidden body-sm font-medium text-muted-foreground dark:text-slate-300 hover:text-foreground dark:hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm px-2 py-1 hover:translate-x-1 items-center gap-1"
                                    >
                                        <ArrowRightCircle className="min-h-full" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 border-b pb-5 font-bold border-border/50 flex justify-center md:hidden">
                        <Link
                            href="/products"
                            className="bg-primary dark:bg-slate-500/50 text-primary-foreground inline-flex md:hidden body-sm font-medium dark:text-slate-100 hover:text-foreground dark:hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-2xl px-4 py-2 hover:translate-x-1 items-center gap-1"
                        >
                            <span>View all products</span> <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}

