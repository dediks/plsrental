import { NavLink } from './NavLink';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import type { NavigationItem } from './constants';
import { MOBILE_HEADER_HEIGHT } from './constants';
import { getSocialMediaIcon } from '@/utils/social-media-icons';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navigationItems: NavigationItem[];
}

export function MobileMenu({
    isOpen,
    onClose,
    navigationItems,
}: MobileMenuProps) {
    const { socialMediaLinks = [] } = usePage<SharedData>().props;

    if (!isOpen) {
        return null;
    }

    // Separate WhatsApp from other social links
    const whatsappLink = socialMediaLinks.find(
        (link) => link.platform.toLowerCase() === 'whatsapp',
    );
    const otherSocialLinks = socialMediaLinks.filter(
        (link) => link.platform.toLowerCase() !== 'whatsapp',
    );

    const WhatsAppIcon = whatsappLink
        ? getSocialMediaIcon(whatsappLink.platform)
        : null;

    const menuHeight = `calc(100vh - ${MOBILE_HEADER_HEIGHT}px)`;

    return (
        <div
            className="md:hidden fixed left-0 right-0 z-[90] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 dark:border-white/10 w-full shadow-lg"
            style={{
                top: `${MOBILE_HEADER_HEIGHT}px`,
                height: menuHeight,
                maxHeight: menuHeight,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Navigation Items - Scrollable */}
            <div
                style={{
                    flex: '1 1 auto',
                    minHeight: 0,
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                }}
                className="px-4 py-6"
            >
                <nav className="space-y-1">
                    {navigationItems.map((item) => (
                        <NavLink
                            key={item.name}
                            item={item}
                            className="block px-4 py-3 rounded-xl body font-medium text-foreground hover:bg-white/40 hover:dark:bg-white/10 hover:backdrop-blur-lg hover:shadow-md hover:border hover:border-white/30 dark:hover:border-white/20 active:bg-white/60 active:dark:bg-white/20 active:scale-[0.98] transition-all duration-200"
                            onClick={onClose}
                        />
                    ))}
                </nav>
            </div>
            
            {/* Footer Section - Always Visible at Bottom */}
            <div
                style={{
                    flex: '0 0 auto',
                }}
                className="border-t border-white/20 dark:border-white/10 bg-transparent"
            >
                {/* WhatsApp CTA */}
                {whatsappLink && WhatsAppIcon && (
                    <div className="px-4 pt-6 pb-4">
                        <a
                            href={whatsappLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={whatsappLink.name}
                            className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-2xl bg-green-500/80 dark:bg-green-600/80 text-white backdrop-blur-lg hover:bg-green-500/90 hover:dark:bg-green-600/90 hover:shadow-xl hover:shadow-green-500/30 active:scale-[0.98] transition-all font-semibold shadow-lg border border-white/20"
                        >
                            <WhatsAppIcon className="h-5 w-5" />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                )}

                {/* Social Media */}
                {otherSocialLinks.length > 0 && (
                    <div className="px-4 pb-15">
                        <div className="flex items-center justify-center gap-3">
                            {otherSocialLinks.map((social) => {
                                const Icon = getSocialMediaIcon(social.platform);
                                if (!Icon) return null;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-lg border border-white/30 dark:border-white/20 hover:bg-white/30 hover:dark:bg-white/20 hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
                                    >
                                        <Icon className="h-5 w-5 text-foreground" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
