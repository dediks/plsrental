@extends('layouts.landing')

@section('content')
    <div class="pt-24 bg-brand-dark min-h-screen">
        {{-- Hero Header --}}
        <div class="relative py-20 px-6 lg:px-8 overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0 bg-[radial-gradient(#C6A87C_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>
            
            <div class="relative max-w-7xl mx-auto text-center">
                <span class="inline-block py-1 px-3 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-medium mb-6">
                    Portofolio
                </span>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    {{ $portfolio['heading'] ?? 'Pengalaman Nyata di Lapangan' }}
                </h1>
                <p class="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                    {{ $portfolio['subheading'] ?? 'Menangani berbagai skala acara dengan konsistensi kualitas, mulai dari ruang meeting eksklusif hingga panggung outdoor megah.' }}
                </p>
            </div>
        </div>

        {{-- Portfolio Grid --}}
        <div class="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
            @if(empty($portfolio['items']))
                <div class="text-center py-12">
                    <p class="text-neutral-500">Belum ada item portfolio yang ditampilkan.</p>
                </div>
            @else
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    @foreach($portfolio['items'] as $item)
                        <div class="group relative overflow-hidden rounded-sm bg-neutral-900 border border-white/5 hover:border-brand-accent/20 transition-all duration-300">
                            {{-- Image --}}
                            <div class="aspect-[4/3] w-full overflow-hidden">
                                @if(!empty($item['imageUrl']))
                                    <img 
                                        src="{{ $item['imageUrl'] }}" 
                                        alt="{{ $item['title'] }}" 
                                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                    />
                                @else
                                    <div class="w-full h-full bg-neutral-800 flex items-center justify-center">
                                        <span class="text-neutral-600">No Image</span>
                                    </div>
                                @endif
                            </div>

                            {{-- Content --}}
                            <div class="p-6">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-xs font-medium text-brand-accent uppercase tracking-wider">
                                        {{ $item['category'] ?? 'Event' }}
                                    </span>
                                    @if(!empty($item['date']))
                                        <span class="text-xs text-neutral-500">
                                            {{ $item['date'] }}
                                        </span>
                                    @endif
                                </div>
                                <h3 class="text-xl font-bold text-white mb-2 group-hover:text-brand-accent transition-colors">
                                    {{ $item['title'] }}
                                </h3>
                                @if(!empty($item['description']))
                                    <p class="text-neutral-400 text-sm line-clamp-3">
                                        {{ $item['description'] }}
                                    </p>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        {{-- Final CTA --}}
        @include('landing.partials.final-cta', ['finalCTA' => $finalCTA ?? []])
    </div>
@endsection
