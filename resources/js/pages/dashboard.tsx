import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Package, Building2, Images, FolderTree, Image as ImageIcon, Home, Share2, Info, Settings, Mail, MessageSquare, KeyRound, LayoutGrid, BookOpen } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// Organize sections to match the sidebar navigation structure
const websiteContentSections = [
    {
        title: 'Hero',
        description: 'Edit hero section content',
        href: '/dashboard/admin/home/hero',
        icon: Home,
    },
    {
        title: 'Stats',
        description: 'Manage statistics display',
        href: '/dashboard/admin/home/stats',
        icon: LayoutGrid,
    },
    {
        title: 'Clients',
        description: 'Manage client logos',
        href: '/dashboard/admin/home/clients',
        icon: Building2,
    },
    {
        title: 'Services',
        description: 'Edit services section',
        href: '/dashboard/admin/home/services',
        icon: Package,
    },
    {
        title: 'Why Choose',
        description: 'Edit why choose us section',
        href: '/dashboard/admin/home/why-choose',
        icon: Info,
    },
    {
        title: 'Portfolio',
        description: 'Manage portfolio items',
        href: '/dashboard/admin/home/portfolio',
        icon: FolderTree,
    },
    {
        title: 'Process',
        description: 'Edit process steps',
        href: '/dashboard/admin/home/process',
        icon: BookOpen,
    },
    {
        title: 'Testimonials',
        description: 'Manage testimonials',
        href: '/dashboard/admin/home/testimonials',
        icon: MessageSquare,
    },
    {
        title: 'Final CTA',
        description: 'Edit final call to action',
        href: '/dashboard/admin/home/final-cta',
        icon: Mail,
    },
    {
        title: 'Footer',
        description: 'Edit footer content',
        href: '/dashboard/admin/home/footer',
        icon: FileText,
    },
];


const mediaAssetsSections = [
    {
        title: 'Media Library',
        description: 'Manage all media files',
        href: '/dashboard/admin/media',
        icon: ImageIcon,
    },
    {
        title: 'Social Media',
        description: 'Manage social media links',
        href: '/dashboard/admin/social-media',
        icon: Share2,
    },
];

const siteSettingsSections = [
    {
        title: 'Site Settings',
        description: 'Manage site configuration and branding',
        href: '/dashboard/admin/settings',
        icon: Settings,
    },
];

export default function Dashboard() {
    const renderSectionCards = (sections: typeof websiteContentSections) => {
        return sections.map((section) => {
            const Icon = section.icon;
            return (
                <Link
                    key={section.href}
                    href={section.href}
                    className="block"
                >
                    <Card className="hover:border-primary/50 hover:shadow-sm transition-colors cursor-pointer h-full">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Icon className="size-5 text-primary" />
                                </div>
                                <CardTitle className="text-lg">
                                    {section.title}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                {section.description}
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            );
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome to the admin panel
                    </p>
                </div>

                {/* Content Management */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Content Management</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage your website pages and content
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {renderSectionCards(websiteContentSections)}
                    </div>
                </div>

                {/* Media & Assets */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Media & Assets</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage media files and social media links
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {renderSectionCards(mediaAssetsSections)}
                    </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Settings</h2>
                        <p className="text-sm text-muted-foreground">
                            Configure site-wide settings and branding
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {renderSectionCards(siteSettingsSections)}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
