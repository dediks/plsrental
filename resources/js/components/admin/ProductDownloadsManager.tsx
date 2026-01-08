import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Trash2, ArrowUp, ArrowDown, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

interface ProductDownload {
    id?: number;
    title: string;
    category: string;
    path?: string;
    url?: string;
    mime_type?: string;
    size?: number;
    order: number;
    file?: File;
}

interface ProductDownloadsManagerProps {
    value: ProductDownload[];
    onChange: (value: ProductDownload[]) => void;
    error?: string;
}

const DOWNLOAD_CATEGORIES = [
    'Datasheet',
    'Manual',
    'CAD',
    'Software',
    'Other',
];

export function ProductDownloadsManager({
    value,
    onChange,
    error,
}: ProductDownloadsManagerProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addDownload = () => {
        onChange([
            ...value,
            {
                title: '',
                category: 'Datasheet',
                order: value.length,
            },
        ]);
    };

    const removeDownload = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const updateDownload = (
        index: number,
        field: keyof ProductDownload,
        newValue: string | number | File
    ) => {
        const newDownloads = [...value];
        newDownloads[index] = {
            ...newDownloads[index],
            [field]: newValue,
        };
        onChange(newDownloads);
    };

    const handleFileSelect = (index: number, file: File | null) => {
        if (file) {
            updateDownload(index, 'file', file);
            updateDownload(index, 'title', file.name.replace(/\.[^/.]+$/, ''));
            updateDownload(index, 'mime_type', file.type);
            updateDownload(index, 'size', file.size);
        }
    };

    const moveDownload = (index: number, direction: 'up' | 'down') => {
        const newValue = [...value];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newValue.length) {
            return;
        }

        // Swap orders
        const temp = newValue[index].order;
        newValue[index].order = newValue[targetIndex].order;
        newValue[targetIndex].order = temp;

        // Swap positions
        [newValue[index], newValue[targetIndex]] = [
            newValue[targetIndex],
            newValue[index],
        ];

        onChange(newValue);
    };

    return (
        <div className="space-y-3">
            {value.map((download, index) => (
                <div
                    key={index}
                    className="p-4 border border-border rounded-lg bg-card space-y-3"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => moveDownload(index, 'up')}
                                disabled={index === 0}
                                className="h-8 w-8"
                                aria-label="Move up"
                            >
                                <ArrowUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => moveDownload(index, 'down')}
                                disabled={index === value.length - 1}
                                className="h-8 w-8"
                                aria-label="Move down"
                            >
                                <ArrowDown className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                            Order: {download.order}
                        </span>

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeDownload(index)}
                            className="text-destructive hover:text-destructive ml-auto"
                            aria-label="Remove download"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            placeholder="Title"
                            value={download.title}
                            onChange={(e) =>
                                updateDownload(index, 'title', e.target.value)
                            }
                        />

                        <Select
                            value={download.category}
                            onValueChange={(val) =>
                                updateDownload(index, 'category', val)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {DOWNLOAD_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleFileSelect(index, file);
                            }}
                            accept=".pdf,.dwg,.zip,.rar,.doc,.docx"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = '.pdf,.dwg,.zip,.rar,.doc,.docx';
                                input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement)
                                        .files?.[0];
                                    if (file) {
                                        handleFileSelect(index, file);
                                    }
                                };
                                input.click();
                            }}
                            className="w-full"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {download.file
                                ? download.file.name
                                : download.path
                                  ? 'Change File'
                                  : 'Upload File'}
                        </Button>
                        {download.file && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {download.file.name} (
                                {(download.file.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                        {download.url && !download.file && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Current: {download.path}
                            </p>
                        )}
                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={addDownload}
                className="w-full"
            >
                Add Download
            </Button>

            {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
            )}
        </div>
    );
}


