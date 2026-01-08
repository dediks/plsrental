import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DeleteButtonProps {
    onDelete: () => void;
    title?: string;
    description?: string;
    itemName?: string;
}

export function DeleteButton({
    onDelete,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    itemName,
}: DeleteButtonProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        onDelete();
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    // Add keyboard shortcuts: Enter to confirm, Escape to cancel
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleDelete();
            } else if (event.key === 'Escape') {
                event.preventDefault();
                handleCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                        {itemName && (
                            <span className="block mt-2 font-semibold">
                                {itemName}
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

