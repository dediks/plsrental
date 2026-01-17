@extends('layouts.landing')

@section('content')
    {{-- Hero Section --}}
    @include('landing.partials.hero', ['hero' => $hero ?? []])

    {{-- Clients Section --}}
    @include('landing.partials.clients', ['clients' => $clients ?? []])

    {{-- Stats Section --}}
    @include('landing.partials.stats', ['stats' => $stats ?? []])

    {{-- Services Section --}}
    @include('landing.partials.services', ['services' => $services ?? []])

    {{-- Why Choose Section --}}
    @include('landing.partials.why-choose', ['whyChoose' => $whyChoose ?? []])

    {{-- Portfolio Section --}}
    @include('landing.partials.portfolio', ['portfolio' => $portfolio ?? []])

    {{-- Process Section --}}
    @include('landing.partials.process', ['process' => $process ?? []])

    {{-- Testimonials Section --}}
    @include('landing.partials.testimonials', ['testimonials' => $testimonials ?? []])

    {{-- Final CTA Section --}}
    @include('landing.partials.final-cta', ['finalCTA' => $finalCTA ?? []])
@endsection
