import { router } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory?: number | string;
    type?: 'product' | 'article' | 'supplier';
}

export function CategoryFilter({
    categories,
    selectedCategory,
    type = 'product',
}: CategoryFilterProps) {
    const handleCategoryChange = (categoryId: number | null) => {
        router.get(
            window.location.pathname,
            { category: categoryId || null },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categories
            </h3>
            <div className="space-y-1.5">
                <button
                    type="button"
                    onClick={() => handleCategoryChange(null)}
                    className={`block w-full text-left rounded-md px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                        !selectedCategory
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-foreground hover:bg-accent/50 hover:text-accent-foreground'
                    }`}
                >
                    All {type === 'product' ? 'Products' : type === 'article' ? 'Articles' : 'Suppliers'}
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryChange(category.id)}
                        className={`block w-full text-left rounded-md px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                            selectedCategory == category.id
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-foreground hover:bg-accent/50 hover:text-accent-foreground'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
