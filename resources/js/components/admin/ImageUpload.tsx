import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Upload, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ImageUploadProps {
    value?: string;
    onChange: (value: string) => void;
    error?: string;
    label?: string;
    required?: boolean;
    type?: 'thumbnail' | 'gallery';
}

export function ImageUpload({
    value,
    onChange,
    error,
    label,
    required,
    type = 'thumbnail',
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Update preview when value changes
    useEffect(() => {
        if (value) {
            // If it's a path, prepend /storage/ for preview
            if (value.startsWith('products/')) {
                setPreview(`/storage/${value}`);
            } else if (value.startsWith('/storage/')) {
                setPreview(value);
            } else if (value.startsWith('http') || value.startsWith('data:')) {
                setPreview(value);
            } else {
                setPreview(`/storage/${value}`);
            }
        } else {
            setPreview(null);
        }
    }, [value]);

    const uploadFile = async (file: File) => {
        setUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', type);

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
            
            // Save the path (not the full URL) to match backend expectations
            onChange(data.path);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
            setUploadError(errorMessage);
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setUploadError('Please select a valid image file');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('Image size must be less than 5MB');
                return;
            }

            // Show immediate preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload file
            uploadFile(file);
        }
        
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const handleRemove = () => {
        onChange('');
        setPreview(null);
        setUploadError(null);
    };

    const uniqueId = `image-upload-${type}-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="space-y-2">
            {label && (
                <Label>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id={uniqueId}
                        disabled={uploading}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploading}
                        onClick={() => document.getElementById(uniqueId)?.click()}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Image
                            </>
                        )}
                    </Button>
                    {preview && !uploading && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemove}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Remove
                        </Button>
                    )}
                </div>
                {uploadError && (
                    <p className="text-sm text-destructive">{uploadError}</p>
                )}
                {preview && (
                    <div className="relative w-full h-48 border rounded-md overflow-hidden">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <InputError message={error} />
        </div>
    );
}

