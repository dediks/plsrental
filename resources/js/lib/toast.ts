import { toast as toastFn } from '@/hooks/use-toast';

/**
 * Show a success toast notification
 */
export function toastSuccess(message: string, title?: string) {
    return toastFn({
        title: title || 'Success',
        description: message,
        variant: 'default',
    });
}

/**
 * Show an error toast notification
 */
export function toastError(message: string, title?: string) {
    return toastFn({
        title: title || 'Error',
        description: message,
        variant: 'destructive',
    });
}

/**
 * Show an info toast notification
 */
export function toastInfo(message: string, title?: string) {
    return toastFn({
        title: title || 'Info',
        description: message,
        variant: 'default',
    });
}

/**
 * Show a warning toast notification
 */
export function toastWarning(message: string, title?: string) {
    return toastFn({
        title: title || 'Warning',
        description: message,
        variant: 'default',
    });
}

/**
 * Direct access to the toast function for custom usage
 */
export { toastFn as toast };

