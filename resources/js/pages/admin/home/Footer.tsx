import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/admin/FormField';
import { toastSuccess, toastError } from '@/lib/toast';
import { FooterConfig } from '@/types/home';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Homepage Management', href: '#' },
    { title: 'Footer Section', href: '#' },
];

interface FooterProps {
    footer: FooterConfig;
}

export default function Footer({ footer }: FooterProps) {
    const { data, setData, put, processing, errors } = useForm<{ footer: FooterConfig }>({
        footer: footer || {},
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/home/footer', {
            onSuccess: () => toastSuccess('Footer section updated successfully!'),
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update footer section';
                toastError(errorMessage);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Footer Section" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Footer Section</h1>
                    <p className="text-muted-foreground mt-1">Manage content for the footer section</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Brand Name" name="footer.brandName">
                                <Input value={data.footer.brandName || ''} onChange={e => setData('footer', { ...data.footer, brandName: e.target.value })} placeholder="PLS" />
                            </FormField>
                            <FormField label="Brand Subtitle" name="footer.brandSubtitle">
                                <Input value={data.footer.brandSubtitle || ''} onChange={e => setData('footer', { ...data.footer, brandSubtitle: e.target.value })} placeholder="Rental Division" />
                            </FormField>
                        </div>
                        
                        <FormField label="Description" name="footer.description">
                            <Textarea 
                                value={data.footer.description || ''} 
                                onChange={e => setData('footer', { ...data.footer, description: e.target.value })} 
                                placeholder="Mitra terpercaya penyewaan sound system..."
                                rows={3}
                            />
                        </FormField>

                        <h3 className="font-semibold pt-2">Contact Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Phone" name="footer.contactPhone">
                                <Input value={data.footer.contactPhone || ''} onChange={e => setData('footer', { ...data.footer, contactPhone: e.target.value })} placeholder="0822-5728-9604" />
                            </FormField>
                            <FormField label="Email" name="footer.contactEmail">
                                <Input value={data.footer.contactEmail || ''} onChange={e => setData('footer', { ...data.footer, contactEmail: e.target.value })} placeholder="plsrental@yahoo.com" />
                            </FormField>
                        </div>
                        <FormField label="Address" name="footer.contactAddress">
                            <Textarea 
                                value={data.footer.contactAddress || ''} 
                                onChange={e => setData('footer', { ...data.footer, contactAddress: e.target.value })} 
                                placeholder="JL.Raya Kandangan . Kare . MADIUN - Jawa Timur."
                                rows={2}
                            />
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
