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
        </style>

        <title>Coming Soon - PLSRental</title>

        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {{-- Fonts are self-hosted and loaded via @font-face in app.css --}}

        @vite(['resources/css/app.css'])
    </head>
    <body class="font-sans antialiased">
        <div class="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <div class="flex flex-col items-center justify-center gap-8 text-center">
                {{-- Logo --}}
                <div class="flex justify-center">
                    <div class="scale-150 sm:scale-[1.75] md:scale-[2]">
                        <div class="flex items-center">
                            <img
                                src="/images/black-logo.svg"
                                alt="PLSRental"
                                class="h-10 w-auto dark:hidden"
                            />
                            <img
                                src="/images/white-logo.svg"
                                alt="PLSRental"
                                class="h-10 w-auto hidden dark:block"
                            />
                        </div>
                    </div>
                </div>

                {{-- Coming Soon Heading --}}
                <h1 class="h1 text-foreground">
                    Coming Soon
                </h1>

                {{-- Subtitle --}}
                <p class="body-lg max-w-md text-muted-foreground">
                    We're working on something amazing. Stay tuned for updates.
                </p>
            </div>
        </div>
    </body>
</html>

