import { useState } from 'react';
import { X } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    featuredImage?: string;
}

export function ImageGallery({ images, featuredImage }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Combine featured image and gallery images, ensuring featured is first
    const allImages = featuredImage
        ? [featuredImage, ...images.filter((img) => img !== featuredImage && img)]
        : images.filter(img => img);

    if (allImages.length === 0) {
        return (
            <div className="aspect-square w-full rounded-lg bg-muted" />
        );
    }

    const currentImage = allImages[currentImageIndex];

    return (
        <>
            <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square overflow-hidden rounded-lg bg-muted relative">
                    <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 dark:opacity-100 dark:bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.45)_0%,_rgba(0,0,0,0)_65%)]" />
                    <img
                        src={currentImage}
                        alt="Product"
                        className="h-full w-full cursor-pointer object-cover"
                        onClick={() => setSelectedImage(currentImage)}
                    />
                    {/* Image counter */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {allImages.length}
                        </div>
                    )}
                </div>

                {/* Thumbnail Grid - Show all images */}
                {allImages.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-4">
                        {allImages.map((image, index) => (
                            <div
                                key={index}
                                className={`aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer border-2 transition-all ${
                                    currentImageIndex === index 
                                        ? 'border-primary ring-2 ring-primary ring-offset-2' 
                                        : 'border-transparent hover:border-primary/50'
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="h-full w-full object-cover transition-opacity hover:opacity-75"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        type="button"
                        className="absolute right-4 top-4 text-foreground hover:text-muted-foreground transition-colors z-10"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="h-6 w-6" />
                    </button>
                    {/* Navigation in lightbox */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIdx = allImages.indexOf(selectedImage);
                                    const prevIdx = currentIdx === 0 ? allImages.length - 1 : currentIdx - 1;
                                    setSelectedImage(allImages[prevIdx]);
                                    setCurrentImageIndex(prevIdx);
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors z-10"
                                aria-label="Previous image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIdx = allImages.indexOf(selectedImage);
                                    const nextIdx = currentIdx === allImages.length - 1 ? 0 : currentIdx + 1;
                                    setSelectedImage(allImages[nextIdx]);
                                    setCurrentImageIndex(nextIdx);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors z-10"
                                aria-label="Next image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                    <div className="relative">
                        <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 dark:opacity-100 dark:bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.45)_0%,_rgba(0,0,0,0)_65%)]" />
                        <img
                            src={selectedImage}
                            alt="Enlarged view"
                            className="max-h-full max-w-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
