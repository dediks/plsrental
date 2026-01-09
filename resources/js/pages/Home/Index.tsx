import { Seo } from '@/components/Seo';
import type { HomeProps } from '@/types/home';
import React from 'react';
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

export default function Home({ seo }: any) {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-brand-gold selection:text-white bg-brand-dark text-white">
            {seo && <Seo {...seo} />}
            <Navbar />
            <main className="">
                <Hero />
                <Stats />
                <Services />
                <WhyChoose />
                <Portfolio />
                <Process />
                <Testimonials />
                <FinalCTA />
            </main>
            <Footer />
            <Toaster />
        </div>
    );
}
