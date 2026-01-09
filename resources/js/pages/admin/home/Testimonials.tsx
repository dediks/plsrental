import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/admin/FormField';
import { Plus, Trash2 } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import { TestimonialsConfig } from '@/types/home';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage Management', href: '#' },
    { title: 'Testimonials Section', href: '#' },
];

interface TestimonialsProps {
    testimonials: TestimonialsConfig;
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
    const { data, setData, put, processing, errors } = useForm<{ testimonials: TestimonialsConfig }>({
        testimonials: testimonials || {},
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/home/testimonials', {
            onSuccess: () => toastSuccess('Testimonials section updated successfully!'),
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update testimonials section';
                toastError(errorMessage);
            },
        });
    };

    const addItem = () => {
        setData('testimonials', {
            ...data.testimonials,
            items: [...(data.testimonials.items || []), { text: '', author: '', role: '', company: '' }]
        });
    };

    const removeItem = (index: number) => {
        const currentItems = data.testimonials.items || [];
        setData('testimonials', {
            ...data.testimonials,
            items: currentItems.filter((_, i) => i !== index)
        });
    };

    const updateItem = (index: number, key: string, value: any) => {
        const currentItems = [...(data.testimonials.items || [])];
        currentItems[index] = { ...currentItems[index], [key]: value };
        setData('testimonials', {
            ...data.testimonials,
            items: currentItems
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Testimonials Section" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Testimonials Section</h1>
                    <p className="text-muted-foreground mt-1">Manage content for the testimonials section</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-6">
                        <FormField label="Heading" name="testimonials.heading">
                            <Input value={data.testimonials.heading} onChange={e => setData('testimonials', { ...data.testimonials, heading: e.target.value })} />
                        </FormField>

                        <div className="space-y-4">
                            {(data.testimonials.items || []).map((item: any, index: number) => (
                                <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                    <div className="grid gap-3 flex-1">
                                        <Textarea placeholder="Review Text" value={item.text} onChange={e => updateItem(index, 'text', e.target.value)} />
                                        <Input placeholder="Author Name" value={item.author} onChange={e => updateItem(index, 'author', e.target.value)} />
                                        <div className="flex gap-2">
                                            <Input placeholder="Role" value={item.role} onChange={e => updateItem(index, 'role', e.target.value)} />
                                            <Input placeholder="Company" value={item.company} onChange={e => updateItem(index, 'company', e.target.value)} />
                                        </div>
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" /> Add Testimonial
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
