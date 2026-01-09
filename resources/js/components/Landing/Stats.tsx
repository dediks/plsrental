import React from 'react';

interface StatItem {
  label: string;
  value: string;
}

interface StatsProps {
  items?: StatItem[];
}

const Stats: React.FC<StatsProps> = ({ items }) => {
  const stats = items && items.length > 0 
    ? items.map((item, index) => ({
        ...item,
        id: index + 1
      }))
    : [
        { id: 1, label: "Tahun Pengalaman", value: "10+" },
        { id: 2, label: "Event Sukses", value: "500+" },
        { id: 3, label: "Klien Korporat & Instansi", value: "200+" },
        { id: 4, label: "Keandalan Teknis", value: "100%" },
      ];

  return (
    <section className="bg-brand-charcoal border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center md:text-left">
          {stats.map((stat, index) => (
            <div key={stat.id} className="flex flex-col">
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