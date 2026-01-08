import { Link, usePage } from '@inertiajs/react';
import type { NavigationItem } from './constants';
import { cn } from '@/lib/utils';

interface NavLinkProps {
    item: NavigationItem;
    className?: string;
    onClick?: () => void;
}

export function NavLink({ item, className, onClick }: NavLinkProps) {
    const { url } = usePage();
    const isActive = url === item.href;

    return (
        <Link
            href={item.href}
            className={cn(
                'relative transition-colors duration-200',
                isActive && 'text-accent-foreground',
                className
            )}
            onClick={onClick}
        >
            {item.name}
            {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-foreground transition-opacity duration-200" />
            )}
        </Link>
    );
}
