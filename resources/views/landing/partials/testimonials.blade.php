@php
    $heading = $testimonials['heading'] ?? "Kepercayaan Klien";
    $items = $testimonials['items'] ?? [];

    if (empty($items)) {
        $items = [
            [
                'id' => 1,
                'text' => "PLS memberikan standar audio yang sangat bersih. Tidak ada feedback, suara jernih di seluruh ballroom, dan timnya sangat kooperatif mengikuti rundown kami yang padat.",
                'author' => "Budi Santoso",
                'role' => "Head of Marketing",
                'company' => "PT. Nusantara Jaya Tbk"
            ],
            [
                'id' => 2,
                'text' => "Ketepatan waktu saat loading barang sangat kami apresiasi. Setup rapi, kabel tidak berantakan, dan operator sangat responsif terhadap perubahan mendadak di lapangan.",
                'author' => "Rina Wijaya",
                'role' => "Event Director",
                'company' => "Luxe Organizer Indonesia"
            ],
            [
                'id' => 3,
                'text' => "Solusi lighting dan sound yang diberikan membuat acara tahunan kementerian kami berjalan khidmat dan megah. Sangat direkomendasikan untuk event formal.",
                'author' => "Drs. Hendra Kusuma",
                'role' => "Kasubag Umum",
                'company' => "Kementerian BUMN (Unit)"
            ]
        ];
    }
@endphp

<section id="testimonials" class="py-24 bg-brand-dark">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-16 text-center">{{ $heading }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @foreach($items as $item)
                <div class="bg-neutral-900/50 p-8 rounded-sm border border-white/5 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote absolute top-8 right-8 text-brand-gold/20 h-8 w-8"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1Z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1Z"/></svg>
                    <p class="text-neutral-300 italic mb-8 leading-relaxed">"{{ $item['text'] }}"</p>
                    <div class="border-t border-white/5 pt-6">
                        <p class="text-white font-semibold">{{ $item['author'] }}</p>
                        <p class="text-brand-gold text-sm text-opacity-80 mb-1">{{ $item['company'] }}</p>
                        <p class="text-neutral-500 text-xs">{{ $item['role'] }}</p>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</section>
