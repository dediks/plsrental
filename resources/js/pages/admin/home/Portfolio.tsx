import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/admin/FormField';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { Plus, Trash2 } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import { PortfolioConfig } from '@/types/home';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage Management', href: '#' },
    { title: 'Portfolio Section', href: '#' },
];

interface MediaItem {
    id: number;
    path: string;
    url: string;
    alt_text?: string;
    caption?: string;
    order: number;
    is_featured: boolean;
}

interface PortfolioProps {
    portfolio: PortfolioConfig;
}

export default function Portfolio({ portfolio }: PortfolioProps) {
    const { data, setData, put, processing, errors } = useForm<{ portfolio: PortfolioConfig }>({
        portfolio: portfolio || {},
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
            is_featured: false,
        } as MediaItem;
    };

    const convertMediaItemToUrl = (item: MediaItem): string => {
        if (item.url) return item.url;
        if (item.path && !item.path.startsWith('/storage/') && !item.path.startsWith('http')) {
            return item.path.startsWith('/') ? item.path : `/storage/${item.path}`;
        }
        return item.path || '';
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/home/portfolio', {
            onSuccess: () => toastSuccess('Portfolio section updated successfully!'),
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update portfolio section';
                toastError(errorMessage);
            },
        });
    };

    const addItem = () => {
        setData('portfolio', {
            ...data.portfolio,
            items: [...(data.portfolio.items || []), { title: '', category: '', imageUrl: '' }]
        });
    };

    const removeItem = (index: number) => {
        const currentItems = data.portfolio.items || [];
        setData('portfolio', {
            ...data.portfolio,
            items: currentItems.filter((_, i) => i !== index)
        });
    };

    const updateItem = (index: number, key: string, value: any) => {
        const currentItems = [...(data.portfolio.items || [])];
        currentItems[index] = { ...currentItems[index], [key]: value };
        setData('portfolio', {
            ...data.portfolio,
            items: currentItems
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Portfolio Section" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Portfolio Section</h1>
                    <p className="text-muted-foreground mt-1">Manage content for the portfolio section</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-6">
                        <FormField label="Heading" name="portfolio.heading">
                            <Input value={data.portfolio.heading} onChange={e => setData('portfolio', { ...data.portfolio, heading: e.target.value })} />
                        </FormField>
                        <FormField label="Subheading" name="portfolio.subheading">
                            <Textarea value={data.portfolio.subheading} onChange={e => setData('portfolio', { ...data.portfolio, subheading: e.target.value })} />
                        </FormField>

                        <div className="space-y-4">
                            {(data.portfolio.items || []).map((item: any, index: number) => (
                                <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                    <div className="grid gap-3 flex-1">
                                        <Input placeholder="Project Title" value={item.title} onChange={e => updateItem(index, 'title', e.target.value)} />
                                        <Input placeholder="Category" value={item.category} onChange={e => updateItem(index, 'category', e.target.value)} />
                                        <div>
                                            <label className="text-xs mb-1 block">Image</label>
                                            <MediaSelector 
                                                value={item.imageUrl ? [convertUrlToMediaItem(item.imageUrl, 0, 9000 + index)] : []}
                                                onChange={items => updateItem(index, 'imageUrl', items.length ? convertMediaItemToUrl(items[0]) : '')}
                                                maxImages={1}
                                            />
                                        </div>
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" /> Add Portfolio Item
                            </Button>
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
