import { Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';

interface ArticleCardProps {
    article: {
        id: number;
        title: string;
        slug: string;
        excerpt?: string;
        featured_image?: string;
        published_at?: string;
        category?: {
            name: string;
        };
        author?: {
            name: string;
        };
    };
}

export function ArticleCard({ article }: ArticleCardProps) {
    const publishedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : null;

    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group block h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 ease-out hover:border-accent/50 hover:shadow-2xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
            {/* Article Image - Always shown */}
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {article.featured_image ? (
                    <img
                        src={article.featured_image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <FileText className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                )}
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>

            {/* Article Info */}
            <div className="p-4">
                {article.category && (
                    <p className="body-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {article.category.name}
                    </p>
                )}
                <h3 className="mt-2 h5 text-card-foreground transition-colors duration-200 group-hover:text-accent-foreground line-clamp-2">
                    {article.title}
                </h3>
                {article.excerpt && (
                    <p className="mt-2 line-clamp-2 body-sm text-muted-foreground">
                        {article.excerpt}
                    </p>
                )}
                <div className="mt-3 flex items-center gap-3 body-xs text-muted-foreground">
                    {publishedDate && <span>{publishedDate}</span>}
                    {article.author && <span>By {article.author.name}</span>}
                </div>
            </div>
        </Link>
    );
}
