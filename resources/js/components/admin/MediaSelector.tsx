import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Upload, X, Loader2, GripVertical, Image as ImageIcon, Search } from 'lucide-react';
import { useState, useEffect, useId } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export interface MediaItem {
    id: number;
    path: string;
    url: string;
    srcset?: string;
    responsive_urls?: Record<string | number, string>;
    alt_text?: string;
    caption?: string;
    order: number;
}

interface MediaSelectorProps {
    value?: MediaItem[];
    onChange: (value: MediaItem[]) => void;
    error?: string;
    label?: string;
    maxImages?: number;
    context?: 'product' | 'article' | 'gallery' | 'logo';
}

export function MediaSelector({
    value = [],
    onChange,
    error,
    label,
    maxImages = 10,
    context = 'product',
}: MediaSelectorProps) {
    const uniqueId = useId();
    const uploadInputId = `media-upload-input-${uniqueId}`;
    const [media, setMedia] = useState<MediaItem[]>(value || []);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [showMediaLibrary, setShowMediaLibrary] = useState<boolean>(false);
    const [libraryMedia, setLibraryMedia] = useState<MediaItem[]>([]);
    const [loadingLibrary, setLoadingLibrary] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Update media when value changes
    useEffect(() => {
        setMedia(value || []);
    }, [value]);

    const getCsrfToken = () => {
        const name = 'XSRF-TOKEN';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        }
        return '';
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('context', context);

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

            const data = await response.json();
            
            const newMediaItem: MediaItem = {
                id: data.media.id,
                path: data.media.path,
                url: data.media.url || '', // Backend should guarantee url, but fallback to empty string just in case
                alt_text: data.media.alt_text || '',
                caption: data.media.caption || '',
                order: media.length,
            };
            
            const newMedia = [...media, newMediaItem];
            setMedia(newMedia);
            onChange(newMedia);
            
            // Refresh library if it's open to show the newly uploaded image
            if (showMediaLibrary) {
                loadMediaLibrary();
            }
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
        if (!file) return;

        // Validate file type - only allow PNG, WEBP, JPG/JPEG for product context
        const allowedTypes = ['image/png', 'image/webp', 'image/jpeg', 'image/jpg'];
        const allowedExtensions = ['png', 'webp', 'jpg', 'jpeg'];
        
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        if (!allowedTypes.includes(file.type) || !fileExtension || !allowedExtensions.includes(fileExtension)) {
            setUploadError('Only PNG, WEBP, and JPG files are allowed');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            const maxSizeMessage = context === 'gallery' 
                ? 'Hero background images must be less than 5MB. Please compress your image and try again.'
                : 'Image size must be less than 5MB. Please compress your image and try again.';
            setUploadError(maxSizeMessage);
            return;
        }

        // Check max images
        if (media.length >= maxImages) {
            setUploadError(`Maximum ${maxImages} images allowed`);
            return;
        }

        // Upload file
        uploadFile(file);
        
        // Reset input
        e.target.value = '';
    };

    const handleRemove = (index: number) => {
        const newMedia = media.filter((_, i) => i !== index);
        // Reorder remaining items
        const reorderedMedia = newMedia.map((item, i) => ({
            ...item,
            order: i,
        }));
        setMedia(reorderedMedia);
        onChange(reorderedMedia);
    };



    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null) return;

        const newMedia = [...media];
        const draggedItem = newMedia[draggedIndex];
        
        newMedia.splice(draggedIndex, 1);
        newMedia.splice(index, 0, draggedItem);
        
        // Update order
        const reorderedMedia = newMedia.map((item, i) => ({
            ...item,
            order: i,
        }));
        
        setMedia(reorderedMedia);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        if (draggedIndex !== null) {
            onChange(media);
        }
        setDraggedIndex(null);
    };

    const loadMediaLibrary = async () => {
        setLoadingLibrary(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) {
                params.append('search', searchQuery);
            }
            // Show all media (both assigned and unassigned) so users can see all uploaded images
            // The frontend will filter out already-selected images
            
            const response = await fetch(`/dashboard/admin/media?${params.toString()}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                const data = await response.json();
                setLibraryMedia(data.data || []);
            } else {
                console.error('Failed to load media library:', response.status, response.statusText);
            }
        } catch (err) {
            console.error('Failed to load media library:', err);
        } finally {
            setLoadingLibrary(false);
        }
    };

    useEffect(() => {
        if (showMediaLibrary) {
            const timeoutId = setTimeout(() => {
                loadMediaLibrary();
            }, 300); // Debounce search by 300ms
            
            return () => clearTimeout(timeoutId);
        }
    }, [showMediaLibrary, searchQuery]);

    const handleSelectFromLibrary = (libraryItem: MediaItem) => {
        if (media.length >= maxImages) {
            setUploadError(`Maximum ${maxImages} images allowed`);
            return;
        }

        // Check if already selected
        if (media.some(m => m.id === libraryItem.id)) {
            setUploadError('This image is already selected');
            return;
        }

        const newMediaItem: MediaItem = {
            ...libraryItem,
            order: media.length,
        };

        const newMedia = [...media, newMediaItem];
        setMedia(newMedia);
        onChange(newMedia);
        setShowMediaLibrary(false);
        setSearchQuery('');
    };

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
            
            {/* Upload and Browse Buttons */}
            {media.length < maxImages && (
                <div className="mb-4 flex gap-2">
                    <Input
                        type="file"
                        accept={context === 'product' ? 'image/png,image/webp,image/jpeg,image/jpg' : 'image/*'}
                        onChange={handleFileChange}
                        className="hidden"
                        id={uploadInputId}
                        disabled={uploading}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById(uploadInputId)?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload New
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowMediaLibrary(true)}
                        disabled={uploading}
                    >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Browse Library
                    </Button>
                    {uploadError && (
                        <p className="text-sm text-destructive mt-2">{uploadError}</p>
                    )}
                </div>
            )}

            {/* Media Library Dialog */}
            <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Select from Media Library</DialogTitle>
                        <DialogDescription>
                            Choose existing images from your media library
                        </DialogDescription>
                    </DialogHeader>
                    
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search media..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Media Grid */}
                    {loadingLibrary ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : libraryMedia.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                            {libraryMedia.map((item) => {
                                const isSelected = media.some(m => m.id === item.id);
                                return (
                                    <div
                                        key={item.id}
                                        className={`relative border rounded-md overflow-hidden bg-muted/50 cursor-pointer transition-all ${
                                            isSelected
                                                ? 'ring-2 ring-primary'
                                                : 'hover:ring-2 hover:ring-primary/50'
                                        }`}
                                        onClick={() => !isSelected && handleSelectFromLibrary(item)}
                                    >
                                        <div className="aspect-square relative">
                                            <img
                                                src={item.url}
                                                srcSet={item.srcset}
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                alt={item.alt_text || `Media ${item.id}`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                                                        <X className="h-4 w-4" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {item.alt_text && (
                                            <p className="p-2 text-xs text-muted-foreground truncate">
                                                {item.alt_text}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No media found</p>
                            {searchQuery && (
                                <p className="text-sm mt-2">Try a different search term</p>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Media Grid */}
            {media.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {media.map((item, index) => (
                        <div
                            key={`media-${item.id}-${index}`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className="relative border rounded-md overflow-hidden bg-muted/50 group cursor-move transition-all border-border"
                        >
                            <div className="aspect-square relative">
                                <img
                                    src={item.url}
                                    srcSet={item.srcset}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    alt={item.alt_text || `Media ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                
                                {/* Drag Handle */}
                                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <GripVertical className="h-4 w-4 text-white drop-shadow-lg" />
                                </div>

                                {/* Actions Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 z-10">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(index);
                                            }}
                                            className="h-8 w-8 p-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && <InputError message={error} />}
        </div>
    );
}

