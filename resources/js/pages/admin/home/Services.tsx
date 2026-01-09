import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/admin/FormField';
import { Plus, Trash2 } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import { ServicesConfig } from '@/types/home';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage Management', href: '#' },
    { title: 'Services Section', href: '#' },
];

interface ServicesProps {
    services: ServicesConfig;
}

export default function Services({ services }: ServicesProps) {
    const { data, setData, put, processing, errors } = useForm<{ services: ServicesConfig }>({
        services: services || {},
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/home/services', {
            onSuccess: () => toastSuccess('Services section updated successfully!'),
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update services section';
                toastError(errorMessage);
            },
        });
    };

    const addItem = () => {
        setData('services', {
            ...data.services,
            items: [...(data.services.items || []), { title: '', description: '', icon: '' }]
        });
    };

    const removeItem = (index: number) => {
        const currentItems = data.services.items || [];
        setData('services', {
            ...data.services,
            items: currentItems.filter((_, i) => i !== index)
        });
    };

    const updateItem = (index: number, key: string, value: any) => {
        const currentItems = [...(data.services.items || [])];
        currentItems[index] = { ...currentItems[index], [key]: value };
        setData('services', {
            ...data.services,
            items: currentItems
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Services Section" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Services Section</h1>
                    <p className="text-muted-foreground mt-1">Manage content for the services section</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-6">
                        <FormField label="Heading" name="services.heading">
                            <Input value={data.services.heading} onChange={e => setData('services', { ...data.services, heading: e.target.value })} />
                        </FormField>
                        <FormField label="Subheading" name="services.subheading">
                            <Textarea value={data.services.subheading} onChange={e => setData('services', { ...data.services, subheading: e.target.value })} />
                        </FormField>

                        <div className="space-y-4">
                            {(data.services.items || []).map((item: any, index: number) => (
                                <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                    <div className="grid gap-3 flex-1">
                                        <Input placeholder="Service Title" value={item.title} onChange={e => updateItem(index, 'title', e.target.value)} />
                                        <Textarea placeholder="Description" value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} />
                                        <Input placeholder="Icon Name (Lucide, e.g. Speaker)" value={item.icon} onChange={e => updateItem(index, 'icon', e.target.value)} />
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" /> Add Service
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
