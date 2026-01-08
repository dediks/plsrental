import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center bg-background p-6 text-foreground lg:justify-center lg:p-8">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-border px-5 py-1.5 text-sm leading-normal text-foreground hover:border-accent"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-foreground hover:border-border"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-border px-5 py-1.5 text-sm leading-normal text-foreground hover:border-accent"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-card p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_hsl(var(--border))] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 text-card-foreground">
                            <h1 className="mb-1 font-medium">
                                Welcome to UAProfessional
                            </h1>
                            <p className="mb-2 text-muted-foreground">
                                We design and manufacture high-performance sound reinforcement systems.
                                <br />
                                Explore our products and solutions.
                            </p>
                            <ul className="mb-4 flex flex-col lg:mb-6">
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-border">
                                    <span className="relative bg-card py-1">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                                            <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                                        </span>
                                    </span>
                                    <span>
                                        Browse our
                                        <Link
                                            href="/products"
                                            className="ml-1 inline-flex items-center space-x-1 font-medium text-destructive underline underline-offset-4"
                                        >
                                            <span>Products</span>
                                            <svg
                                                width={10}
                                                height={11}
                                                viewBox="0 0 10 11"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-2.5 w-2.5"
                                            >
                                                <path
                                                    d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                                    stroke="currentColor"
                                                    strokeLinecap="square"
                                                />
                                            </svg>
                                        </Link>
                                    </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-border">
                                    <span className="relative bg-card py-1">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                                            <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                                        </span>
                                    </span>
                                    <span>
                                        Learn more
                                        <Link
                                            href="/about"
                                            className="ml-1 inline-flex items-center space-x-1 font-medium text-destructive underline underline-offset-4"
                                        >
                                            <span>About Us</span>
                                            <svg
                                                width={10}
                                                height={11}
                                                viewBox="0 0 10 11"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-2.5 w-2.5"
                                            >
                                                <path
                                                    d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                                    stroke="currentColor"
                                                    strokeLinecap="square"
                                                />
                                            </svg>
                                        </Link>
                                    </span>
                                </li>
                            </ul>
                            <ul className="flex gap-3 text-sm leading-normal">
                                <li>
                                    <Link
                                        href="/contact"
                                        className="inline-block rounded-sm border border-foreground bg-foreground px-5 py-1.5 text-sm leading-normal text-background hover:bg-accent hover:border-accent"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-muted lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg">
                            <div className="flex h-full w-full items-center justify-center p-8">
                                <img
                                    src="/images/hero/hero-uap.webp"
                                    alt="UAProfessional Sound Systems"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_hsl(var(--border))] lg:rounded-t-none lg:rounded-r-lg" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
