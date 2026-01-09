import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FormField } from '@/components/admin/FormField';
import { toastSuccess, toastError } from '@/lib/toast';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Site Settings', href: '#' },
];

interface LogoMedia {
    id: number;
    url: string;
}

interface EditProps {
    logoLight: LogoMedia | null;
    maintenanceMode: boolean;
}

interface MediaItem {
    id: number;
    path: string;
    url: string;
    srcset?: string;
    responsive_urls?: Record<string | number, string>;
    alt_text?: string;
    caption?: string;
    order: number;
    is_featured: boolean;
}

export default function Edit({ logoLight, maintenanceMode }: EditProps) {
    // Helper to convert LogoMedia to MediaItem array
    const createMediaItemFromLogo = (logo: LogoMedia | null): MediaItem[] => {
        if (!logo || !logo.id) return [];
        
        return [{
            id: logo.id,
            path: '', // Not needed for display if we have URL
            url: logo.url,
            order: 0,
            is_featured: false
        }];
    };

    const [lightLogoMedia, setLightLogoMedia] = useState<MediaItem[]>(createMediaItemFromLogo(logoLight));

    const { data, setData, put, processing, errors } = useForm({
        logoLight: logoLight?.id || null,
        maintenanceMode: maintenanceMode || false,
    });

    // Update form data when media selection changes
    useEffect(() => {
        setData('logoLight', lightLogoMedia.length > 0 ? lightLogoMedia[0].id : null);
    }, [lightLogoMedia]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/settings', {
            preserveScroll: true,
            onSuccess: () => {
                toastSuccess('Settings updated successfully');
            },
            onError: () => {
                toastError('Failed to update settings');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Site Settings" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Site Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your site configuration and branding
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Logo Settings</CardTitle>
                            <CardDescription>
                                Upload logos for light and dark themes. The light logo is used on dark backgrounds, and the dark logo is used on light backgrounds.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-900 dark:bg-slate-950 rounded-lg border">
                                    <MediaSelector
                                        label="Site Logo (displayed on dark backgrounds)"
                                        value={lightLogoMedia}
                                        onChange={setLightLogoMedia}
                                        maxImages={1}
                                        context="logo"
                                        allowFeatured={false}
                                        error={errors.logoLight}
                                    />
                                    <p className="text-sm text-slate-400 mt-2">
                                        This logo will be used throughout the site.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Mode</CardTitle>
                            <CardDescription>
                                When enabled, non-admin users will see a maintenance page. Authenticated admins can still access the site normally.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                label="Enable Maintenance Mode"
                                name="maintenanceMode"
                                error={errors.maintenanceMode}
                                description="Toggle maintenance mode on or off. This will affect all non-admin visitors to your site."
                            >
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="maintenance-mode"
                                        checked={data.maintenanceMode}
                                        onCheckedChange={(checked) => setData('maintenanceMode', checked)}
                                    />
                                    <label
                                        htmlFor="maintenance-mode"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {data.maintenanceMode ? 'Enabled' : 'Disabled'}
                                    </label>
                                </div>
                            </FormField>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Settings'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
