import { formatPlainTextWithNewlines, formatSpecKey } from '@/lib/text-formatting';

interface KeySpec {
    label: string;
    value: string;
}

interface SpecificationTableProps {
    specs: Array<{ label: string; value: string }>;
    variant?: 'table' | 'grid';
}

export function SpecificationTable({ specs, variant = 'grid' }: SpecificationTableProps) {
    if (variant === 'table') {
        return (
            <div className="bg-card rounded-md sm:rounded-md overflow-hidden dark:border-border/60">
                <table className="w-full">
                    <tbody className="divide-y divide-border dark:divide-border/60">
                        {specs.map((spec, index) => {
                            const val = String(spec.value || '');
                            const htmlContent = formatPlainTextWithNewlines(val);
                            
                            return (
                                <tr
                                    key={index}
                                    className="hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors duration-300"
                                >
                                    <td className="font-semibold text-[11px] xs:text-xs sm:text-sm uppercase tracking-[0.05em] text-muted-foreground py-3 sm:py-3.5 md:py-4 align-top w-[180px] sm:w-[200px] md:w-[220px]">
                                        {spec.label}
                                    </td>
                                    <td 
                                        className="text-foreground font-medium text-sm sm:text-base md:text-lg leading-relaxed px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 [&_p]:mb-2 [&_p:last-child]:mb-0"
                                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                                    />
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    // Grid variant (for full specs)
    return (
        <div className="bg-card border border-border rounded-lg sm:rounded-xl overflow-hidden shadow-sm dark:shadow-lg dark:border-border/60">
            <div className="divide-y divide-border dark:divide-border/60">
                {specs.map((spec, index) => {
                    const val = String(spec.value || '');
                    const htmlContent = formatPlainTextWithNewlines(val);
                    
                    return (
                        <div
                            key={index}
                            className="grid grid-cols-1 sm:grid-cols-[180px_1fr] md:grid-cols-[200px_1fr] gap-2.5 sm:gap-3 md:gap-4 p-3.5 sm:p-4 md:p-5 lg:p-6 hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors duration-300 group"
                        >
                            <dt className="font-semibold text-[11px] xs:text-xs sm:text-sm uppercase tracking-[0.05em] sm:col-span-1 flex items-center text-muted-foreground group-hover:text-foreground transition-colors leading-snug mb-1 sm:mb-0">
                                {spec.label}
                            </dt>
                            <dd 
                                className="text-foreground font-medium sm:col-span-1 text-sm sm:text-base md:text-lg leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

interface FlatSpecificationTableProps {
    entries: Array<[string, string]>;
}

export function FlatSpecificationTable({ entries }: FlatSpecificationTableProps) {
    return (
        <div className="bg-card border border-border rounded-lg sm:rounded-xl overflow-hidden shadow-sm dark:shadow-lg dark:border-border/60 mt-4 sm:mt-5 md:mt-6">
            <div className="divide-y divide-border dark:divide-border/60">
                {entries.map(([key, value]) => {
                    const val = String(value || '');
                    const htmlContent = formatPlainTextWithNewlines(val);
                    
                    return (
                        <div
                            key={key}
                            className="grid grid-cols-1 sm:grid-cols-[180px_1fr] md:grid-cols-[200px_1fr] gap-2.5 sm:gap-3 md:gap-4 p-3.5 sm:p-4 md:p-5 lg:p-6 hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors duration-300 group"
                        >
                            <dt className="font-semibold text-[11px] xs:text-xs sm:text-sm uppercase tracking-[0.05em] sm:col-span-1 flex items-center text-muted-foreground group-hover:text-foreground transition-colors leading-snug mb-1 sm:mb-0">
                                {formatSpecKey(key)}
                            </dt>
                            <dd 
                                className="text-foreground font-medium sm:col-span-1 text-sm sm:text-base md:text-lg leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

interface GroupedSpecificationTableProps {
    groups: Array<{ sectionLabel: string; rows: Array<{ label: string; value: string }> }>;
}

export function GroupedSpecificationTable({ groups }: GroupedSpecificationTableProps) {
    return (
        <div className="space-y-6 mt-4 sm:mt-5 md:mt-6">
            {groups.map((group, groupIndex) => (
                <div
                    key={groupIndex}
                    className="bg-card border border-border rounded-lg sm:rounded-xl overflow-hidden shadow-sm dark:shadow-lg dark:border-border/60"
                >
                    {group.sectionLabel && (
                        <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-muted/30 dark:bg-muted/20 border-b border-border">
                            <h3 className="font-semibold text-sm sm:text-base text-foreground">
                                {group.sectionLabel}
                            </h3>
                        </div>
                    )}
                    <div className="divide-y divide-border dark:divide-border/60">
                        {group.rows.map((row, rowIndex) => {
                            const val = String(row.value || '');
                            const htmlContent = formatPlainTextWithNewlines(val);
                            
                            return (
                                <div
                                    key={rowIndex}
                                    className="grid grid-cols-1 sm:grid-cols-[180px_1fr] md:grid-cols-[200px_1fr] gap-2.5 sm:gap-3 md:gap-4 p-3.5 sm:p-4 md:p-5 lg:p-6 hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors duration-300 group"
                                >
                                    <dt className="font-semibold text-[11px] xs:text-xs sm:text-sm uppercase tracking-[0.05em] sm:col-span-1 flex items-center text-muted-foreground group-hover:text-foreground transition-colors leading-snug mb-1 sm:mb-0">
                                        {row.label}
                                    </dt>
                                    <dd 
                                        className="text-foreground font-medium sm:col-span-1 text-sm sm:text-base md:text-lg leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
                                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

