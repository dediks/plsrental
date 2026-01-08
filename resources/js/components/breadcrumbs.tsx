import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    // On mobile, show only first and last item with ellipsis if more than 2 items
    const shouldCollapse = breadcrumbs.length > 2;
    const firstItem = breadcrumbs[0];
    const lastItem = breadcrumbs[breadcrumbs.length - 1];

    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {/* Mobile: Show first > … > last (only if more than 2 items) */}
                        {shouldCollapse ? (
                            <>
                                {/* Mobile collapsed view */}
                                <BreadcrumbItem className="sm:hidden">
                                    <BreadcrumbLink asChild>
                                        <Link href={firstItem.href}>
                                            {firstItem.title}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="sm:hidden" />
                                <BreadcrumbItem className="sm:hidden">
                                    <BreadcrumbEllipsis />
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="sm:hidden" />
                                <BreadcrumbItem className="sm:hidden">
                                    <BreadcrumbPage className="max-w-[150px]">
                                        {lastItem.title}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>

                                {/* Desktop full view */}
                                {breadcrumbs.map((item, index) => {
                                    const isLast = index === breadcrumbs.length - 1;
                                    return (
                                        <Fragment key={index}>
                                            <BreadcrumbItem className="hidden sm:inline-flex">
                                                {isLast ? (
                                                    <BreadcrumbPage>
                                                        {item.title}
                                                    </BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink asChild>
                                                        <Link href={item.href}>
                                                            {item.title}
                                                        </Link>
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                            {!isLast && (
                                                <BreadcrumbSeparator className="hidden sm:inline-flex" />
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </>
                        ) : (
                            /* Show all items if 2 or fewer */
                            breadcrumbs.map((item, index) => {
                                const isLast = index === breadcrumbs.length - 1;
                                return (
                                    <Fragment key={index}>
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage>
                                                    {item.title}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={item.href}>
                                                        {item.title}
                                                    </Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {!isLast && <BreadcrumbSeparator />}
                                    </Fragment>
                                );
                            })
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
