import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Undo,
    Redo,
    Image as ImageIcon,
    Upload,
    Search,
    Loader2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;
}

interface MediaItem {
    id: number;
    path: string;
    url: string;
    alt_text?: string;
    caption?: string;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Start writing...',
    className,
    error,
}: RichTextEditorProps) {
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [libraryMedia, setLibraryMedia] = useState<MediaItem[]>([]);
    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadInputId] = useState(() => `image-upload-${Math.random().toString(36).substr(2, 9)}`);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Image.configure({
                inline: true,
                allowBase64: false,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
                    'prose-headings:font-bold prose-p:my-2 prose-ul:my-2 prose-ol:my-2',
                    'prose-li:my-1 prose-blockquote:my-2 prose-img:max-w-full prose-img:rounded-lg'
                ),
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, false);
        }
    }, [value, editor]);

    const getCsrfToken = () => {
        const name = 'XSRF-TOKEN';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        }
        return '';
    };

    const loadMediaLibrary = async () => {
        setLoadingLibrary(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const response = await fetch(`/dashboard/admin/media?${params.toString()}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                const data = await response.json();
                const formattedData = (data.data || []).map((item: MediaItem) => {
                    let url = item.url;
                    if (!url && item.path) {
                        url = item.path.startsWith('/storage/')
                            ? item.path
                            : '/storage/' + item.path.replace(/^\//, '');
                    }
                    return {
                        ...item,
                        url: url || item.path,
                    };
                });
                setLibraryMedia(formattedData);
            }
        } catch (err) {
            console.error('Failed to load media library:', err);
        } finally {
            setLoadingLibrary(false);
        }
    };

    useEffect(() => {
        if (showImageDialog) {
            loadMediaLibrary();
        }
    }, [showImageDialog, searchQuery]);

    const handleImageSelect = (imageUrl: string, altText?: string) => {
        if (editor) {
            editor.chain().focus().setImage({ src: imageUrl, alt: altText || '' }).run();
            setShowImageDialog(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('context', 'article');

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
                throw new Error('Upload failed');
            }

            const data = await response.json();
            let imageUrl = data.media.url;
            if (!imageUrl && data.media.path) {
                imageUrl = data.media.path.startsWith('/storage/')
                    ? data.media.path
                    : '/storage/' + data.media.path.replace(/^\//, '');
            }

            if (imageUrl && editor) {
                editor.chain().focus().setImage({ src: imageUrl, alt: data.media.alt_text || '' }).run();
                setShowImageDialog(false);
                // Refresh library to show new image
                loadMediaLibrary();
            }
        } catch (err) {
            console.error('Failed to upload image:', err);
        } finally {
            setUploading(false);
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className={cn('space-y-2', className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border border-input rounded-md bg-background">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('bold') && 'bg-accent'
                    )}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('italic') && 'bg-accent'
                    )}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="h-6 w-px bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('heading', { level: 1 }) && 'bg-accent'
                    )}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('heading', { level: 2 }) && 'bg-accent'
                    )}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('heading', { level: 3 }) && 'bg-accent'
                    )}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                <div className="h-6 w-px bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('bulletList') && 'bg-accent'
                    )}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('orderedList') && 'bg-accent'
                    )}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('blockquote') && 'bg-accent'
                    )}
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <div className="h-6 w-px bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageDialog(true)}
                    className="h-8 w-8 p-0"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
                <div className="h-6 w-px bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="h-8 w-8 p-0"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="h-8 w-8 p-0"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <div
                className={cn(
                    'border border-input rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                    error && 'border-destructive'
                )}
            >
                <EditorContent editor={editor} />
            </div>

            {/* Image Selection Dialog */}
            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                        <DialogDescription>
                            Select an image from your media library or upload a new one
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search images..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Upload Section */}
                        <div className="border border-dashed border-input rounded-lg p-4">
                            <label
                                htmlFor={uploadInputId}
                                className="flex flex-col items-center justify-center cursor-pointer"
                            >
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">
                                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                                </span>
                                <input
                                    id={uploadInputId}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleImageUpload(file);
                                        }
                                    }}
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        {/* Media Library Grid */}
                        {loadingLibrary ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : libraryMedia.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {libraryMedia.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleImageSelect(item.url, item.alt_text)}
                                        className="group relative aspect-square overflow-hidden rounded-lg border border-input hover:border-primary transition-colors"
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.alt_text || 'Media item'}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No images found. Upload an image to get started.
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

