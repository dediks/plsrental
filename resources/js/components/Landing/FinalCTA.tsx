import React from 'react';
import { MessageSquare } from 'lucide-react';

const FinalCTA: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-brand-gold relative overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-6">
          Siap Wujudkan Event Berkelas?
        </h2>
        <p className="text-brand-dark/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
          Dapatkan penawaran terbaik dan konsultasi teknis gratis untuk kesuksesan acara Anda. Respon cepat dan profesional.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/6282257289604" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-brand-dark hover:bg-black transition-all rounded-sm shadow-xl hover:-translate-y-1"
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            Jadwalkan Konsultasi
          </a>
        </div>
        <p className="mt-6 text-sm text-brand-dark/60 font-medium">
          Hubungi kami: 0822-5728-9604 (WhatsApp/Call)
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;