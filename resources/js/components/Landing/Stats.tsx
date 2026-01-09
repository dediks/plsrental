import React from 'react';

const Stats: React.FC = () => {
  const stats = [
    { label: "Tahun Pengalaman", value: "10+" },
    { label: "Event Sukses", value: "500+" },
    { label: "Klien Korporat & Instansi", value: "200+" },
    { label: "Keandalan Teknis", value: "100%" },
  ];

  return (
    <section className="bg-brand-charcoal border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center md:text-left">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">{stat.value}</span>
              <span className="text-sm uppercase tracking-wide text-neutral-500 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;