export const HEADER_HEIGHT = 80; // h-20
export const MOBILE_HEADER_HEIGHT = 56; // h-14
export const NAV_HEIGHT = 64; // h-16

export type NavigationItem = {
    name: string;
    href: string;
};

export const navigation: NavigationItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'News', href: '/articles' },
    { name: 'Suppliers', href: '/suppliers' },
    { name: 'Rentals', href: '/rentals' },
    { name: 'Contact', href: '/contact' },
];
