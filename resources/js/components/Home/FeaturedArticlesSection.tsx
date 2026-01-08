import type { FeaturedArticle } from '@/types/home';
import { ArticleCard } from '@/components/ArticleCard';
import { SectionWrapper } from '@/components/Section/SectionWrapper';
import { SectionHeader } from '@/components/Section/SectionHeader';

interface FeaturedArticlesSectionProps {
    articles: FeaturedArticle[];
}

export function FeaturedArticlesSection({ articles }: FeaturedArticlesSectionProps) {
    if (articles.length === 0) {
        return null;
    }

    return (
        <SectionWrapper className="opacity-0 animate-[fadeInUp_0.7s_ease-out_0.3s_forwards]">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                <SectionHeader title="Articles" viewAllHref="/articles" />
                <div className="-mx-6 sm:mx-0 px-6 sm:px-0">
                    <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:pb-0 sm:gap-6">
                        {articles.map((article) => (
                            <div key={article.id} className="flex-shrink-0 w-[82vw] sm:w-auto sm:max-w-none">
                                <ArticleCard article={article} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}

