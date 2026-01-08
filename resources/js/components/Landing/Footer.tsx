import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Mail, Phone, Clock } from 'lucide-react';

export default function Footer({ 
    brandName, 
    brandDescription, 
    address, 
    phone, 
    email, 
    socialLinks, 
    copyrightText 
}: any) {
    return (
        <footer className="bg-black pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                            {brandName || 'PLS Rental'}
                            <span className="text-brand-gold">.</span>
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            {brandDescription || 'Platform penyewaan sound system dan peralatan audio visual profesional nomor satu di Indonesia. Memberikan kualitas live sound tanpa kompromi.'}
                        </p>
                        <div className="flex gap-4">
                            {socialLinks?.facebook && <a href={socialLinks.facebook} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-black transition-all"><Facebook size={18} /></a>}
                            {socialLinks?.instagram && <a href={socialLinks.instagram} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-black transition-all"><Instagram size={18} /></a>}
                            {socialLinks?.twitter && <a href={socialLinks.twitter} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-black transition-all"><Twitter size={18} /></a>}
                            {socialLinks?.linkedin && <a href={socialLinks.linkedin} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-black transition-all"><Linkedin size={18} /></a>}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Layanan</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-brand-gold transition-colors">Sound System Rental</a></li>
                            <li><a href="#" className="hover:text-brand-gold transition-colors">Lighting Production</a></li>
                            <li><a href="#" className="hover:text-brand-gold transition-colors">Multimedia System</a></li>
                            <li><a href="#" className="hover:text-brand-gold transition-colors">Live Recording</a></li>
                            <li><a href="#" className="hover:text-brand-gold transition-colors">Rigging & Stage</a></li>
                        </ul>
                    </div>

                     {/* Service Area */}
                     <div>
                        <h4 className="text-white font-bold mb-6">Area Layanan</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>Jakarta & Jabodetabek</li>
                            <li>Bandung & Jawa Barat</li>
                            <li>Surabaya & Jawa Timur</li>
                            <li>Bali & Lombok</li>
                            <li>Medan & Sumatera</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                         <h4 className="text-white font-bold mb-6">Hubungi Kami</h4>
                         <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex gap-3 items-start">
                                <MapPin className="shrink-0 text-brand-gold w-5 h-5" />
                                <span>{address || 'Jl. Audio Professional No. 88, Jakarta Selatan, Indonesia'}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Phone className="shrink-0 text-brand-gold w-5 h-5" />
                                <span>{phone || '+62 812-3456-7890'}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Mail className="shrink-0 text-brand-gold w-5 h-5" />
                                <span>{email || 'info@plsrental.com'}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Clock className="shrink-0 text-brand-gold w-5 h-5" />
                                <span>Senin - Sabtu, 09:00 - 18:00</span>
                            </li>
                         </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>{copyrightText || `© ${new Date().getFullYear()} PLS Rental. All rights reserved.`}</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}