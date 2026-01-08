import { Skeleton } from '@/components/ui/skeleton';

export function PartnerCardSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-20" />
            </div>
            <div className="mt-3 flex items-start gap-2">
                <Skeleton className="h-4 w-4 mt-0.5" />
                <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="mt-4 h-4 w-24" />
        </div>
    );
}

