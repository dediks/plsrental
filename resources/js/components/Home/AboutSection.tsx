import { cn } from '@/lib/utils';
import type { AboutConfig } from '@/types/home';
import { DecorativeLine } from '@/components/Section/DecorativeLine';
import { SectionWrapper } from '@/components/Section/SectionWrapper';

interface AboutSectionProps {
    about: AboutConfig;
}

export function AboutSection({ about }: AboutSectionProps) {
    const hasImage = Boolean(about.image);
    
    // Determine content order classes
    const contentOrderClasses = cn(
        'text-center lg:text-left',
        hasImage && about.imagePositionMobile === 'top' ? 'order-2' : 'order-1',
        hasImage && about.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
    );

    // Determine image order classes
    const imageOrderClasses = cn(
        'flex items-center justify-center',
        about.imagePositionMobile === 'top' ? 'order-1 mb-6 sm:mb-8 lg:mb-0' : 'order-2 mt-6 sm:mt-8 lg:mt-0',
        about.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
    );

    // Content max width classes
    const contentMaxWidthClasses = cn(
        'mx-auto',
        hasImage ? 'lg:mx-0 max-w-md sm:max-w-2xl lg:max-w-none' : 'max-w-md sm:max-w-2xl lg:max-w-4xl lg:mx-0'
    );

    return (
        <SectionWrapper 
            variant="muted" 
            className=""
            style={{
                contentVisibility: 'auto',
                containIntrinsicSize: 'auto 600px',
            }}
        >
            <div className="mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-12">
                <div className={cn(
                    'grid grid-cols-1 gap-10 sm:gap-12 lg:gap-16 items-center',
                    hasImage ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
                )}>
                    {/* Content */}
                    <div className={contentOrderClasses}>
                        <div className="mb-8 sm:mb-10 lg:mb-12">
                            <div className={contentMaxWidthClasses}>
                                {about.tagline && (
                                    <div className="mb-4 sm:mb-5 lg:mb-6 flex justify-center lg:justify-start opacity-0 animate-[fadeInUp_0.7s_ease-out_0s_forwards]">
                                        <span className="inline-flex items-center rounded-full border border-foreground/30 dark:border-white/30 bg-foreground/10 dark:bg-white/15 backdrop-blur-md px-4 sm:px-5 py-2 body-sm font-semibold text-foreground dark:text-white shadow-sm">
                                            {about.tagline}
                                        </span>
                                    </div>
                                )}
                                {about.heading && (
                                    <h2 className="text-foreground">
                                        {about.heading}
                                    </h2>
                                )}
                            </div>
                            <DecorativeLine alignment={hasImage ? 'left' : 'center'} className="justify-center lg:justify-start" />
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <div className={contentMaxWidthClasses}>
                                {about.paragraphs?.map((para, index) => (
                                    <p
                                        key={index}
                                        className="body-lg text-muted-foreground dark:text-slate-300 mt-3 sm:mt-4 first:mt-0 opacity-0 animate-[fadeInUp_0.7s_ease-out_0s_forwards]"
                                    >
                                        {para}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    {about.image && (
                        <div className={imageOrderClasses}>
                            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl group cursor-pointer">
                                {/* Decorative gradient ornament */}
                                <div className="absolute -inset-8 sm:-inset-12 lg:-inset-16 -z-10 pointer-events-none">
                                    <div
                                        className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 dark:from-primary/25 dark:via-accent/20 dark:to-primary/15 opacity-80 blur-2xl animate-pulse"
                                        style={{ animationDuration: '4s' }}
                                    />
                                </div>

                                <img
                                    src={about.image}
                                    srcSet={about.srcset}
                                    alt={about.imageAlt || 'About us'}
                                    className={cn(
                                        'relative z-10 w-full h-auto object-cover rounded-lg sm:rounded-xl transition-all duration-[900ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-0.5 group-hover:brightness-105 dark:brightness-75 dark:group-hover:brightness-90',
                                        about.imageFlipHorizontal && 'scale-x-[-1]'
                                    )}
                                    sizes="(max-width: 640px) 364px, (max-width: 1024px) 400px, (max-width: 1280px) 464px, 528px"
                                    loading="eager"
                                    fetchPriority="high"
                                    width="512"
                                    height="512"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SectionWrapper>
    );
}

