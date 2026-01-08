import { useState, type ReactElement } from 'react';
import { ConfirmationDialog } from '@/components/confirmation-dialog';

interface ConfirmationOptions {
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive';
}

interface UseConfirmationReturn {
    confirm: (options: ConfirmationOptions) => Promise<boolean>;
    ConfirmationDialog: () => ReactElement | null;
}

export function useConfirmation(): UseConfirmationReturn {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmationOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<
        ((value: boolean) => void) | null
    >(null);

    const confirm = (opts: ConfirmationOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setOptions(opts);
            setIsOpen(true);
            setResolvePromise(() => resolve);
        });
    };

    const handleConfirm = () => {
        if (resolvePromise) {
            resolvePromise(true);
        }
        setIsOpen(false);
        setOptions(null);
        setResolvePromise(null);
    };

    const handleCancel = () => {
        if (resolvePromise) {
            resolvePromise(false);
        }
        setIsOpen(false);
        setOptions(null);
        setResolvePromise(null);
    };

    const ConfirmationDialogComponent = () => {
        if (!options) return null;

        return (
            <ConfirmationDialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleCancel();
                    }
                }}
                title={options.title}
                description={options.description}
                confirmLabel={options.confirmLabel}
                cancelLabel={options.cancelLabel}
                variant={options.variant}
                onConfirm={handleConfirm}
            />
        );
    };

    return {
        confirm,
        ConfirmationDialog: ConfirmationDialogComponent,
    };
}

