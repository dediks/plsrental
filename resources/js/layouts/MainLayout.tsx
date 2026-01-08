import { Footer } from '@/components/Footer';
import type { PropsWithChildren } from 'react';
import PublicAnalytics from '@/components/Analytics';
import { Navigation } from '@/components/Navigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

export default function MainLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col bg-background w-full overflow-x-hidden">
            <PublicAnalytics />
            <Navigation />
            <main className="flex-1 pt-14 w-full overflow-x-hidden">{children}</main>
            <ScrollToTopButton />
            <Footer />
        </div>
    );
}
