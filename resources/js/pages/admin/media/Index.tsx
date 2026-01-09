import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { toastSuccess, toastError } from '@/lib/toast';
import { useState, useEffect } from 'react';
import { Upload, Search, Trash2, Edit, Image as ImageIcon, Filter, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MediaFilters } from '@/components/admin/MediaFilters';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Media', href: '/dashboard/admin/media' },
];

interface MediaItem {
    id: number;
    filename: string;
    path: string;
    url: string;
    srcset?: string;
    responsive_urls?: Record<string | number, string>;
    alt_text?: string;
    caption?: string;
    mime_type?: string;
    size?: number;
    order: number;
    is_featured: boolean;
    galleryable_type?: string;
    galleryable_id?: number;
    galleryable?: {
        id: number;
        name?: string;
    };
    created_at: string;
}

export default function Index({ media, filters, unusedMediaCount = 0 }: { media: any; filters: any; unusedMediaCount?: number }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
    const [mediaToEdit, setMediaToEdit] = useState<MediaItem | null>(null);
    const [editForm, setEditForm] = useState({
        alt_text: '',
        caption: '',
    });
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [typeFilter, setTypeFilter] = useState(filters?.type || undefined);
    const [unassignedFilter, setUnassignedFilter] = useState(filters?.unassigned || false);
    const [uploading, setUploading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleDeleteClick = (item: MediaItem) => {
        setMediaToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!mediaToDelete) return;

        fetch(`/dashboard/admin/media/${mediaToDelete.id}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': getCsrfToken(),
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    toastSuccess('Media deleted successfully!');
                    setDeleteDialogOpen(false);
                    setMediaToDelete(null);
                    router.reload();
                } else {
                    toastError(data.message || 'Failed to delete media.');
                }
            })
            .catch(() => {
                toastError('Failed to delete media. Please try again.');
            });
    };

    const handleItemSelect = (itemId: number) => {
        setSelectedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = media.data.map((item: MediaItem) => item.id);
            setSelectedItems(new Set(allIds));
        } else {
            setSelectedItems(new Set());
        }
    };

    const handleBatchDelete = () => {
        if (selectedItems.size === 0) return;

        const ids = Array.from(selectedItems);

        fetch('/dashboard/admin/media/batch-delete', {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': getCsrfToken(),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ ids }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    toastSuccess(data.message || `${selectedItems.size} media items deleted successfully!`);
                    setBatchDeleteDialogOpen(false);
                    setSelectedItems(new Set());
                    router.reload();
                } else {
                    toastError(data.message || 'Failed to delete media items.');
                    if (data.errors && data.errors.length > 0) {
                        data.errors.forEach((error: string) => {
                            toastError(error);
                        });
                    }
                }
            })
            .catch(() => {
                toastError('Failed to delete media items. Please try again.');
            });
    };

    const allSelected = media.data && media.data.length > 0 && selectedItems.size === media.data.length;
    const someSelected = selectedItems.size > 0 && selectedItems.size < (media.data?.length || 0);

    const handleEditClick = (item: MediaItem) => {
        setMediaToEdit(item);
        setEditForm({
            alt_text: item.alt_text || '',
            caption: item.caption || '',
        });
        setEditDialogOpen(true);
    };

    const handleEditSave = () => {
        if (!mediaToEdit) return;

        fetch(`/dashboard/admin/media/${mediaToEdit.id}`, {
            method: 'PUT',
            headers: {
                'X-XSRF-TOKEN': getCsrfToken(),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(editForm),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    toastSuccess('Media updated successfully!');
                    setEditDialogOpen(false);
                    setMediaToEdit(null);
                    router.reload();
                } else {
                    toastError(data.message || 'Failed to update media.');
                }
            })
            .catch(() => {
                toastError('Failed to update media. Please try again.');
            });
    };

    // Add keyboard shortcuts for edit dialog: Enter to save, Escape to cancel
    useEffect(() => {
        if (!editDialogOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleEditSave();
            } else if (event.key === 'Escape') {
                event.preventDefault();
                setEditDialogOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [editDialogOpen, handleEditSave]);

    const handleSearch = (searchValue?: string, typeValue?: string | undefined, unassignedValue?: boolean) => {
        const params = new URLSearchParams();
        const finalSearch = searchValue !== undefined ? searchValue : searchQuery;
        const finalType = typeValue !== undefined ? typeValue : typeFilter;
        const finalUnassigned = unassignedValue !== undefined ? unassignedValue : unassignedFilter;
        
        if (finalSearch) params.append('search', finalSearch);
        if (finalType) params.append('type', finalType);
        if (finalUnassigned) params.append('unassigned', '1');

        // Clear selection when filters change
        setSelectedItems(new Set());
        router.get(`/dashboard/admin/media?${params.toString()}`);
        if (filterSheetOpen) setFilterSheetOpen(false);
    };

    const handleTypeChange = (value: string) => {
        setTypeFilter(value || undefined);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setTypeFilter(undefined);
        setUnassignedFilter(false);
        router.get('/dashboard/admin/media');
        if (filterSheetOpen) setFilterSheetOpen(false);
    };

    const handleUnassignedToggle = (checked: boolean) => {
        setUnassignedFilter(checked);
        // Trigger search immediately when toggled
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (typeFilter) params.append('type', typeFilter);
        if (checked) params.append('unassigned', '1');
        router.get(`/dashboard/admin/media?${params.toString()}`);
        if (filterSheetOpen) setFilterSheetOpen(false);
    };

    const getCsrfToken = () => {
        const name = 'XSRF-TOKEN';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        }
        return '';
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toastError('Please select a valid image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toastError('Image size must be less than 5MB');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/dashboard/admin/media/upload', {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': getCsrfToken(),
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                toastSuccess('Media uploaded successfully!');
                router.reload();
            } else {
                toastError(data.message || 'Failed to upload media.');
            }
        } catch (error) {
            toastError('Failed to upload media. Please try again.');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const getGalleryableTypeLabel = (type?: string) => {
        if (!type) return 'Unassigned';
        const parts = type.split('\\');
        return parts[parts.length - 1];
    };

    const isLogo = (path?: string) => {
        if (!path) return false;
        return path.startsWith('logos/') || path.startsWith('/storage/logos/');
    };

    const isUnused = (item: MediaItem) => {
        // Logos are not considered unused as they're used in settings
        if (isLogo(item.path)) return false;
        // Items with galleryable are in use
        if (item.galleryable) return false;
        // Items without galleryable are unused
        return true;
    };

    const activeFilterCount = [
        searchQuery,
        typeFilter,
        unassignedFilter,
    ].filter(Boolean).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Media Library" />
            <div className="min-h-screen bg-background">
                {/* Header - Sticky on mobile */}
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                    <div className="px-4 sm:px-6 py-4 sm:py-6">
                        {/* Title and Upload Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl sm:text-3xl font-bold">Media Library</h1>
                                    {unusedMediaCount > 0 && (
                                        <button
                                            onClick={() => {
                                                setUnassignedFilter(true);
                                                handleSearch(searchQuery, typeFilter, true);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Badge variant="secondary" className="text-xs sm:text-sm hover:bg-secondary/80 transition-colors">
                                                {unusedMediaCount} {unusedMediaCount === 1 ? 'unused' : 'unused'} {unusedMediaCount === 1 ? 'item' : 'items'}
                                            </Badge>
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                                    Manage all your media files
                                </p>
                            </div>
                            <div className="flex gap-4 justify-between">
                                {/* Mobile Filter Button */}
                                {isMobile && (
                                    <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                                        <SheetTrigger asChild>
                                            <Button variant="outline" size="lg" className="relative">
                                                <Filter className="h-4 w-4 sm:mr-2" />
                                                {activeFilterCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                                        {activeFilterCount}
                                                    </span>
                                                )}
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="bottom" className="h-[75vh]">
                                            <SheetHeader>
                                                <SheetTitle>Filters</SheetTitle>
                                                <SheetDescription>
                                                    Filter your media library
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div className="mt-6">
                                                <MediaFilters
                                                    searchQuery={searchQuery}
                                                    onSearchChange={setSearchQuery}
                                                    typeFilter={typeFilter}
                                                    onTypeChange={handleTypeChange}
                                                    unassignedFilter={unassignedFilter}
                                                    onUnassignedChange={handleUnassignedToggle}
                                                    onSearch={handleSearch}
                                                    onClear={handleClearFilters}
                                                    activeFilterCount={activeFilterCount}
                                                    variant="vertical"
                                                    showApplyButton={true}
                                                    onClose={() => setFilterSheetOpen(false)}
                                                />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                )}
                                <div className="flex gap-2">
                                    {selectedItems.size > 0 && (
                                        <Button
                                            variant="destructive"
                                            size="lg"
                                            onClick={() => setBatchDeleteDialogOpen(true)}
                                            className="w-auto"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'}
                                        </Button>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        disabled={uploading}
                                        id="media-upload-input"
                                    />
                                    <Button
                                        onClick={() => document.getElementById('media-upload-input')?.click()}
                                        disabled={uploading}
                                        size="lg"
                                        className="w-auto"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {uploading ? 'Uploading...' : isMobile ? 'Upload' : 'Upload Media'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Filters */}
                        {!isMobile && (
                            <MediaFilters
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                typeFilter={typeFilter}
                                onTypeChange={handleTypeChange}
                                unassignedFilter={unassignedFilter}
                                onUnassignedChange={handleUnassignedToggle}
                                onSearch={handleSearch}
                                onClear={handleClearFilters}
                                activeFilterCount={activeFilterCount}
                                variant="inline"
                                showApplyButton={true}
                            />
                        )}

                        {/* Mobile Search Bar */}
                        {isMobile && (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search media..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 sm:px-6 py-4 sm:py-6">
                    {/* Active Filters Display - Mobile */}
                    {isMobile && activeFilterCount > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {searchQuery && (
                                <Badge variant="secondary" className="gap-1">
                                    Search: {searchQuery}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSearchQuery('');
                                            handleSearch('', typeFilter, unassignedFilter);
                                        }}
                                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            {typeFilter && (
                                <Badge variant="secondary" className="gap-1">
                                    {getGalleryableTypeLabel(typeFilter)}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setTypeFilter(undefined);
                                            handleSearch(searchQuery, undefined, unassignedFilter);
                                        }}
                                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            {unassignedFilter && (
                                <Badge variant="secondary" className="gap-1">
                                    Unassigned
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setUnassignedFilter(false);
                                            handleSearch(searchQuery, typeFilter, false);
                                        }}
                                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Selection Controls */}
                    {media.data && media.data.length > 0 && (
                        <div className="mb-4 flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="select-all"
                                    checked={allSelected}
                                    onCheckedChange={handleSelectAll}
                                />
                                <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                                    {someSelected ? 'Select All' : allSelected ? 'Deselect All' : 'Select All'}
                                </Label>
                            </div>
                            {selectedItems.size > 0 && (
                                <div className="text-sm text-muted-foreground">
                                    {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'} selected
                                </div>
                            )}
                        </div>
                    )}

                    {/* Media Grid */}
                    {media.data && media.data.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                            {media.data.map((item: MediaItem) => (
                                <div
                                    key={item.id}
                                    className={`relative border rounded-lg overflow-hidden bg-card group hover:shadow-lg transition-all ${
                                        isUnused(item) ? 'border-destructive border-2 ring-1 ring-destructive/20' : ''
                                    }`}
                                >
                                    <div className="absolute top-2 left-2 z-20">
                                        <Checkbox
                                            checked={selectedItems.has(item.id)}
                                            onCheckedChange={() => handleItemSelect(item.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-background/90 backdrop-blur-sm"
                                        />
                                    </div>
                                    <div
                                        className="aspect-square relative bg-muted cursor-pointer"
                                        onClick={() => !isMobile && handleEditClick(item)}
                                    >
                                        <img
                                            src={item.url}
                                            srcSet={item.srcset}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            alt={item.alt_text || item.filename}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        {/* Mobile: Always show actions */}
                                        {isMobile && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditClick(item);
                                                    }}
                                                    className="h-9 w-9 p-0"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(item);
                                                    }}
                                                    className="h-9 w-9 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                        {/* Desktop: Show on hover */}
                                        {!isMobile && (
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditClick(item);
                                                    }}
                                                    className="h-9 w-9 p-0"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(item);
                                                    }}
                                                    className="h-9 w-9 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                        {item.is_featured && (
                                            <div className="absolute top-2 right-2 z-10">
                                                <Badge variant="default" className="text-xs">
                                                    Featured
                                                </Badge>
                                            </div>
                                        )}
                                        {isUnused(item) && (
                                            <div className="absolute bottom-2 left-2 z-10">
                                                <Badge variant="destructive" className="text-xs font-semibold">
                                                    Unused
                                                </Badge>
                                            </div>
                                        )}
                                        {isLogo(item.path) && (
                                            <div className="absolute bottom-2 right-2 z-10">
                                                <Badge variant="default" className="text-xs">
                                                    Logo
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 sm:p-3 space-y-1.5">
                                        <p
                                            className="text-xs sm:text-sm font-medium truncate"
                                            title={item.filename}
                                        >
                                            {item.filename}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {item.galleryable ? (
                                                <Badge variant="outline" className="text-xs">
                                                    {getGalleryableTypeLabel(item.galleryable_type)}
                                                </Badge>
                                            ) : isLogo(item.path) ? (
                                                <Badge variant="default" className="text-xs">
                                                    Logo
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="text-xs font-semibold">
                                                    Unused
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(item.size)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 sm:py-16">
                            <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground text-sm sm:text-base">
                                No media found
                            </p>
                            {activeFilterCount > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setTypeFilter(undefined);
                                        setUnassignedFilter(false);
                                        router.get('/dashboard/admin/media');
                                    }}
                                    className="mt-4"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {media.links && media.links.length > 3 && (
                        <div className="mt-6 sm:mt-8 flex justify-center gap-1 sm:gap-2 flex-wrap">
                            {media.links.map((link: any, index: number) => {
                                const label = link.label.replace(/&laquo;|&raquo;/g, '').trim();
                                const isPrevious = link.label.includes('&laquo;');
                                const isNext = link.label.includes('&raquo;');

                                // On mobile, only show prev/next and current page
                                if (isMobile && !isPrevious && !isNext && !link.active && label !== '...') {
                                    return null;
                                }

                                return (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size={isMobile ? 'sm' : 'default'}
                                        onClick={() => {
                                            if (link.url) {
                                                router.visit(link.url);
                                            }
                                        }}
                                        disabled={!link.url || link.active}
                                        className={isMobile ? 'min-w-[2.5rem]' : ''}
                                    >
                                        {isPrevious && '‹'}
                                        {isNext && '›'}
                                        {!isPrevious && !isNext && label}
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Media"
                description={
                    mediaToDelete
                        ? `Are you sure you want to delete "${mediaToDelete.filename}"? This action cannot be undone and will also delete the file from storage.`
                        : 'Are you sure you want to delete this media? This action cannot be undone and will also delete the file from storage.'
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="destructive"
            />

            {/* Batch Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={batchDeleteDialogOpen}
                onOpenChange={setBatchDeleteDialogOpen}
                onConfirm={handleBatchDelete}
                title="Delete Multiple Media Items"
                description={
                    selectedItems.size === 1
                        ? `Are you sure you want to delete 1 media item? This action cannot be undone and will also delete the file from storage.`
                        : `Are you sure you want to delete ${selectedItems.size} media items? This action cannot be undone and will also delete all files from storage.`
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="destructive"
            />

            {/* Edit Dialog - Mobile Optimized */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Media</DialogTitle>
                        <DialogDescription>
                            Update the metadata for this media file
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                        {mediaToEdit && (
                            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                                <img
                                    src={mediaToEdit.url}
                                    alt={mediaToEdit.alt_text || mediaToEdit.filename}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="alt_text">Alt Text</Label>
                            <Input
                                id="alt_text"
                                value={editForm.alt_text}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, alt_text: e.target.value })
                                }
                                placeholder="Enter alt text for accessibility"
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="caption">Caption</Label>
                            <Textarea
                                id="caption"
                                value={editForm.caption}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, caption: e.target.value })
                                }
                                placeholder="Enter caption"
                                className="mt-1.5"
                                rows={3}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setEditDialogOpen(false)}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleEditSave}
                                className="w-full sm:w-auto"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
