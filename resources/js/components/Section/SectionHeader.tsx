import { Link } from '@inertiajs/react';
import { DecorativeLine } from './DecorativeLine';

interface SectionHeaderProps {
    title: string;
    viewAllHref?: string;
    viewAllLabel?: string;
    showViewAll?: boolean;
    showDecorativeLine?: boolean;
}

export function SectionHeader({ 
    title, 
    viewAllHref, 
    viewAllLabel = 'View all', 
    showViewAll = true,
    showDecorativeLine = true,
}: SectionHeaderProps) {
    return (
        <div className="mb-10 sm:mb-12">
            <div className="flex items-center justify-between">
                <h2 className="h2 text-foreground dark:text-white">
                    {title}
                </h2>
                {showViewAll && viewAllHref && (
                    <Link
                        href={viewAllHref}
                        className="hidden sm:inline-flex body-sm font-medium text-muted-foreground dark:text-slate-300 hover:text-foreground dark:hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm px-2 py-1 hover:translate-x-1 items-center gap-1"
                    >
                        {viewAllLabel} <span className="transition-transform duration-200 inline-block">→</span>
                    </Link>
                )}
            </div>
            {showDecorativeLine && <DecorativeLine alignment="left" className="mt-4 sm:mt-6" />}
        </div>
    );
}

