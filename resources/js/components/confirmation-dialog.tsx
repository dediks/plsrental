import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void | Promise<void>;
    variant?: 'default' | 'destructive';
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    variant = 'default',
}: ConfirmationDialogProps) {
    const handleConfirm = async () => {
        await onConfirm();
        onOpenChange(false);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    const isDestructive = variant === 'destructive';

    // Add keyboard shortcuts: Enter to confirm, Escape to cancel
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleConfirm();
            } else if (event.key === 'Escape') {
                event.preventDefault();
                handleCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, handleConfirm, handleCancel]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    '!top-16 !translate-y-0',
                    isDestructive && 'border-destructive bg-background dark:bg-background'
                )}
            >
                <DialogHeader>
                    <DialogTitle
                        className={cn(
                            isDestructive && 'text-destructive font-extrabold'
                        )}
                    >
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={isDestructive ? 'destructive' : 'default'}
                        onClick={handleConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

