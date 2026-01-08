import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Portfolio({ heading, subheading, items }: any) {
    const defaultItems = [
        {
            title: "National Leadership Summit 2023",
            category: "Corporate Conference",
            imageUrl: "https://picsum.photos/id/449/800/600"
        },
        {
            title: "Gala Dinner BUMN",
            category: "Gala & Awarding",
            imageUrl: "https://picsum.photos/id/158/800/600"
        },
        {
            title: "Konser Outdoor City Festival",
            category: "Live Music Production",
            imageUrl: "https://picsum.photos/id/452/800/600"
        }
    ];

    const portfolioItems = items && items.length > 0 ? items : defaultItems;

    return (
        <section className="py-24 bg-brand-dark border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-brand-gold font-semibold tracking-wider text-sm uppercase mb-3 block">Selected Works</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            {heading || 'Pengalaman Nyata di Lapangan'}
                        </h2>
                        <p className="text-gray-400 text-lg">
                            {subheading || 'Menangani berbagai skala acara dengan konsistensi kualitas, mulai dari ruang meeting eksklusif hingga panggung outdoor megah.'}
                        </p>
                    </div>
                    <a href="#" className="hidden md:flex items-center gap-2 text-white border-b border-brand-gold pb-1 hover:text-brand-gold transition-colors">
                        Lihat Semua Project <ArrowUpRight className="w-4 h-4" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioItems.map((project: any, index: number) => (
                        <div key={index} className="group relative cursor-pointer">
                            <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-6">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                    <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center">
                                        <ArrowUpRight className="w-5 h-5 text-black" />
                                    </div>
                                </div>
                            </div>
                            <span className="text-brand-gold text-sm tracking-wider uppercase font-medium">{project.category}</span>
                            <h3 className="text-white text-xl font-bold mt-2 group-hover:underline decoration-brand-gold underline-offset-4">{project.title}</h3>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <a href="#" className="inline-flex items-center gap-2 text-white border-b border-brand-gold pb-1 hover:text-brand-gold transition-colors">
                        Lihat Semua Project <ArrowUpRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}