import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

const Navbar: React.FC = () => {
  const { logoSettings } = usePage<SharedData>().props;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Layanan', href: '#services' },
    { name: 'Keunggulan', href: '#why-us' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Testimoni', href: '#testimonials' },
  ];

  // Get logo (use light logo for dark background)
  const logoSrc = logoSettings?.logoLight || '/images/white-logo.svg';

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brand-dark/95 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="block group">
              <img 
                src={logoSrc} 
                alt="PLS Rental Division" 
                className="h-8 md:h-9 w-auto transition-transform group-hover:scale-105"
              />
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="px-5 py-2.5 text-sm font-semibold text-brand-dark bg-white hover:bg-neutral-200 transition-colors rounded-sm"
            >
              Konsultasi
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-brand-gold transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-charcoal border-b border-white/10 shadow-2xl">
          <div className="px-6 py-8 space-y-4 flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-300 hover:text-white"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-block text-center mt-4 px-5 py-3 text-sm font-semibold text-brand-dark bg-white rounded-sm"
            >
              Jadwalkan Konsultasi
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;