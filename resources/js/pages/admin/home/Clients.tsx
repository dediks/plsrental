import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/admin/FormField';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import { ClientsConfig } from '@/types/home';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage Management', href: '#' },
    { title: 'Clients Section', href: '#' },
];

interface ClientsProps {
    clients: ClientsConfig;
}

interface MediaItem {
    id: number;
    path: string;
    url: string;
    alt_text?: string;
    caption?: string;
    order: number;
}

export default function Clients({ clients }: ClientsProps) {
    const { data, setData, put, processing, errors } = useForm<{ clients: ClientsConfig }>({
        clients: clients || {},
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/home/clients', {
            onSuccess: () => toastSuccess('Clients section updated successfully!'),
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update clients section';
                toastError(errorMessage);
            },
        });
    };

    const addClient = () => {
        const currentLogos = data.clients.logos || [];
        if (currentLogos.length >= 20) {
            toastError('Maximum 20 clients allowed');
            return;
        }
        setData('clients', {
            ...data.clients,
            logos: [...currentLogos, { name: '', logo: '' }]
        });
    };

    const removeClient = (index: number) => {
        const currentLogos = data.clients.logos || [];
        setData('clients', {
            ...data.clients,
            logos: currentLogos.filter((_, i) => i !== index)
        });
    };

    const updateClient = (index: number, key: string, value: any) => {
        const currentLogos = [...(data.clients.logos || [])];
        currentLogos[index] = { ...currentLogos[index], [key]: value };
        setData('clients', {
            ...data.clients,
            logos: currentLogos
        });
    };

    const convertUrlToMediaItem = (url: string, index: number): MediaItem => {
        const path = url.startsWith('/storage/') 
            ? url.replace('/storage/', '') 
            : url.startsWith('/') 
                ? url.substring(1)
                : url;
        
        return {
            id: -(index + 1),
            path: path,
            url: url,
            alt_text: '',
            caption: '',
            order: index,
        };
    };

    const convertMediaItemToUrl = (item: MediaItem): string => {
        if (item.url) return item.url;
        if (item.path && !item.path.startsWith('/storage/') && !item.path.startsWith('http')) {
            return item.path.startsWith('/') ? item.path : `/storage/${item.path}`;
        }
        return item.path || '';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Clients Section" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Clients Section</h1>
                    <p className="text-muted-foreground mt-1">Manage content for the clients marquee section</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <Switch 
                                checked={data.clients.showClients ?? true} 
                                onCheckedChange={c => setData('clients', { ...data.clients, showClients: c })} 
                            />
                            <span>Show Clients Section</span>
                        </div>
                        
                        <FormField label="Heading" name="clients.heading">
                            <Input 
                                value={data.clients.heading || ''} 
                                onChange={e => setData('clients', { ...data.clients, heading: e.target.value })} 
                                placeholder="Dipercaya Oleh"
                            />
                        </FormField>
                        <FormField label="Subheading" name="clients.subheading">
                            <Input 
                                value={data.clients.subheading || ''} 
                                onChange={e => setData('clients', { ...data.clients, subheading: e.target.value })} 
                                placeholder="Klien Korporat & Instansi Terkemuka"
                            />
                        </FormField>

                        <div className="space-y-4">
                            <h3 className="font-semibold">Client Logos</h3>
                            {(data.clients.logos || []).map((client: any, index: number) => (
                                <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                    <div className="grid gap-3 flex-1">
                                        <div>
                                            <Input 
                                                placeholder="Client Name *" 
                                                value={client.name || ''} 
                                                onChange={e => updateClient(index, 'name', e.target.value)} 
                                                className={errors[`clients.logos.${index}.name`] ? 'border-destructive' : ''}
                                                required
                                                maxLength={100}
                                            />
                                            {errors[`clients.logos.${index}.name`] && (
                                                <p className="text-sm text-destructive mt-1">
                                                    {errors[`clients.logos.${index}.name`]}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs mb-1 block">Logo (optional)</label>
                                            <MediaSelector 
                                                value={client.logo ? [convertUrlToMediaItem(client.logo, index)] : []}
                                                onChange={items => updateClient(index, 'logo', items.length ? convertMediaItemToUrl(items[0]) : '')}
                                                maxImages={1}
                                                context="logo"
                                                error={errors[`clients.logos.${index}.logo`]}
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Recommended: 400×200px or 2:1 ratio. Formats: SVG, PNG, WebP
                                            </p>
                                            {errors[`clients.logos.${index}.logo`] && (
                                                <p className="text-sm text-destructive mt-1">
                                                    {errors[`clients.logos.${index}.logo`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeClient(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addClient}>
                                <Plus className="mr-2 h-4 w-4" /> Add Client
                            </Button>
                            {(data.clients.logos?.length || 0) >= 20 && (
                                <p className="text-sm text-muted-foreground">Maximum 20 clients allowed</p>
                            )}
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
