interface ProductDescriptionProps {
    description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
    return (
        <div>
            <h2 className="h3 text-foreground mb-4 sm:mb-5 md:mb-6 pb-2 sm:pb-2.5 md:pb-3 border-b-2 border-border">
                Description
            </h2>
            <div
                className="prose prose-neutral dark:prose-invert max-w-none prose-sm sm:prose-base md:prose-lg prose-headings:font-bold prose-headings:leading-tight prose-p:text-muted-foreground dark:prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-3 sm:prose-p:mb-4 md:prose-p:mb-5 prose-headings:mt-4 sm:prose-headings:mt-6 md:prose-headings:mt-8 prose-headings:mb-3 sm:prose-headings:mb-4 md:prose-headings:mb-5"
                dangerouslySetInnerHTML={{ __html: description }}
            />
        </div>
    );
}

