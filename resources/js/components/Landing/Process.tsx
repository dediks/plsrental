import React from 'react';

interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

interface ProcessProps {
  heading?: string;
  subheading?: string;
  items?: ProcessStep[];
}

const defaultSteps = [
  {
    num: "01",
    title: "Konsultasi Kebutuhan",
    desc: "Diskusikan detail acara, spesifikasi venue, dan target audiens Anda. Kami memberikan rekomendasi teknis yang efisien."
  },
  {
    num: "02",
    title: "Perencanaan & Persiapan",
    desc: "Tim kami menyusun skema layout audio dan loading list. Alat disiapkan dan dicek fungsi sebelum diberangkatkan."
  },
  {
    num: "03",
    title: "Eksekusi & Dukungan",
    desc: "Instalasi rapi tepat waktu, sound check mendetail, dan pendampingan teknis penuh selama acara berlangsung."
  }
];

const Process: React.FC<ProcessProps> = ({
  heading = "Alur Kerja Profesional",
  subheading = "Proses sederhana untuk hasil maksimal tanpa kerumitan bagi Anda.",
  items
}) => {
  const steps = items && items.length > 0 ? items : defaultSteps;

  return (
    <section className="py-20 bg-brand-charcoal border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">{heading}</h2>
          <p className="text-neutral-400">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-white/10 -z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-3xl font-bold text-brand-gold mb-6 shadow-xl">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;