interface Download {
    id: number;
    title: string;
    category: string;
    url: string;
    mime_type?: string;
    size?: number;
    order: number;
}

interface ProductDownloadsProps {
    downloads: Download[];
}

export function ProductDownloads({ downloads }: ProductDownloadsProps) {
    // Group downloads by category
    const groupedDownloads = downloads.reduce(
        (acc, download) => {
            const category = download.category || 'Other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(download);
            return acc;
        },
        {} as Record<string, Download[]>
    );

    return (
        <div>
            <h2 className="h3 text-foreground mb-4 sm:mb-5 md:mb-6 pb-2 sm:pb-2.5 md:pb-3 border-b-2 border-border">
                Downloads
            </h2>
            <div className="mt-4 sm:mt-5 md:mt-6 space-y-4">
                {Object.entries(groupedDownloads).map(([category, categoryDownloads]) => (
                    <div key={category} className="space-y-2">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                            {category}
                        </h3>
                        <div className="space-y-2">
                            {categoryDownloads
                                .sort((a, b) => a.order - b.order)
                                .map((download) => (
                                    <a
                                        key={download.id}
                                        href={download.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg bg-card hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors duration-300 group"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                {download.title}
                                            </div>
                                            {download.size && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {(download.size / 1024).toFixed(2)} KB
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4 text-muted-foreground group-hover:text-foreground transition-colors">
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                />
                                            </svg>
                                        </div>
                                    </a>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

