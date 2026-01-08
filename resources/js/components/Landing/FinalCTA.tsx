import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare } from 'lucide-react';

export default function FinalCTA({ heading, subheading, buttonText, buttonLink, phoneNumber }: any) {
    return (
        <section className="py-32 bg-brand-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-gold/5 to-brand-dark pointer-events-none" />
            
            <div className="container mx-auto px-4 text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    {heading || 'Siap untuk Event Luar Biasa?'}
                </h2>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                    {subheading || 'Hubungi kami sekarang untuk konsultasi gratis dan penawaran terbaik untuk kebutuhan audio visual acara Anda.'}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a href={buttonLink || "#"} target="_blank" rel="noopener noreferrer">
                        <Button 
                            size="lg" 
                            className="bg-brand-gold hover:bg-brand-gold/90 text-black font-bold h-14 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all duration-300"
                        >
                            <MessageSquare className="mr-2 w-5 h-5" />
                            {buttonText || 'Chat WhatsApp'}
                        </Button>
                    </a>
                    
                    <a href={phoneNumber ? `tel:${phoneNumber}` : "#"} className="group flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition-colors">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Call Us</p>
                            <p className="text-white font-bold text-lg">{phoneNumber || "+62 812-3456-7890"}</p>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
}