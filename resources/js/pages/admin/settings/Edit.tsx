import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { FormField } from '@/components/admin/FormField';
import { Upload, X, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toastSuccess, toastError } from '@/lib/toast';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Site Settings', href: '#' },
];

interface LogoMedia {
    id: number;
    url: string;
}

interface EditProps {
    logoLight: LogoMedia | string | null;
    logoDark: LogoMedia | string | null;
    maintenanceMode: boolean;
}

interface LogoUploadState {
    preview: string | null;
    uploading: boolean;
    error: string | null;
}

export default function Edit({ logoLight, logoDark, maintenanceMode }: EditProps) {
    // Extract media ID from logo prop (handle both object and legacy string formats)
    const getLogoId = (logo: LogoMedia | string | null): number | null => {
        if (!logo) return null;
        if (typeof logo === 'object' && 'id' in logo) {
            return logo.id;
        }
        return null; // Legacy string paths are not supported for IDs
    };

    // Extract URL from logo prop (handle both object and legacy string formats)
    const getLogoUrl = (logo: LogoMedia | string | null): string | null => {
        if (!logo) return null;
        if (typeof logo === 'object' && 'url' in logo && logo.url) {
            // Ensure we have a valid URL
            return logo.url;
        }
        if (typeof logo === 'string') {
            // Legacy format: handle string paths
            if (logo.startsWith('/') || logo.startsWith('http')) {
                return logo;
            }
            // Don't construct URLs from IDs - this was causing the issue
            return null;
        }
        return null;
    };

    const { data, setData, put, processing, errors } = useForm({
        logoLight: getLogoId(logoLight) || null,
        logoDark: getLogoId(logoDark) || null,
        maintenanceMode: maintenanceMode || false,
    });

    const [lightLogoState, setLightLogoState] = useState<LogoUploadState>({
        preview: getLogoUrl(logoLight),
        uploading: false,
        error: null,
    });

    const [darkLogoState, setDarkLogoState] = useState<LogoUploadState>({
        preview: getLogoUrl(logoDark),
        uploading: false,
        error: null,
    });

    // Update previews when props change (e.g., after page reload)
    useEffect(() => {
        const lightUrl = getLogoUrl(logoLight);
        const darkUrl = getLogoUrl(logoDark);
        
        // Only update if we have a valid URL
        if (lightUrl && (lightUrl.startsWith('/') || lightUrl.startsWith('http'))) {
            setLightLogoState(prev => ({ ...prev, preview: lightUrl }));
        } else if (lightUrl) {
            // Log warning if URL is invalid
            console.warn('Invalid logo URL for light logo:', logoLight, 'extracted URL:', lightUrl);
        }
        
        if (darkUrl && (darkUrl.startsWith('/') || darkUrl.startsWith('http'))) {
            setDarkLogoState(prev => ({ ...prev, preview: darkUrl }));
        } else if (darkUrl) {
            // Log warning if URL is invalid
            console.warn('Invalid logo URL for dark logo:', logoDark, 'extracted URL:', darkUrl);
        }
    }, [logoLight, logoDark]);

    const getCsrfToken = useCallback(() => {
        const name = 'XSRF-TOKEN';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        }
        return '';
    }, []);

    const uploadLogo = useCallback(async (file: File, type: 'light' | 'dark') => {
        const setState = type === 'light' ? setLightLogoState : setDarkLogoState;
        const setDataValue = type === 'light' 
            ? (value: number | null) => setData('logoLight', value)
            : (value: number | null) => setData('logoDark', value);

        setState(prev => ({ ...prev, uploading: true, error: null }));

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('context', 'logo');

            const response = await fetch('/dashboard/admin/media/upload', {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': getCsrfToken(),
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
                throw new Error(errorData.message || 'Upload failed');
            }

            const responseData = await response.json();
            // Extract media ID and URL from response
            const mediaId = responseData.media.id;
            const previewUrl = responseData.media.url || responseData.media.path;
            
            if (!mediaId) {
                throw new Error('Media ID not found in upload response');
            }

            // Store media ID in form data
            setDataValue(mediaId);
            // Update preview with URL
            setState(prev => ({ ...prev, preview: previewUrl }));
            toastSuccess('Logo uploaded successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload logo';
            setState(prev => ({ ...prev, error: errorMessage }));
            toastError(errorMessage);
        } finally {
            setState(prev => ({ ...prev, uploading: false }));
        }
    }, [getCsrfToken, setData]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'light' | 'dark') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const setState = type === 'light' ? setLightLogoState : setDarkLogoState;

        // Validate file type - allow image/* and SVG files
        const isValidImageType = file.type.startsWith('image/') || 
                                 file.type === 'image/svg+xml' ||
                                 file.name.toLowerCase().endsWith('.svg');
        
        if (!isValidImageType) {
            setState(prev => ({ ...prev, error: 'Please select a valid image file (JPG, PNG, GIF, WebP, or SVG)' }));
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setState(prev => ({ ...prev, error: 'Image size must be less than 5MB' }));
            return;
        }

        // Show immediate preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setState(prev => ({ ...prev, preview: reader.result as string }));
        };
        reader.readAsDataURL(file);

        // Upload file
        uploadLogo(file, type);
        
        // Reset input
        e.target.value = '';
    }, [uploadLogo]);

    const handleRemove = useCallback((type: 'light' | 'dark') => {
        if (type === 'light') {
            setData('logoLight', null);
            setLightLogoState({ preview: null, uploading: false, error: null });
        } else {
            setData('logoDark', null);
            setDarkLogoState({ preview: null, uploading: false, error: null });
        }
    }, [setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/settings', {
            preserveScroll: true,
            onSuccess: () => {
                toastSuccess('Settings updated successfully');
            },
            onError: () => {
                toastError('Failed to update settings');
            },
        });
    };

    const LogoUploadField = ({ 
        type, 
        label, 
        description,
        state,
        onFileChange,
        onRemove,
    }: {
        type: 'light' | 'dark';
        label: string;
        description?: string;
        state: LogoUploadState;
        onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onRemove: () => void;
    }) => {
        const inputId = `logo-${type}-upload`;
        // Light logo is for dark backgrounds, so preview should be dark
        // Dark logo is for light backgrounds, so preview should be light
        const previewBg = type === 'light' ? 'bg-slate-900 dark:bg-slate-950' : 'bg-muted';

        return (
            <FormField
                label={label}
                name={inputId}
                error={state.error || errors[type === 'light' ? 'logoLight' : 'logoDark']}
                description={description}
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onFileChange}
                            className="hidden"
                            id={inputId}
                            disabled={state.uploading}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={state.uploading}
                            onClick={() => document.getElementById(inputId)?.click()}
                        >
                            {state.uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Logo
                                </>
                            )}
                        </Button>
                        {state.preview && !state.uploading && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onRemove}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Remove
                            </Button>
                        )}
                    </div>
                    {state.preview && (
                        <div className={`relative w-full max-w-xs h-32 border rounded-md overflow-hidden ${previewBg} p-4 flex items-center justify-center`}>
                            <img
                                src={state.preview}
                                alt={`${type} logo preview`}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                    console.error('Failed to load logo image:', state.preview, e);
                                    setState(prev => ({ ...prev, error: 'Failed to load image' }));
                                }}
                                onLoad={() => {
                                    setState(prev => ({ ...prev, error: null }));
                                }}
                            />
                            {state.uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </FormField>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Site Settings" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Site Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your site configuration and branding
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Logo Settings</CardTitle>
                            <CardDescription>
                                Upload logos for light and dark themes. The light logo is used on dark backgrounds, and the dark logo is used on light backgrounds.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <LogoUploadField
                                type="light"
                                label="Light Logo (for dark backgrounds)"
                                description="This logo will be displayed on dark backgrounds and in dark mode"
                                state={lightLogoState}
                                onFileChange={(e) => handleFileChange(e, 'light')}
                                onRemove={() => handleRemove('light')}
                            />

                            <LogoUploadField
                                type="dark"
                                label="Dark Logo (for light backgrounds)"
                                description="This logo will be displayed on light backgrounds and in light mode"
                                state={darkLogoState}
                                onFileChange={(e) => handleFileChange(e, 'dark')}
                                onRemove={() => handleRemove('dark')}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Mode</CardTitle>
                            <CardDescription>
                                When enabled, non-admin users will see a maintenance page. Authenticated admins can still access the site normally.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                label="Enable Maintenance Mode"
                                name="maintenanceMode"
                                error={errors.maintenanceMode}
                                description="Toggle maintenance mode on or off. This will affect all non-admin visitors to your site."
                            >
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="maintenance-mode"
                                        checked={data.maintenanceMode}
                                        onCheckedChange={(checked) => setData('maintenanceMode', checked)}
                                    />
                                    <label
                                        htmlFor="maintenance-mode"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {data.maintenanceMode ? 'Enabled' : 'Disabled'}
                                    </label>
                                </div>
                            </FormField>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Settings'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
