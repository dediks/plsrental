import { Head } from '@inertiajs/react';

interface SeoProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    canonical?: string;
    type?: string;
    siteName?: string;
    twitterHandle?: string;
    ogTitle?: string;
    ogDescription?: string;
    structuredData?: Array<Record<string, unknown>> | Record<string, unknown>;
    noindex?: boolean;
    nofollow?: boolean;
}

export function Seo({
    title,
    description,
    image,
    url,
    canonical,
    type = 'website',
    siteName,
    twitterHandle,
    ogTitle,
    ogDescription,
    structuredData = [],
    noindex = false,
    nofollow = false,
}: SeoProps) {
    const robots = [];
    if (noindex) {
        robots.push('noindex');
    }
    if (nofollow) {
        robots.push('nofollow');
    }
    if (robots.length === 0) {
        robots.push('index', 'follow');
    }

    // Normalize structured data to array
    const structuredDataArray = Array.isArray(structuredData) ? structuredData : [structuredData];

    return (
        <Head>
            {/* Basic Meta Tags */}
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            <meta name="robots" content={robots.join(', ')} />

            {/* Open Graph Tags */}
            {ogTitle && <meta property="og:title" content={ogTitle} />}
            {!ogTitle && title && <meta property="og:title" content={title} />}
            {ogDescription && <meta property="og:description" content={ogDescription} />}
            {!ogDescription && description && <meta property="og:description" content={description} />}
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}
            <meta property="og:type" content={type} />
            {siteName && <meta property="og:site_name" content={siteName} />}

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            {ogTitle && <meta name="twitter:title" content={ogTitle} />}
            {!ogTitle && title && <meta name="twitter:title" content={title} />}
            {ogDescription && <meta name="twitter:description" content={ogDescription} />}
            {!ogDescription && description && <meta name="twitter:description" content={description} />}
            {image && <meta name="twitter:image" content={image} />}
            {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
            {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}

            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={canonical} />}
            {!canonical && url && <link rel="canonical" href={url} />}

            {/* Structured Data (JSON-LD) */}
            {structuredDataArray.map((data, index) => {
                if (!data || Object.keys(data).length === 0) {
                    return null;
                }
                return (
                    <script
                        key={index}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(data),
                        }}
                    />
                );
            })}
        </Head>
    );
}

