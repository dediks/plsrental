import React from 'react';


export default function Process({ heading, subheading, items }: any) {
    const defaultSteps = [
        { num: '01', title: 'Consultation', desc: 'Diskusi kebutuhan teknis dan survey venue.' },
        { num: '02', title: 'Design & Proposal', desc: 'Perancangan sistem dan penawaran biaya transparan.' },
        { num: '03', title: 'Preparation', desc: 'Pengecekan alat dan loading barang H-1.' },
        { num: '04', title: 'Execution', desc: 'Setup, rehearsal, dan show management.' },
    ];

    const steps = items && items.length > 0 ? items : defaultSteps;

    return (
        <section className="py-24 bg-brand-dark border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-brand-gold font-semibold tracking-wider text-sm uppercase mb-3 block">Workflow</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        {heading || 'Proses Kerja Profesional'}
                    </h2>
                    <p className="text-gray-400 text-lg">
                        {subheading || 'Dari tahap perencanaan hingga eksekusi, kami memastikan setiap detail teknis tertangani dengan standar prosedur operasi yang ketat.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />
                    
                    {steps.map((step: any, index: number) => (
                        <div key={index} className="relative bg-brand-dark p-6 group">
                            <div className="w-24 h-24 rounded-full bg-brand-dark border-4 border-white/5 flex items-center justify-center text-3xl font-bold text-brand-gold mb-6 mx-auto group-hover:border-brand-gold transition-colors duration-500 z-10 relative">
                                {step.num}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 text-center">{step.title}</h3>
                            <p className="text-gray-400 text-center text-sm leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}