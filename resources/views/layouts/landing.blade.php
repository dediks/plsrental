<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @if(isset($seo))
        <title>{{ $seo['title'] }}</title>
        <meta name="description" content="{{ $seo['description'] }}">
        <meta name="robots" content="{{ $seo['robots'] }}">
        <link rel="canonical" href="{{ $seo['canonical'] }}">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="{{ $seo['type'] }}">
        <meta property="og:url" content="{{ $seo['url'] }}">
        <meta property="og:title" content="{{ $seo['ogTitle'] ?? $seo['title'] }}">
        <meta property="og:description" content="{{ $seo['ogDescription'] ?? $seo['description'] }}">
        <meta property="og:image" content="{{ $seo['image'] }}">
        <meta property="og:site_name" content="{{ $seo['siteName'] }}">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:creator" content="{{ $seo['twitterHandle'] }}">
        <meta name="twitter:title" content="{{ $seo['title'] }}">
        <meta name="twitter:description" content="{{ $seo['description'] }}">
        <meta name="twitter:image" content="{{ $seo['image'] }}">

        <!-- Structured Data -->
        @foreach($seo['structuredData'] as $data)
            <script type="application/ld+json">
                {!! json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
            </script>
        @endforeach
    @else
        <title>{{ config('app.name', 'PLSRental') }} - Premium Sound for Remarkable Events</title>
    @endif

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600&display=swap" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet">


    <!-- Scripts -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body class="font-sans antialiased text-white bg-brand-dark selection:bg-brand-gold selection:text-white">
    <div class="min-h-screen flex flex-col">
        {{-- Navbar - logoSettings is injected via View Composer --}}
        @include('landing.partials.navbar', ['logoSettings' => $logoSettings])

        <main>
            @yield('content')
        </main>

        {{-- Footer --}}
        @include('landing.partials.footer')
    </div>
</body>
</html>
