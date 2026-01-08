import { type ReactNode, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    data: {
        data: T[];
        links?: any[];
        meta?: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    columns: Column<T>[];
    createUrl?: string;
    createLabel?: string;
    viewUrl?: (row: T) => string;
    editUrl?: (row: T) => string;
    onDelete?: (row: T) => void;
    externalUrl?: (row: T) => string;
    filters?: ReactNode;
    searchPlaceholder?: string;
}

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    createUrl,
    createLabel = 'Create New',
    viewUrl,
    editUrl,
    onDelete,
    externalUrl,
    filters,
    searchPlaceholder = 'Search...',
}: DataTableProps<T>) {
    // Ensure data structure is correct
    const tableData = data?.data || [];
    const meta = data?.meta || {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: tableData.length,
    };
    const links = data?.links || [];
    const searchFormRef = useRef<HTMLFormElement>(null);

    const renderCell = (row: T, column: Column<T>) => {
        if (typeof column.accessor === 'function') {
            return column.accessor(row);
        }
        return row[column.accessor] as ReactNode;
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        const params = new URLSearchParams(window.location.search);
        
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        
        router.get(window.location.pathname + '?' + params.toString(), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <form
                        ref={searchFormRef}
                        onSubmit={handleSearchSubmit}
                        className="relative flex-1 max-w-sm"
                    >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                        <Input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="pl-9"
                            name="search"
                            defaultValue={
                                new URLSearchParams(window.location.search).get(
                                    'search',
                                ) || ''
                            }
                        />
                    </form>
                    {filters}
                </div>
                {createUrl && (
                    <Button asChild>
                        <Link href={createUrl}>
                            <Plus className="mr-2" />
                            {createLabel}
                        </Link>
                    </Button>
                )}
            </div>

            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                                            column.className || ''
                                        }`}
                                    >
                                        {column.header}
                                    </th>
                                ))}
                                {(viewUrl || editUrl || onDelete || externalUrl) && (
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                            {tableData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={
                                            columns.length +
                                            (viewUrl || editUrl || onDelete || externalUrl ? 1 : 0)
                                        }
                                        className="px-6 py-12 text-center text-muted-foreground"
                                    >
                                        No items found.
                                    </td>
                                </tr>
                            ) : (
                                tableData.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        {columns.map((column, index) => (
                                            <td
                                                key={index}
                                                className={`px-6 py-4 whitespace-nowrap ${
                                                    column.className || ''
                                                }`}
                                            >
                                                {renderCell(row, column)}
                                            </td>
                                        ))}
                                        {(viewUrl || editUrl || onDelete || externalUrl) && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                {externalUrl && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={externalUrl(row)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <ExternalLink className="size-4" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                    {viewUrl && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={viewUrl(row)}
                                                            >
                                                                <Eye className="size-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {editUrl && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={editUrl(row)}
                                                            >
                                                                <Edit className="size-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {onDelete && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                onDelete(row)
                                                            }
                                                        >
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {meta.per_page * (meta.current_page - 1) + 1} to{' '}
                        {Math.min(
                            meta.per_page * meta.current_page,
                            meta.total,
                        )}{' '}
                        of {meta.total} results
                    </div>
                    <div className="flex gap-2">
                        {links && links.map((link, index) => {
                            if (!link.url) {
                                return (
                                    <span
                                        key={index}
                                        className="px-3 py-2 text-sm text-muted-foreground"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background hover:bg-muted border-border'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

