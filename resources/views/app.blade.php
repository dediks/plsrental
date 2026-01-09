<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Preconnect to same origin for faster font loading --}}
        <link rel="preconnect" href="{{ config('app.url') }}" crossorigin />
        
        {{-- Preconnect to Google Tag Manager for faster third-party script loading --}}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

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

            /* Critical CSS for LCP element - ensures h2 renders immediately */
            h2.text-foreground {
                font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
                font-size: 2rem;
                line-height: 1.2;
                font-weight: 600;
                letter-spacing: 0.02em;
                color: oklch(0.08 0 0);
            }

            html.dark h2.text-foreground {
                color: oklch(1 0 0);
            }

            @media (min-width: 640px) {
                h2.text-foreground {
                    font-size: 2.25rem;
                    line-height: 1.15;
                }
            }

            @media (min-width: 1024px) {
                h2.text-foreground {
                    font-size: 2.5rem;
                    line-height: 1.12;
                }
            }

            @media (min-width: 1280px) {
                h2.text-foreground {
                    font-size: 2.75rem;
                    line-height: 1.1;
                }
            }

            @media (min-width: 1536px) {
                h2.text-foreground {
                    font-size: 3rem;
                    line-height: 1.08;
                }
            }
        </style>

        <title inertia>{{ config('app.name', 'PLSRental') }} - Premium Sound for Remarkable Events</title>

        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" media="(prefers-color-scheme: light)">
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])

        @if (!request()->routeIs('login', 'register', 'dashboard*') || !request()->is('dashboard*'))
        <!-- Google tag (gtag.js) - Deferred to prevent blocking render -->
        <script>
            // Load GTM after page load to prevent blocking render
            window.addEventListener('DOMContentLoaded', function() {
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.googletagmanager.com/gtag/js?id=G-G915DSTFVN';
                document.head.appendChild(script);

                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '{{ config("services.ga_id") }}', {
                    send_page_view: false,
                });
            });
        </script>
        @endif

        @inertiaHead
    </head>
    <body class="antialiased">
        @inertia
    </body>
</html>
