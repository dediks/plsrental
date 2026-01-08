import React from 'react';
import { Settings } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    // @ts-ignore
    const IconComponent = LucideIcons[name] || Settings;
    return <IconComponent className={className} />;
};

export default function Services({ heading, subheading, items = [] }: any) {
    const defaultServices = [
        {
            title: "Rental Sound System Premium",
            description: "Sistem audio kelas dunia yang dikalibrasi presisi untuk kejernihan suara maksimal di setiap sudut venue.",
            icon: "Speaker"
        },
        {
            title: "Corporate & Government Support",
            description: "Layanan audio visual terintegrasi khusus untuk rapat umum, konferensi, pelantikan, dan gala dinner resmi.",
            icon: "Users"
        },
        {
            title: "Event Skala Besar & Outdoor",
            description: "Kapasitas daya dan cakupan audio luas untuk festival, gathering akbar, atau acara lapangan terbuka.",
            icon: "Radio"
        },
        {
            title: "Lighting & Technical Production",
            description: "Paket dukungan pencahayaan panggung dan tata teknis menyeluruh untuk estetika visual yang selaras.",
            icon: "Settings"
        },
        {
            title: "Manpower & Audio Engineer",
            description: "Operator berpengalaman dan teknisi bersertifikat yang memastikan kelancaran teknis dari awal hingga akhir.",
            icon: "Mic2"
        }
    ];

    const services = items && items.length > 0 ? items : defaultServices;

    return (
        <section className="py-24 bg-brand-dark relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        {heading || 'Solusi Audio Terintegrasi'}
                    </h2>
                    <p className="text-gray-400 text-lg">
                        {subheading || 'Kami menyediakan lebih dari sekadar peralatan. PLS memberikan ketenangan pikiran melalui layanan teknis yang komprehensif.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service: any, index: number) => (
                        <div 
                            key={index}
                            className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-gold/30 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <DynamicIcon name={service.icon} className="w-32 h-32" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6 group-hover:bg-brand-gold/20 transition-colors">
                                    <DynamicIcon name={service.icon} className="w-7 h-7 text-brand-gold" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-gold transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}