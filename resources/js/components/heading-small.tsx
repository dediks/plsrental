export default function HeadingSmall({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <header>
            <h3 className="mb-0.5 body font-medium">{title}</h3>
            {description && (
                <p className="body-sm text-muted-foreground">{description}</p>
            )}
        </header>
    );
}
