import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/admin/FormField';
import { toastSuccess, toastError } from '@/lib/toast';
import { FinalCTAConfig } from '@/types/home';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage Management', href: '#' },
    { title: 'Final CTA Section', href: '#' },
];

interface FinalCTAProps {
    finalCTA: FinalCTAConfig;
}

export default function FinalCTA({ finalCTA }: FinalCTAProps) {
    const { data, setData, put, processing, errors } = useForm<{ finalCTA: FinalCTAConfig }>({
        finalCTA: finalCTA || {},
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/home/final-cta', {
            onSuccess: () => toastSuccess('Final CTA section updated successfully!'),
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update final CTA section';
                toastError(errorMessage);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Final CTA Section" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Final CTA Section</h1>
                    <p className="text-muted-foreground mt-1">Manage content for the final call-to-action section</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-6">
                        <FormField label="Heading" name="finalCTA.heading">
                            <Input value={data.finalCTA.heading} onChange={e => setData('finalCTA', { ...data.finalCTA, heading: e.target.value })} />
                        </FormField>
                        <FormField label="Subheading" name="finalCTA.subheading">
                            <Textarea value={data.finalCTA.subheading} onChange={e => setData('finalCTA', { ...data.finalCTA, subheading: e.target.value })} />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Button Text" name="finalCTA.buttonText">
                                <Input value={data.finalCTA.buttonText} onChange={e => setData('finalCTA', { ...data.finalCTA, buttonText: e.target.value })} />
                            </FormField>
                            <FormField label="Button Link" name="finalCTA.buttonLink">
                                <Input value={data.finalCTA.buttonLink} onChange={e => setData('finalCTA', { ...data.finalCTA, buttonLink: e.target.value })} />
                            </FormField>
                        </div>
                        <FormField label="Phone Number" name="finalCTA.phoneNumber">
                            <Input value={data.finalCTA.phoneNumber} onChange={e => setData('finalCTA', { ...data.finalCTA, phoneNumber: e.target.value })} />
                        </FormField>
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
