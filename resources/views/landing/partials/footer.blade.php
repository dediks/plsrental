@php
    $brandName = $footer['brandName'] ?? "PLS";
    $brandSubtitle = $footer['brandSubtitle'] ?? "Rental Division";
    $description = $footer['description'] ?? "Mitra terpercaya penyewaan sound system dan produksi audio visual premium untuk kebutuhan korporat dan instansi.";
    $contactPhone = $footer['contactPhone'] ?? "0822-5728-9604";
    $contactEmail = $footer['contactEmail'] ?? "plsrental@yahoo.com";
    $contactAddress = $footer['contactAddress'] ?? "JL.Raya Kandangan . Kare . MADIUN - Jawa Timur.";
@endphp

<footer class="bg-brand-dark text-neutral-300 pt-16 pb-8 border-t border-brand-accent/10">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {{-- Brand Info --}}
            <div class="md:col-span-1">
                <a href="{{ route('home') }}" class="block mb-6">
                    @if(isset($logoSettings) && !empty($logoSettings['logoLight']))
                        <img src="{{ $logoSettings['logoLight'] }}" alt="{{ $brandName }}" class="h-10 w-auto">
                    @else
                        <div class="flex flex-col leading-none">
                            <span class="text-2xl font-bold tracking-tighter text-white">{{ $brandName }}</span>
                            <span class="text-[0.6rem] font-bold tracking-widest text-neutral-500 uppercase">{{ $brandSubtitle }}</span>
                        </div>
                    @endif
                </a>
                <p class="text-sm leading-relaxed mb-6">
                    {{ $description }}
                </p>
                <div class="flex space-x-4">
                    @if(isset($socialMedia) && count($socialMedia) > 0)
                        @foreach($socialMedia as $social)
                            <a href="{{ $social->url }}" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors" aria-label="{{ $social->name }}">
                                @switch(strtolower($social->platform))
                                    @case('instagram')
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                                        @break
                                    @case('linkedin')
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                                        @break
                                    @case('facebook')
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                        @break
                                    @case('twitter')
                                    @case('x')
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                                        @break
                                    @case('youtube')
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                                        @break
                                    @case('tiktok')
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-music-2"><circle cx="8" cy="18" r="4"/><path d="M12 18V2l7 4"/></svg>
                                        @break
                                    @case('whatsapp')
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                        @break
                                    @default
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                @endswitch
                            </a>
                        @endforeach
                    @endif
                </div>
            </div>

            {{-- Area Layanan --}}
            <div class="md:col-span-2">
                <h3 class="text-white font-semibold mb-6">Area Layanan & Cakupan</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <div class="flex items-start mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-brand-accent mt-1 mr-3 h-4 w-4 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            <p class="text-sm">
                                <strong class="text-neutral-300 block mb-1">Madiun & Sekitarnya</strong>
                                Layanan cepat untuk area Madiun, Magetan, Ponorogo, dan Ngawi dengan dukungan logistik lokal.
                            </p>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-start mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-brand-accent mt-1 mr-3 h-4 w-4 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            <p class="text-sm">
                                <strong class="text-neutral-300 block mb-1">Jawa Timur & Nasional</strong>
                                Siap menangani event di seluruh Jawa Timur hingga skala nasional dengan koordinasi profesional.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Contact --}}
            <div>
                <h3 class="text-white font-semibold mb-6">Kontak Kami</h3>
                <ul class="space-y-4 text-sm">
                    <li class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone mr-3 h-4 w-4 text-brand-accent"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <span>{{ $contactPhone }}</span>
                    </li>
                    <li class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail mr-3 h-4 w-4 text-brand-accent"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        <span>{{ $contactEmail }}</span>
                    </li>
                    <li class="flex items-start">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin mt-1 mr-3 h-4 w-4 text-brand-accent flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                         <span>{{ $contactAddress }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-brand-accent/10 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
            <p>&copy; {{ date('Y') }} {{ $brandName }} {{ $brandSubtitle }}. All rights reserved.</p>
            <div class="flex space-x-6 mt-4 md:mt-0">
                <a href="#" class="hover:text-brand-accent-light">Privacy Policy</a>
                <a href="#" class="hover:text-brand-accent-light">Terms of Service</a>
            </div>
        </div>
    </div>
</footer>
