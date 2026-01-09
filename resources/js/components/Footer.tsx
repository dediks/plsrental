import { Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import { Logo } from '@/components/Logo';
import { getSocialMediaIcon } from '@/utils/social-media-icons';
import { type SharedData } from '@/types';

const footerLinks = {
    company: [
        { name: 'About', href: '/about' },
        { name: 'History', href: '/about#history' },
        { name: 'Team', href: '/about#team' },
        // { name: 'Awards', href: '' },
    ],
    support: [
        { name: 'Contact', href: '/contact' },
        { name: 'Suppliers', href: '/suppliers' },
        // { name: 'Gallery', href: '/gallery' },
    ],
};

export function Footer() {
    const { socialMediaLinks = [], footerCategories = [] } = usePage<SharedData>().props;
    
    // Build products links from database categories
    const productLinks = [
        { name: 'View All', href: '/products' },
        ...footerCategories.map((category: any) => ({
            name: category.name,
            href: `/products?category=${category.slug}`,
        })),
    ];
    return (
        <footer className="relative border-t border-border/30 dark:border-white/10 bg-gradient-to-b from-slate-800 via-slate-900 to-black dark:from-slate-950 dark:via-black dark:to-black backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 dark:to-black/30 pointer-events-none" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-8 md:px-16 lg:px-12 py-16 lg:py-20">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 gap-12 lg:gap-16 md:grid-cols-2 lg:grid-cols-10">
                    {/* Brand Column - Wider on Desktop */}
                    <div className="md:col-span-2 lg:col-span-4">
                        <Logo size="md" showText={true} variant="link" inverted={true} />
                        <p className="mt-4 body text-slate-300 dark:text-slate-300 max-w-sm">
                            Premium Sound for Remarkable Events
                        </p>
                        {/* Social Media */}
                        {socialMediaLinks.length > 0 && (
                            <div className="mt-8">
                                <h4 className="body-sm font-semibold text-white uppercase tracking-wider mb-4">
                                    Connect With Us
                                </h4>
                                <div className="flex flex-wrap items-center gap-3">
                                    {socialMediaLinks.map((social) => {
                                        const Icon = getSocialMediaIcon(social.platform);
                                        if (!Icon) return null;
                                        return (
                                            <a
                                                key={social.name}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 text-slate-300 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/20 hover:border-white/30 dark:hover:border-white/30 hover:text-white dark:hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
                                                aria-label={social.name}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-1 lg:col-span-2">
                        <h3 className="body-sm font-semibold uppercase tracking-wider text-white mb-4">
                            Products
                        </h3>
                        <ul className="space-y-2.5">
                            {productLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="body-sm text-slate-400 hover:text-white transition-colors duration-300 inline-flex items-center group"
                                    >
                                        <span className="relative">
                                            {link.name}
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-1 lg:col-span-2">
                        <h3 className="body-sm font-semibold uppercase tracking-wider text-white mb-4">
                            Company
                        </h3>
                        <ul className="space-y-2.5">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="body-sm text-slate-400 hover:text-white transition-colors duration-300 inline-flex items-center group"
                                    >
                                        <span className="relative">
                                            {link.name}
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-1 lg:col-span-2">
                        <h3 className="body-sm font-semibold uppercase tracking-wider text-white mb-4">
                            Support
                        </h3>
                        <ul className="space-y-2.5">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="body-sm text-slate-400 hover:text-white transition-colors duration-300 inline-flex items-center group"
                                    >
                                        <span className="relative">
                                            {link.name}
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 lg:mt-10 pt-4 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col items-center md:items-start gap-1">
                            <p className="body-xs text-slate-400 text-center md:text-left">
                                &copy; {new Date().getFullYear()} PLSRental. All Rights Reserved
                            </p>
                            <p className="body-xs text-slate-500 text-center md:text-left">
                                Designed by{' '}
                                <a 
                                    href="https://kodingus.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-white transition-colors duration-300 font-medium inline-flex items-center gap-1 group"
                                >
                                    <span className="relative">
                                        kodingus.com
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                                    </span>
                                </a>
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/privacy"
                                className="body-xs text-slate-400 hover:text-white transition-colors duration-300 inline-flex items-center group"
                            >
                                <span className="relative">
                                    Privacy Policy
                                    <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                                </span>
                            </Link>
                            <Link
                                href="/terms"
                                className="body-xs text-slate-400 hover:text-white transition-colors duration-300 inline-flex items-center group"
                            >
                                <span className="relative">
                                    Terms of Service
                                    <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
