import MainLayout from '@/layouts/MainLayout';
import { PageHero } from '@/components/PageHero';
import { Seo } from '@/components/Seo';

interface PrivacyProps {
    sections: Array<{
        title: string;
        content: string;
    }>;
    lastUpdated: string;
    seo?: {
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
    };
}

export default function Privacy({ sections, lastUpdated, seo }: PrivacyProps) {
    return (
        <MainLayout>
            {seo && <Seo {...seo} />}

            <PageHero title="Privacy Policy" />

            <section className="relative bg-muted/20 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12 sm:space-y-16 lg:space-y-20">
                        {sections.map((section, index) => (
                            <div key={index} className="space-y-4 sm:space-y-6">
                                <h2 className="h3 text-foreground">
                                    {section.title}
                                </h2>
                                <div className="body-lg text-muted-foreground whitespace-pre-line">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 sm:mt-16 pt-8 border-t border-border">
                        <p className="body-sm text-muted-foreground">
                            Last Updated: {lastUpdated}
                        </p>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
