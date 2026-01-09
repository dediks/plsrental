import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/admin/FormField';
import { Plus, Trash2 } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import { ProcessConfig } from '@/types/home';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage Management', href: '#' },
    { title: 'Process Section', href: '#' },
];

interface ProcessProps {
    process: ProcessConfig;
}

export default function Process({ process }: ProcessProps) {
    const { data, setData, put, processing, errors } = useForm<{ process: ProcessConfig }>({
        process: process || {},
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/home/process', {
            onSuccess: () => toastSuccess('Process section updated successfully!'),
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update process section';
                toastError(errorMessage);
            },
        });
    };

    const addItem = () => {
        setData('process', {
            ...data.process,
            items: [...(data.process.items || []), { num: '0' + ((data.process.items?.length || 0) + 1), title: '', desc: '' }]
        });
    };

    const removeItem = (index: number) => {
        const currentItems = data.process.items || [];
        setData('process', {
            ...data.process,
            items: currentItems.filter((_, i) => i !== index)
        });
    };

    const updateItem = (index: number, key: string, value: any) => {
        const currentItems = [...(data.process.items || [])];
        currentItems[index] = { ...currentItems[index], [key]: value };
        setData('process', {
            ...data.process,
            items: currentItems
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Process Section" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Process Section</h1>
                    <p className="text-muted-foreground mt-1">Manage content for the process section</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-6">
                        <FormField label="Heading" name="process.heading">
                            <Input value={data.process.heading} onChange={e => setData('process', { ...data.process, heading: e.target.value })} />
                        </FormField>
                        <FormField label="Subheading" name="process.subheading">
                            <Textarea value={data.process.subheading} onChange={e => setData('process', { ...data.process, subheading: e.target.value })} />
                        </FormField>

                        <div className="space-y-4">
                            {(data.process.items || []).map((item: any, index: number) => (
                                <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                    <div className="grid gap-3 flex-1">
                                        <div className="flex gap-2">
                                            <Input className="w-20" placeholder="Num" value={item.num} onChange={e => updateItem(index, 'num', e.target.value)} />
                                            <Input className="flex-1" placeholder="Step Title" value={item.title} onChange={e => updateItem(index, 'title', e.target.value)} />
                                        </div>
                                        <Textarea placeholder="Description" value={item.desc} onChange={e => updateItem(index, 'desc', e.target.value)} />
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" /> Add Step
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
