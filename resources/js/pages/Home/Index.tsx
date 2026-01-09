import { Seo } from '@/components/Seo';
import Navbar from '@/components/Landing/Navbar';
import Hero from '@/components/Landing/Hero';
import Stats from '@/components/Landing/Stats';
import Services from '@/components/Landing/Services';
import WhyChoose from '@/components/Landing/WhyChoose';
import Portfolio from '@/components/Landing/Portfolio';
import Process from '@/components/Landing/Process';
import Testimonials from '@/components/Landing/Testimonials';
import FinalCTA from '@/components/Landing/FinalCTA';
import Footer from '@/components/Landing/Footer';
import { Toaster } from '@/components/ui/toaster';

export default function Home({ 
    seo, 
    hero, 
    stats, 
    services, 
    whyChoose, 
    portfolio, 
    process, 
    testimonials, 
    finalCTA, 
    footer 
}: any) {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-brand-gold selection:text-white bg-brand-dark text-white">
            {seo && <Seo {...seo} />}
            <Navbar />
            <main className="">
                <Hero {...hero} />
                <Stats {...stats} />
                <Services {...services} />
                <WhyChoose {...whyChoose} />
                <Portfolio {...portfolio} />
                <Process {...process} />
                <Testimonials {...testimonials} />
                <FinalCTA {...finalCTA} />
            </main>
            <Footer {...footer} />
            <Toaster />
        </div>
    );
}
