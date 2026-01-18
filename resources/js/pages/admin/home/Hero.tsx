import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/admin/FormField';
import { MediaSelector, type MediaItem } from '@/components/admin/MediaSelector';
import { toastSuccess, toastError } from '@/lib/toast';
import { HeroConfig } from '@/types/home';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage Management', href: '#' },
    { title: 'Hero Section', href: '#' },
];


interface HeroProps {
    hero: HeroConfig;
}

export default function Hero({ hero }: HeroProps) {
    const { data, setData, put, processing, errors } = useForm<{ hero: HeroConfig }>({
        hero: hero || {},
    });

    const convertUrlToMediaItem = (url: string, index: number = 0, idOffset: number = 0): MediaItem => {
        const path = url.startsWith('/storage/') 
            ? url.replace('/storage/', '') 
            : url.startsWith('/') 
                ? url.substring(1)
                : url;
        
        return {
            id: -(index + idOffset),
            path: path,
            url: url,
            alt_text: '',
            caption: '',
            order: index,

        } as MediaItem;
    };

    const convertMediaItemToUrl = (item: MediaItem): string => {
        if (item.url) return item.url;
        if (item.path && !item.path.startsWith('/storage/') && !item.path.startsWith('http')) {
            return item.path.startsWith('/') ? item.path : `/storage/${item.path}`;
        }
        return item.path || '';
    };

    const backgroundImageItem = useMemo(() => {
        if (!data.hero.backgroundImage) return [];
        return [convertUrlToMediaItem(data.hero.backgroundImage, 0, 999)];
    }, [data.hero.backgroundImage]);

    const supportingBrandLogoItem = useMemo(() => {
        if (!data.hero.supportingBrandLogo) return [];
        return [convertUrlToMediaItem(data.hero.supportingBrandLogo, 0, 998)];
    }, [data.hero.supportingBrandLogo]);

    const secondaryBrandLogoItem = useMemo(() => {
        if (!data.hero.secondaryBrandLogo) return [];
        return [convertUrlToMediaItem(data.hero.secondaryBrandLogo, 0, 997)];
    }, [data.hero.secondaryBrandLogo]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/home/hero', {
            onSuccess: () => toastSuccess('Hero section updated successfully!'),
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update hero section';
                toastError(errorMessage);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Hero Section" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Hero Section</h1>
                    <p className="text-muted-foreground mt-1">Manage content for the hero section</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-6">
                        <FormField label="Heading" name="hero.heading" error={errors['hero.heading']}>
                            <Input 
                                value={data.hero.heading || ''} 
                                onChange={e => setData('hero', { ...data.hero, heading: e.target.value })} 
                                placeholder="Kualitas Suara Tanpa Kompromi."
                            />
                        </FormField>
                        <FormField label="Subheading" name="hero.subheading" error={errors['hero.subheading']}>
                            <Textarea 
                                value={data.hero.subheading || ''} 
                                onChange={e => setData('hero', { ...data.hero, subheading: e.target.value })} 
                                placeholder="PLS menghadirkan solusi sound system premium..."
                                rows={4}
                            />
                        </FormField>
                        
                        <FormField label="Badge Text" name="hero.badgeText" error={errors['hero.badgeText']}>
                            <Input 
                                value={data.hero.badgeText || ''} 
                                onChange={e => setData('hero', { ...data.hero, badgeText: e.target.value })} 
                                placeholder="Professional Audio Production"
                            />
                        </FormField>
                        
                        <FormField label="Background Image" name="hero.backgroundImage" error={errors['hero.backgroundImage']}>
                            <MediaSelector 
                                value={backgroundImageItem} 
                                onChange={items => setData('hero', { ...data.hero, backgroundImage: items.length ? convertMediaItemToUrl(items[0]) : '' })}
                                maxImages={1} 
                            />
                        </FormField>

                        <div className="border-t pt-6 mt-6">
                            <h3 className="text-lg font-semibold mb-4">Supporting Brand</h3>
                            <p className="text-sm text-muted-foreground mb-4">Displays "Part of [Brand Name]" below the CTA buttons (e.g., UAProfessional)</p>
                            
                            <div className="space-y-4">
                                <FormField label="Brand Name" name="hero.supportingBrandName" error={errors['hero.supportingBrandName']}>
                                    <Input 
                                        value={data.hero.supportingBrandName || ''} 
                                        onChange={e => setData('hero', { ...data.hero, supportingBrandName: e.target.value })} 
                                        placeholder="UAProfessional"
                                    />
                                </FormField>
                                
                                <FormField label="Brand Logo" name="hero.supportingBrandLogo" error={errors['hero.supportingBrandLogo']}>
                                    <MediaSelector 
                                        value={supportingBrandLogoItem} 
                                        onChange={items => setData('hero', { ...data.hero, supportingBrandLogo: items.length ? convertMediaItemToUrl(items[0]) : '' })}
                                        maxImages={1} 
                                    />
                                </FormField>
                                
                                <FormField label="Brand Link" name="hero.supportingBrandLink" error={errors['hero.supportingBrandLink']}>
                                    <Input 
                                        value={data.hero.supportingBrandLink || ''} 
                                        onChange={e => setData('hero', { ...data.hero, supportingBrandLink: e.target.value })} 
                                        placeholder="https://uaprofessional.com"
                                    />
                                </FormField>
                            </div>
                        </div>

                        <div className="border-t pt-6 mt-6">
                            <h3 className="text-lg font-semibold mb-4">Secondary Brand (Partner)</h3>
                            <p className="text-sm text-muted-foreground mb-4">Displays after the "x" separator next to the supporting brand</p>
                            
                            <div className="space-y-4">
                                <FormField label="Brand Name" name="hero.secondaryBrandName" error={errors['hero.secondaryBrandName']}>
                                    <Input 
                                        value={data.hero.secondaryBrandName || ''} 
                                        onChange={e => setData('hero', { ...data.hero, secondaryBrandName: e.target.value })} 
                                        placeholder="Partner Brand"
                                    />
                                </FormField>
                                
                                <FormField label="Brand Logo" name="hero.secondaryBrandLogo" error={errors['hero.secondaryBrandLogo']}>
                                    <MediaSelector 
                                        value={secondaryBrandLogoItem} 
                                        onChange={items => setData('hero', { ...data.hero, secondaryBrandLogo: items.length ? convertMediaItemToUrl(items[0]) : '' })}
                                        maxImages={1} 
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end sticky bottom-0 bg-background pt-4 pb-4 border-t z-10">
                        <Button type="submit" disabled={processing} size="lg">
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
