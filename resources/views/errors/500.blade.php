<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.05 0 0);
            }

            /* Subtle animation for the 500 number */
            @keyframes pulse-glow {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.8;
                    transform: scale(1.02);
                }
            }

            .error-number {
                animation: pulse-glow 3s ease-in-out infinite;
            }
        </style>

        <title>Server Error - UAProfessional</title>

        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {{-- Fonts are self-hosted and loaded via @font-face in app.css --}}

        @vite(['resources/css/app.css'])
    </head>
    <body class="font-sans antialiased">
        <div class="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12 overflow-hidden">
            {{-- Background decorative elements --}}
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-50 dark:from-accent/10"></div>
                <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-50 dark:from-accent/10"></div>
            </div>

            <div class="relative z-10 flex flex-col items-center justify-center gap-8 text-center max-w-2xl">
                {{-- Logo --}}
                <div class="flex justify-center mb-4">
                    <div class="scale-125 sm:scale-150">
                        <div class="flex items-center">
                            <img
                                src="/images/black-logo.svg"
                                alt="UAProfessional"
                                class="h-10 w-auto dark:hidden"
                            />
                            <img
                                src="/images/white-logo.svg"
                                alt="UAProfessional"
                                class="h-10 w-auto hidden dark:block"
                            />
                        </div>
                    </div>
                </div>

                {{-- 500 Number --}}
                <div class="error-number">
                    <h1 class="text-[120px] sm:text-[150px] md:text-[180px] font-bold leading-none bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent dark:from-foreground dark:via-foreground dark:to-accent-foreground/50">
                        500
                    </h1>
                </div>

                {{-- Heading --}}
                <div class="space-y-3">
                    <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                        Something Went Wrong
                    </h2>
                    <div class="h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto"></div>
                </div>

                {{-- Description --}}
                <p class="text-base sm:text-lg leading-relaxed max-w-lg text-muted-foreground px-4">
                    We're experiencing some technical difficulties. Our team has been notified and is working to fix the issue. Please try again in a few moments.
                </p>

                {{-- Action Buttons --}}
                <div class="flex flex-col sm:flex-row gap-4 mt-4">
                    <a 
                        href="/" 
                        class="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3 text-sm font-medium text-accent-foreground shadow-lg shadow-accent/20 transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:shadow-accent/30 dark:hover:shadow-accent/40"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go Home
                    </a>
                    <button 
                        onclick="window.history.back()" 
                        class="inline-flex items-center justify-center rounded-lg border-2 border-border bg-background px-8 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-accent hover:bg-accent/5 hover:text-accent hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:border-border/80 dark:hover:border-accent dark:hover:bg-accent/10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go Back
                    </button>
                </div>

                {{-- Additional Help --}}
                <div class="mt-8 pt-8 border-t border-border/50">
                    <p class="text-sm text-muted-foreground">
                        Need help? 
                        <a href="/contact" class="text-accent hover:text-accent/80 font-medium underline underline-offset-4 decoration-accent/30 transition-colors">
                            Contact us
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>

