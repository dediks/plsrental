import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import { StatsConfig } from '@/types/home';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage Management', href: '#' },
    { title: 'Stats Section', href: '#' },
];

interface StatsProps {
    stats: StatsConfig;
}

export default function Stats({ stats }: StatsProps) {
    const { data, setData, put, processing, errors } = useForm<{ stats: StatsConfig }>({
        stats: stats || {},
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/home/stats', {
            onSuccess: () => toastSuccess('Stats section updated successfully!'),
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update stats section';
                toastError(errorMessage);
            },
        });
    };

    const addItem = () => {
        setData('stats', {
            ...data.stats,
            items: [...(data.stats.items || []), { label: '', value: '' }]
        });
    };

    const removeItem = (index: number) => {
        const currentItems = data.stats.items || [];
        setData('stats', {
            ...data.stats,
            items: currentItems.filter((_, i) => i !== index)
        });
    };

    const updateItem = (index: number, key: string, value: any) => {
        const currentItems = [...(data.stats.items || [])];
        currentItems[index] = { ...currentItems[index], [key]: value };
        setData('stats', {
            ...data.stats,
            items: currentItems
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Stats Section" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Stats Section</h1>
                    <p className="text-muted-foreground mt-1">Manage content for the stats section</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <Switch checked={data.stats.showStats} onCheckedChange={c => setData('stats', { ...data.stats, showStats: c })} />
                            <span>Show Stats Section</span>
                        </div>
                        
                        <div className="space-y-4">
                            {(data.stats.items || []).map((item: any, index: number) => (
                                <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                    <div className="grid gap-2 flex-1">
                                        <Input placeholder="Label (e.g. Years Experience)" value={item.label} onChange={e => updateItem(index, 'label', e.target.value)} />
                                        <Input placeholder="Value (e.g. 10+)" value={item.value} onChange={e => updateItem(index, 'value', e.target.value)} />
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" /> Add Stat
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
