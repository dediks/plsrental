import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Upload, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GalleryImagesUploadProps {
    value?: string[];
    onChange: (value: string[]) => void;
    error?: string;
    label?: string;
    maxImages?: number;
}

export function GalleryImagesUpload({
    value = [],
    onChange,
    error,
    label,
    maxImages = 5,
}: GalleryImagesUploadProps) {
    const [images, setImages] = useState<string[]>(value || []);
    const [uploading, setUploading] = useState<Record<number, boolean>>({});
    const [uploadErrors, setUploadErrors] = useState<Record<number, string>>({});

    // Update images when value changes
    useEffect(() => {
        setImages(value || []);
    }, [value]);

    const uploadFile = async (file: File, index: number) => {
        setUploading(prev => ({ ...prev, [index]: true }));
        setUploadErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[index];
            return newErrors;
        });

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', 'gallery');

            // Get CSRF token from cookie
            const getCsrfToken = () => {
                const name = 'XSRF-TOKEN';
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) {
                    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
                }
                return '';
            };

            const response = await fetch('/dashboard/admin/products/upload-image', {
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

            const data = await response.json();
            
            // Update the image at the specific index
            const newImages = [...images];
            if (index < newImages.length) {
                newImages[index] = data.path;
            } else {
                newImages.push(data.path);
            }
            
            setImages(newImages);
            onChange(newImages);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
            setUploadErrors(prev => ({ ...prev, [index]: errorMessage }));
            console.error('Upload error:', err);
        } finally {
            setUploading(prev => {
                const newState = { ...prev };
                delete newState[index];
                return newState;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadErrors(prev => ({ ...prev, [index]: 'Please select a valid image file' }));
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadErrors(prev => ({ ...prev, [index]: 'Image size must be less than 5MB' }));
            return;
        }

        // Upload file
        uploadFile(file, index);
        
        // Reset input
        e.target.value = '';
    };

    const handleRemove = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        onChange(newImages);
        setUploadErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[index];
            return newErrors;
        });
    };

    const getPreviewUrl = (imagePath: string): string => {
        if (imagePath.startsWith('products/')) {
            return `/storage/${imagePath}`;
        } else if (imagePath.startsWith('/storage/')) {
            return imagePath;
        } else if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
            return imagePath;
        } else {
            return `/storage/${imagePath}`;
        }
    };

    const renderImageSlot = (index: number, imagePath?: string) => {
        const uniqueId = `gallery-upload-${index}-${Math.random().toString(36).substr(2, 9)}`;
        const isUploading = uploading[index] || false;
        const uploadError = uploadErrors[index];

        return (
            <div key={index} className="relative border rounded-md overflow-hidden bg-muted/50">
                {imagePath ? (
                    <>
                        <div className="aspect-square relative">
                            <img
                                src={getPreviewUrl(imagePath)}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                        <div className="absolute top-2 right-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemove(index)}
                                disabled={isUploading}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="aspect-square flex flex-col items-center justify-center p-4">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, index)}
                            className="hidden"
                            id={uniqueId}
                            disabled={isUploading}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isUploading}
                            onClick={() => document.getElementById(uniqueId)?.click()}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload
                                </>
                            )}
                        </Button>
                        {uploadError && (
                            <p className="text-xs text-destructive mt-2 text-center">{uploadError}</p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Create slots for up to maxImages
    const slots = Array.from({ length: maxImages }, (_, i) => i);

    return (
        <div className="space-y-2">
            {label && (
                <Label>
                    {label}
                    <span className="text-muted-foreground ml-2 text-sm font-normal">
                        (Max {maxImages} images)
                    </span>
                </Label>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {slots.map((index) => {
                    const imagePath = images[index];
                    return renderImageSlot(index, imagePath);
                })}
            </div>
            {error && <InputError message={error} />}
        </div>
    );
}

