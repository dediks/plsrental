@php
    $items = $stats['items'] ?? [];
    if (empty($items)) {
        $items = [
            ['id' => 1, 'label' => "Tahun Pengalaman", 'value' => "10+"],
            ['id' => 2, 'label' => "Event Sukses", 'value' => "500+"],
            ['id' => 3, 'label' => "Klien Korporat & Instansi", 'value' => "200+"],
            ['id' => 4, 'label' => "Keandalan Teknis", 'value' => "100%"],
        ];
    } else {
        // Assign IDs if checking for index logic, but here simple iteration works
    }
@endphp

<section class="bg-brand-charcoal border-y border-white/5">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center md:text-left">
            @foreach($items as $index => $stat)
                <div class="flex flex-col animate-fade-in-up" style="animation-delay: {{ $index * 100 }}ms">
                    <span class="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">{{ $stat['value'] }}</span>
                    <span class="text-sm uppercase tracking-wide text-neutral-500 font-medium">{{ $stat['label'] }}</span>
                </div>
            @endforeach
        </div>
    </div>
</section>
