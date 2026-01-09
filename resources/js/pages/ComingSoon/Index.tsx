import { Logo } from '@/components/Logo';
import { Head } from '@inertiajs/react';

export default function ComingSoon() {
    return (
        <>
            <Head title="Coming Soon - PLSRental" />
            <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
                <div className="flex flex-col items-center justify-center gap-8 text-center">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="scale-150 sm:scale-[1.75] md:scale-[2]">
                            <Logo
                                size="lg"
                                variant="img-only"
                                showText={false}
                            />
                        </div>
                    </div>

                    {/* Coming Soon Heading */}
                    <h1 className="h1 text-foreground">
                        Coming Soon
                    </h1>

                    {/* Subtitle */}
                    <p className="body-lg max-w-md text-muted-foreground">
                        We're working on something amazing. Stay tuned for updates.
                    </p>
                </div>
            </div>
        </>
    );
}

