import React from 'react';
import { ShieldCheck } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    // @ts-ignore
    const IconComponent = LucideIcons[name] || ShieldCheck;
    return <IconComponent className={className} />;
};

export default function WhyChoose({ 
    subtitle, 
    heading, 
    description, 
    image, 
    quote,
    items 
}: any) {
    const defaultItems = [
        {
            icon: 'ShieldCheck',
            title: "Tim Teknis Berpengalaman",
            text: "Didukung oleh SDM yang memahami etika kerja profesional dan teknis audio mendalam."
        },
        {
            icon: 'CheckCircle2',
            title: "Peralatan Terawat & Ready",
            text: "Unit selalu melalui maintenance rutin. Kebersihan dan fungsi alat adalah prioritas kami."
        },
        {
            icon: 'Clock',
            title: "Tepat Waktu & Rapi",
            text: "Setup dilakukan jauh sebelum acara dimulai. Manajemen kabel yang rapi untuk estetika venue."
        },
        {
            icon: 'Activity',
            title: "Monitoring Penuh",
            text: "Standby operator selama acara berlangsung untuk antisipasi dan penanganan teknis instan."
        }
    ];

    const listItems = items && items.length > 0 ? items : defaultItems;

    return (
        <section className="py-24 bg-brand-dark relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Left Content */}
                    <div className="flex-1 space-y-8 sticky top-24">
                        <div>
                            <span className="text-brand-gold font-semibold tracking-wider text-sm uppercase mb-3 block">
                                {subtitle || 'Mengapa PLS?'}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                                {heading || 'Standar Tinggi untuk Acara Penting Anda.'}
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                {description || 'Kami mengerti bahwa dalam event korporat dan kenegaraan, tidak ada ruang untuk kesalahan teknis. PLS hadir sebagai mitra teknis yang memprioritaskan detail dan kesempurnaan.'}
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {listItems.map((item: any, index: number) => (
                                <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                                            <DynamicIcon name={item.icon} className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                                        <p className="text-gray-400 leading-relaxed text-sm">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent z-10" />
                            <img
                                src={image || "https://picsum.photos/id/431/800/1000"}
                                alt="Crew in Action"
                                className="w-full h-[800px] object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                            />
                            
                            {/* Quote Card */}
                            <div className="absolute bottom-8 left-8 right-8 z-20 p-8 bg-brand-gold/90 backdrop-blur-md rounded-xl text-black">
                                <p className="text-xl font-bold italic mb-4">
                                    {quote || '"Keberhasilan acara Anda adalah reputasi kami."'}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-black" />
                                    <span className="font-semibold text-sm tracking-widest uppercase">PLS Commitment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}