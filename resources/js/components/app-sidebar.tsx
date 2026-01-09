import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { resolveUrl } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { useAppearanceToggle } from './appearance-dropdown';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BookOpen, Folder, LayoutGrid, FileText, Package, Building2, Images, FolderTree, Image as ImageIcon, Moon, Sun, Home, Share2, ChevronRight, Info, Settings, Mail, MessageSquare, KeyRound } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const websiteContentItems: NavItem[] = [
    // Removed Home Page - now split into individual sections under Homepage Management
];

const homepageManagementItems: NavItem[] = [
    {
        title: 'Hero',
        href: '/dashboard/admin/home/hero',
        icon: Home,
    },
    {
        title: 'Stats',
        href: '/dashboard/admin/home/stats',
        icon: LayoutGrid,
    },
    {
        title: 'Services',
        href: '/dashboard/admin/home/services',
        icon: Package,
    },
    {
        title: 'Why Choose',
        href: '/dashboard/admin/home/why-choose',
        icon: Info,
    },
    {
        title: 'Portfolio',
        href: '/dashboard/admin/home/portfolio',
        icon: FolderTree,
    },
    {
        title: 'Process',
        href: '/dashboard/admin/home/process',
        icon: BookOpen,
    },
    {
        title: 'Testimonials',
        href: '/dashboard/admin/home/testimonials',
        icon: MessageSquare,
    },
    {
        title: 'Final CTA',
        href: '/dashboard/admin/home/final-cta',
        icon: Mail,
    },
    {
        title: 'Footer',
        href: '/dashboard/admin/home/footer',
        icon: FileText,
    },
];

const mediaAssetsItems: NavItem[] = [
    {
        title: 'Media Library',
        href: '/dashboard/admin/media',
        icon: ImageIcon,
    },
    {
        title: 'Social Media',
        href: '/dashboard/admin/social-media',
        icon: Share2,
    },
];

const settingsItems: NavItem[] = [
    {
        title: 'Site Settings',
        href: '/dashboard/admin/settings',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [];

function SettingsGroup() {
    const { isDark, toggleAppearance } = useAppearanceToggle();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={toggleAppearance}
                        tooltip={{ children: 'Toggle theme' }}
                    >
                        {isDark ? <Sun /> : <Moon />}
                        <span>Theme</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}

function CollapsibleNavGroup({ title, items, defaultOpen = true }: { title: string; items: NavItem[]; defaultOpen?: boolean }) {
    const page = usePage();

    const isActive = (href: string) => {
        const resolvedHref = resolveUrl(href);
        const currentUrl = page.url;
        
        // Exact match
        if (currentUrl === resolvedHref) {
            return true;
        }
        
        // Check if URL starts with href followed by '/' or end of string
        // This prevents /dashboard/admin/contact from matching /dashboard/admin/contact-submissions
        if (currentUrl.startsWith(resolvedHref)) {
            const nextChar = currentUrl[resolvedHref.length];
            return nextChar === '/' || nextChar === undefined;
        }
        
        return false;
    };

    return (
        <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="w-full dark:hover:bg-slate-600 flex items-center justify-between hover:bg-sidebar-accent/20 hover:text-black hover:cursor-pointer rounded-md transition-colors">
                        <span className="text-black dark:text-white">{title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={isActive(resolveUrl(item.href))}
                                >
                                    <Link href={item.href} prefetch>
                                        <span className="fill-black">
                                        {item.icon && <item.icon />}
                                        </span>
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}

export function AppSidebar() {
    const page = usePage();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                
                <CollapsibleNavGroup 
                    title="Homepage Management" 
                    items={homepageManagementItems}
                    defaultOpen={true}
                />

                <CollapsibleNavGroup 
                    title="Media & Assets" 
                    items={mediaAssetsItems}
                    defaultOpen={true}
                />
                
                <CollapsibleNavGroup 
                    title="Settings" 
                    items={settingsItems}
                    defaultOpen={false}
                />
                
                {/* <SettingsGroup /> */}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
