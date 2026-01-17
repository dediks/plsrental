export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
}

export interface FeaturedProduct {
    id: number;
    name: string;
    slug: string;
    short_description?: string;
    featured_image?: string;
    category?: ProductCategory;
}

export interface ArticleCategory {
    name: string;
}

export interface ArticleAuthor {
    name: string;
}

export interface FeaturedArticle {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    featured_image?: string;
    published_at?: string;
    category?: ArticleCategory;
    author?: ArticleAuthor;
}

export interface HeroConfig {
    carouselImages?: string[];
    splitLayoutImage?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    trustedByText?: string;
    showTrustedBy?: boolean;
    trustedByAvatars?: string[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showBadge?: boolean;
    showScrollIndicator?: boolean;
    showCarousel?: boolean;
    showSplitLayoutImage?: boolean;
    showOverlay?: boolean;
    overlayOpacity?: number;
    contentMaxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
    heading?: string;
    subheading?: string;
    badgeText?: string;
    showHeading?: boolean;
    showSubheading?: boolean;
    mobileHeading?: string;
    mobileSubheading?: string;
    showMobileHeading?: boolean;
    showMobileSubheading?: boolean;
}

export interface AboutConfig {
    tagline?: string;
    heading?: string;
    paragraphs?: string[];
    image?: string;
    imageAlt?: string;
    imagePosition?: 'left' | 'right';
    imagePositionMobile?: 'top' | 'bottom';
    imageFlipHorizontal?: boolean;
    srcset?: string;
    responsive_urls?: Record<string | number, string>;
}

import type { PartnerLogo } from '@/components/PartnerLogos';

export interface PartnersConfig {
    showPartners?: boolean;
    logos?: PartnerLogo[];
}

export interface SeoConfig {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    canonical?: string;
    type?: string;
    siteName?: string;
    twitterHandle?: string;
    ogTitle?: string;
    ogDescription?: string;
    structuredData?: Array<Record<string, unknown>> | Record<string, unknown>;
}


export interface StatsItem {
    label: string;
    value: string;
}

export interface StatsConfig {
    items?: StatsItem[];
    showStats?: boolean;
}

export interface ServiceItem {
    id?: number;
    title: string;
    description: string;
    icon: string;
}

export interface ServicesConfig {
    heading?: string;
    subheading?: string;
    items?: ServiceItem[];
}

export interface WhyChooseItem {
    icon: string;
    title: string;
    text: string;
}

export interface WhyChooseConfig {
    subtitle?: string;
    heading?: string;
    description?: string;
    image?: string;
    quote?: string;
    items?: WhyChooseItem[];
}

export interface PortfolioItem {
    title: string;
    category: string;
    imageUrl: string;
}

export interface PortfolioConfig {
    heading?: string;
    subheading?: string;
    items?: PortfolioItem[];
}

export interface ProcessItem {
    num: string;
    title: string;
    desc: string;
}

export interface ProcessConfig {
    heading?: string;
    subheading?: string;
    items?: ProcessItem[];
}

export interface TestimonialItem {
    text: string;
    author: string;
    role: string;
    company: string;
}

export interface TestimonialsConfig {
    heading?: string;
    items?: TestimonialItem[];
}

export interface FinalCTAConfig {
    heading?: string;
    subheading?: string;
    buttonText?: string;
    buttonLink?: string;
    phoneNumber?: string;
}

export interface SocialLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
}

export interface ClientLogoDef {
    name: string;
    logo?: string;
}

export interface ClientsConfig {
    showClients?: boolean;
    heading?: string;
    subheading?: string;
    logos?: ClientLogoDef[];
}

export interface FooterConfig {
    brandName?: string;
    brandSubtitle?: string;
    description?: string;
    brandDescription?: string;  // Legacy field
    contactPhone?: string;
    contactEmail?: string;
    contactAddress?: string;
    address?: string;  // Legacy field
    phone?: string;  // Legacy field
    email?: string;  // Legacy field
    socialLinks?: SocialLinks;
    copyrightText?: string;
}

export interface HomeProps {
    featuredProducts: FeaturedProduct[];
    featuredArticles: FeaturedArticle[];
    hero: HeroConfig;
    about: AboutConfig; // Keeping for backward compatibility if needed, though replaced
    partners: PartnersConfig; // Keeping for backward compatibility
    stats?: StatsConfig;
    clients?: ClientsConfig;
    services?: ServicesConfig;
    whyChoose?: WhyChooseConfig;
    portfolio?: PortfolioConfig;
    process?: ProcessConfig;
    testimonials?: TestimonialsConfig;
    finalCTA?: FinalCTAConfig;
    footer?: FooterConfig;
    seo?: SeoConfig;
}

