import { X } from 'lucide-react';
import { useEffect } from 'react';

interface LightboxProps {
    image: string | null;
    alt?: string;
    onClose: () => void;
    className?: string;
}

export function Lightbox({ image, alt = 'Enlarged view', onClose, className = '' }: LightboxProps) {
    useEffect(() => {
        if (image) {
            // Prevent body scroll when lightbox is open
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
        }
    }, [image]);

    if (!image) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4"
            onClick={onClose}
        >
            <button
                type="button"
                className="absolute right-4 top-4 text-foreground hover:text-muted-foreground transition-colors z-10"
                onClick={onClose}
                aria-label="Close lightbox"
            >
                <X className="h-6 w-6" />
            </button>
            <img
                src={image}
                alt={alt}
                className={`max-h-full max-w-full object-contain ${className}`}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}

