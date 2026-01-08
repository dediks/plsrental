import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/admin/FormField';
import { toastSuccess, toastError } from '@/lib/toast';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Social Media', href: '/dashboard/admin/social-media' },
    { title: 'Edit', href: '#' },
];

interface EditProps {
    socialMedia: {
        id: number;
        name: string;
        platform: string;
        url: string;
        order: number;
        is_active: boolean;
    };
    platforms: string[];
}

export default function Edit({ socialMedia, platforms }: EditProps) {
    // Extract phone number from WhatsApp URL if it exists
    const extractPhoneFromUrl = (url: string): string => {
        if (!url || !url.includes('wa.me/')) {
            return '';
        }
        const match = url.match(/wa\.me\/(\d+)/);
        return match ? match[1] : '';
    };

    // Calculate initial phone number
    const initialPhoneNumber =
        socialMedia?.platform?.toLowerCase() === 'whatsapp'
            ? extractPhoneFromUrl(socialMedia?.url || '')
            : '';

    const initialData = {
        name: socialMedia?.name || '',
        platform: socialMedia?.platform || '',
        url: socialMedia?.url || '',
        phoneNumber: initialPhoneNumber,
        order: socialMedia?.order ?? 0,
        is_active: socialMedia?.is_active ?? true,
    };

    const { data, setData, put, processing, errors } = useForm(initialData);

    const isWhatsApp = data.platform?.toLowerCase() === 'whatsapp';

    // Format phone number to WhatsApp URL
    const formatWhatsAppUrl = (phone: string): string => {
        // Remove all non-digit characters
        const digits = phone.replace(/\D/g, '');
        if (!digits) return '';
        return `https://wa.me/${digits}`;
    };

    const handlePhoneNumberChange = (phone: string) => {
        setData('phoneNumber', phone);
        if (phone) {
            setData('url', formatWhatsAppUrl(phone));
        }
    };

    const handleUrlChange = (url: string) => {
        setData('url', url);
        // If it's a WhatsApp URL, try to extract phone number
        if (isWhatsApp && url.includes('wa.me/')) {
            const match = url.match(/wa\.me\/(\d+)/);
            if (match) {
                setData('phoneNumber', match[1]);
            }
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/admin/social-media/${socialMedia.id}`, {
            onSuccess: () => {
                toastSuccess('Social media link updated successfully!');
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update social media link';
                toastError(errorMessage);
            },
        });
    };

    // Safety check - if socialMedia is not loaded, show loading state
    if (!socialMedia || !socialMedia.id) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Edit Social Media" />
                <div className="p-6 space-y-6">
                    <div>Loading...</div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Social Media: ${socialMedia.name}`} />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Social Media Link</h1>
                    <p className="text-muted-foreground mt-1">
                        Update social media link details
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6 max-w-4xl">
                    <FormField
                        label="Name"
                        name="name"
                        error={errors.name}
                        required
                    >
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g., YouTube"
                        />
                    </FormField>

                    <FormField
                        label="Platform"
                        name="platform"
                        error={errors.platform}
                        required
                    >
                        <Select
                            value={data.platform}
                            onValueChange={(value) => setData('platform', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a platform" />
                            </SelectTrigger>
                            <SelectContent>
                                {platforms.map((platform: string) => (
                                    <SelectItem key={platform} value={platform}>
                                        {platform.charAt(0).toUpperCase() +
                                            platform.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>

                    {isWhatsApp ? (
                        <FormField
                            label="Phone Number"
                            name="phoneNumber"
                            error={errors.phoneNumber || errors.url}
                            required
                            description="Enter phone number with country code (e.g., 1234567890). Will be formatted as WhatsApp URL automatically."
                        >
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={data.phoneNumber}
                                onChange={(e) =>
                                    handlePhoneNumberChange(e.target.value)
                                }
                                placeholder="1234567890"
                            />
                        </FormField>
                    ) : (
                        <FormField
                            label="URL"
                            name="url"
                            error={errors.url}
                            required
                            description="Full URL to the social media profile"
                        >
                            <Input
                                id="url"
                                type="url"
                                value={data.url}
                                onChange={(e) => handleUrlChange(e.target.value)}
                                placeholder="https://..."
                            />
                        </FormField>
                    )}

                    {isWhatsApp && data.url && (
                        <div className="text-sm text-muted-foreground">
                            WhatsApp URL: {data.url}
                        </div>
                    )}

                    <FormField
                        label="Order"
                        name="order"
                        error={errors.order}
                        description="Display order (lower numbers appear first)"
                    >
                        <Input
                            id="order"
                            type="number"
                            min="0"
                            value={data.order}
                            onChange={(e) =>
                                setData('order', parseInt(e.target.value) || 0)
                            }
                        />
                    </FormField>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked)
                            }
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            Update Social Media Link
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

