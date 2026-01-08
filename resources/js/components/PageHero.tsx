import { ReactNode } from 'react';

interface PageHeroProps {
    title: string;
    description?: string;
    children?: ReactNode; // For additional content like badges, buttons, etc.
    variant?: 'default' | 'product'; // Variant for different styling
}

export function PageHero({ title, description, children, variant = 'default' }: PageHeroProps) {
    const isProduct = variant === 'product';
    
    return (
        <section className={`relative py-6 sm:py-8 lg:py-10 xl:py-12 mt-0 md:mt-20 ${
            isProduct 
                ? 'bg-background border-b border-border' 
                : 'bg-slate-000/10 border-b border-slate-900 dark:bg-background dark:border-b dark:border-slate-50/20'
        }`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className={`h1 text-foreground ${
                    isProduct ? 'text-center sm:text-left' : ''
                } ${
                    isProduct ? '' : 'opacity-0 animate-[fadeInUp_0.5s_ease-out_0.1s_forwards]'
                }`}>
                    {title}
                </h1>
                {children && (
                    <div className={`${isProduct ? 'mt-2 sm:mt-3 mb-3 sm:mb-4' : 'mt-3 sm:mt-4'}`}>
                        {children}
                    </div>
                )}
                {description && (
                    <p className={`lead ${
                        isProduct ? 'max-w-3xl mt-2 sm:mt-3' : 'mt-3 sm:mt-4'
                    } ${
                        isProduct ? '' : 'opacity-0 animate-[fadeInUp_0.5s_ease-out_0.25s_forwards]'
                    }`}>
                        {description}
                    </p>
                )}
            </div>
        </section>
    );
}

