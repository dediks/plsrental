import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials({ heading, items }: any) {
     const defaultTestimonials = [
        {
            text: "Kualitas sound system luar biasa, sangat jernih dan powerful. Tim teknis juga sangat kooperatif.",
            author: "Budi Santoso",
            role: "Event Manager",
            company: "PT. Telkom Indonesia"
        },
        {
            text: "Pelayanan sangat profesional. Setup rapi dan on-time. Sangat direkomendasikan untuk event korporat.",
            author: "Siti Rahmawati",
            role: "Marketing Director",
            company: "Bank Mandiri"
        },
        {
            text: "Solusi terbaik untuk kebutuhan audio visual kami. Harga kompetitif dengan kualitas premium.",
            author: "Andi Wijaya",
            role: "CEO",
            company: "Wijaya Karya Group"
        }
    ];

    const testimonials = items && items.length > 0 ? items : defaultTestimonials;

    return (
        <section className="py-24 bg-brand-dark relative overflow-hidden">
            {/* Background Decoration */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-gold/5 pointer-events-none select-none">
                <Quote size={400} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                     <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        {heading || 'Apa Kata Klien Kami'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item: any, index: number) => (
                        <div key={index} className="bg-white/5 p-8 rounded-2xl border border-white/5 relative hover:bg-white/10 transition-colors">
                            <Quote className="text-brand-gold/30 mb-6 w-8 h-8" />
                            <p className="text-lg text-gray-300 mb-8 leading-relaxed italic">
                                "{item.text}"
                            </p>
                            <div>
                                <h4 className="text-white font-bold">{item.author}</h4>
                                <p className="text-sm text-brand-gold">{item.role}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.company}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}