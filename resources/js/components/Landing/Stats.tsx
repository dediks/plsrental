import React from 'react';

export default function Stats({ items = [], showStats = true }: { items?: any[], showStats?: boolean }) {
    if (!showStats) return null;
    
    // Default fallback if items undefined (though backend should provide defaults)
    const stats = items && items.length > 0 ? items : [
        { label: "Tahun Pengalaman", value: "10+" },
        { label: "Event Sukses", value: "500+" },
        { label: "Klien Korporat & Instansi", value: "200+" },
        { label: "Keandalan Teknis", value: "100%" }
    ];

    return (
        <section className="bg-brand-dark border-y border-white/5 relative z-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border-x border-white/10">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-8 text-center group hover:bg-white/5 transition-colors duration-300">
                            <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">{stat.value}</h3>
                            <p className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}