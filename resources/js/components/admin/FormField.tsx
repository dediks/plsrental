import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { type ReactNode } from 'react';

interface FormFieldProps {
    label: string;
    name: string;
    error?: string;
    required?: boolean;
    children: ReactNode;
    description?: string;
}

export function FormField({
    label,
    name,
    error,
    required,
    children,
    description,
}: FormFieldProps) {
    return (
        <div className="space-y-4">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <div className="mt-2">
            {children}
            </div>
            <InputError message={error} />
        </div>
    );
}

