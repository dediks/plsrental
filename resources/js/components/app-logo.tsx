import { Logo } from './Logo';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Logo size="sm" variant="img-only" inverted={true} className="h-5 w-auto" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    UAProfessional
                </span>
            </div>
        </>
    );
}
