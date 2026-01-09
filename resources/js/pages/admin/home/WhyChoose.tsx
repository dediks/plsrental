import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/admin/FormField';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { toastSuccess, toastError } from '@/lib/toast';
import { WhyChooseConfig } from '@/types/home';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage Management', href: '#' },
    { title: 'Why Choose Section', href: '#' },
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

interface WhyChooseProps {
    whyChoose: WhyChooseConfig;
}

export default function WhyChoose({ whyChoose }: WhyChooseProps) {
    const { data, setData, put, processing, errors } = useForm<{ whyChoose: WhyChooseConfig }>({
        whyChoose: whyChoose || {},
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

    const whyChooseImageItem = useMemo(() => {
        if (!data.whyChoose.image) return [];
        return [convertUrlToMediaItem(data.whyChoose.image, 0, 8888)];
    }, [data.whyChoose.image]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/home/why-choose', {
            onSuccess: () => toastSuccess('Why Choose section updated successfully!'),
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update why choose section';
                toastError(errorMessage);
            },
        });
    };

    const addItem = () => {
        setData('whyChoose', {
            ...data.whyChoose,
            items: [...(data.whyChoose.items || []), { title: '', text: '', icon: '' }]
        });
    };

    const removeItem = (index: number) => {
        const currentItems = data.whyChoose.items || [];
        setData('whyChoose', {
            ...data.whyChoose,
            items: currentItems.filter((_, i) => i !== index)
        });
    };

    const updateItem = (index: number, key: string, value: any) => {
        const currentItems = [...(data.whyChoose.items || [])];
        currentItems[index] = { ...currentItems[index], [key]: value };
        setData('whyChoose', {
            ...data.whyChoose,
            items: currentItems
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Why Choose Section" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Why Choose Section</h1>
                    <p className="text-muted-foreground mt-1">Manage content for the why choose section</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-6">
                        <FormField label="Subtitle" name="whyChoose.subtitle">
                            <Input value={data.whyChoose.subtitle} onChange={e => setData('whyChoose', { ...data.whyChoose, subtitle: e.target.value })} />
                        </FormField>
                        <FormField label="Heading" name="whyChoose.heading">
                            <Input value={data.whyChoose.heading} onChange={e => setData('whyChoose', { ...data.whyChoose, heading: e.target.value })} />
                        </FormField>
                        <FormField label="Description" name="whyChoose.description">
                            <Textarea value={data.whyChoose.description} onChange={e => setData('whyChoose', { ...data.whyChoose, description: e.target.value })} />
                        </FormField>
                        <FormField label="Quote" name="whyChoose.quote">
                            <Input value={data.whyChoose.quote} onChange={e => setData('whyChoose', { ...data.whyChoose, quote: e.target.value })} />
                        </FormField>
                        
                        <FormField label="Image" name="whyChoose.image">
                            <MediaSelector 
                                value={whyChooseImageItem} 
                                onChange={items => setData('whyChoose', { ...data.whyChoose, image: items.length ? convertMediaItemToUrl(items[0]) : '' })}
                                maxImages={1} 
                            />
                        </FormField>

                        <div className="space-y-4">
                            <h3 className="font-semibold">Reasons</h3>
                            {(data.whyChoose.items || []).map((item: any, index: number) => (
                                <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                    <div className="grid gap-2 flex-1">
                                        <Input placeholder="Title" value={item.title} onChange={e => updateItem(index, 'title', e.target.value)} />
                                        <Textarea placeholder="Text" value={item.text} onChange={e => updateItem(index, 'text', e.target.value)} />
                                        <Input placeholder="Icon (Lucide)" value={item.icon} onChange={e => updateItem(index, 'icon', e.target.value)} />
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" /> Add Reason
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
