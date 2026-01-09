@php
    $brandName = $footer['brandName'] ?? "PLS";
    $brandSubtitle = $footer['brandSubtitle'] ?? "Rental Division";
    $description = $footer['description'] ?? "Mitra terpercaya penyewaan sound system dan produksi audio visual premium untuk kebutuhan korporat dan instansi.";
    $contactPhone = $footer['contactPhone'] ?? "0822-5728-9604";
    $contactEmail = $footer['contactEmail'] ?? "plsrental@yahoo.com";
    $contactAddress = $footer['contactAddress'] ?? "JL.Raya Kandangan . Kare . MADIUN - Jawa Timur.";
@endphp

<footer class="bg-neutral-950 text-neutral-400 pt-16 pb-8 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {{-- Brand Info --}}
            <div class="md:col-span-1">
                <a href="#" class="flex flex-col leading-none mb-6">
                    <span class="text-2xl font-bold tracking-tighter text-white">{{ $brandName }}</span>
                    <span class="text-[0.6rem] font-bold tracking-widest text-neutral-500 uppercase">{{ $brandSubtitle }}</span>
                </a>
                <p class="text-sm leading-relaxed mb-6">
                    {{ $description }}
                </p>
                <div class="flex space-x-4">
                    <a href="#" class="hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                    <a href="#" class="hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                </div>
            </div>

            {{-- Area Layanan --}}
            <div class="md:col-span-2">
                <h3 class="text-white font-semibold mb-6">Area Layanan & Cakupan</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <div class="flex items-start mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-brand-gold mt-1 mr-3 h-4 w-4 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            <p class="text-sm">
                                <strong class="text-neutral-300 block mb-1">Madiun & Sekitarnya</strong>
                                Layanan cepat untuk area Madiun, Magetan, Ponorogo, dan Ngawi dengan dukungan logistik lokal.
                            </p>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-start mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-brand-gold mt-1 mr-3 h-4 w-4 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone mr-3 h-4 w-4 text-brand-gold"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <span>{{ $contactPhone }}</span>
                    </li>
                    <li class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail mr-3 h-4 w-4 text-brand-gold"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        <span>{{ $contactEmail }}</span>
                    </li>
                    <li class="flex items-start">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin mt-1 mr-3 h-4 w-4 text-brand-gold flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                         <span>{{ $contactAddress }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-white/5 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
            <p>&copy; {{ date('Y') }} {{ $brandName }} {{ $brandSubtitle }}. All rights reserved.</p>
            <div class="flex space-x-6 mt-4 md:mt-0">
                <a href="#" class="hover:text-neutral-400">Privacy Policy</a>
                <a href="#" class="hover:text-neutral-400">Terms of Service</a>
            </div>
        </div>
    </div>
</footer>
