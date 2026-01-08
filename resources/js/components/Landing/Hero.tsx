import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Hero({
    carouselImages,
    splitLayoutImage,
    trustedByText,
    showTrustedBy,
    trustedByAvatars,
    autoPlay = true,
    autoPlayInterval = 5000,
    showBadge = true,
    showScrollIndicator = true,
    showCarousel = true,
    showSplitLayoutImage = true,
    showOverlay = true,
    overlayOpacity = 80,
    heading,
    subheading,
    showHeading = true,
    showSubheading = true
}: any) {
    const defaultImages = [
        '/images/hero/hero-speakers-1.jpg',
        '/images/hero/hero-speakers-2.jpg',
        '/images/hero/hero-speakers-3.jpg',
    ];

    const images = carouselImages && carouselImages.length > 0 ? carouselImages : defaultImages;
    
    // Auto-scroll logic
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        if (!autoPlay) return;
        const interval = setInterval(nextImage, autoPlayInterval);
        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, nextImage]);

    return (
        <section className="relative w-full min-h-screen bg-brand-dark overflow-hidden flex flex-col justify-center">
             {/* Background Carousel */}
             {showCarousel && (
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }} // Smooth transition
                            className="absolute inset-0 w-full h-full"
                        >
                            <img
                                src={images[currentImageIndex]}
                                alt={`Hero Slide ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient Overlay */}
                            {showOverlay && (
                                <div className={cn("absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-transparent", `opacity-${overlayOpacity}`)} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            {!showCarousel && (
                <div className="absolute inset-0 z-0 bg-brand-dark/50" />
            )}

            {/* Content Container */}
            <div className="container relative z-10 px-4 pt-20 pb-12 mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    
                    {/* Text Content */}
                    <div className="flex-1 max-w-2xl text-left space-y-8">
                        
                        {/* Badge */}
                         {showBadge && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium tracking-wide">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                                    </span>
                                    Premium Rental Service
                                </span>
                            </motion.div>
                        )}

                        {/* Heading */}
                         {showHeading && (
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
                            >
                                {heading || 'Acoustic Engineering Excellence'}
                            </motion.h1>
                        )}

                        {/* Subheading */}
                         {showSubheading && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-lg text-gray-300 leading-relaxed max-w-xl"
                            >
                                {subheading || "Professional loudspeaker systems that deliver unparalleled clarity, precision, and power for the world's most demanding audio environments."}
                            </motion.p>
                        )}

                         {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap gap-4 pt-4"
                        >
                            <Button 
                                size="lg" 
                                className="bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold px-8 h-14 rounded-full transition-all duration-300 hover:scale-105"
                            >
                                View Our Products
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            
                            <Button 
                                size="lg" 
                                variant="outline"
                                className="border-white/20 hover:bg-white/10 text-white h-14 px-8 rounded-full backdrop-blur-sm"
                            >
                                <Play className="mr-2 w-5 h-5 fill-current" />
                                Watch Showreel
                            </Button>
                        </motion.div>

                        {/* Trusted By Section (Optional) */}
                        {showTrustedBy && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="pt-8 border-t border-white/10 mt-8"
                            >
                                <p className="text-sm text-gray-400 mb-4">{trustedByText}</p>
                                <div className="flex -space-x-3">
                                   {trustedByAvatars && trustedByAvatars.length > 0 ? (
                                        trustedByAvatars.map((avatar: string, i: number) => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-dark overflow-hidden bg-gray-800">
                                                 <img src={avatar} alt={`Client ${i}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))
                                   ) : (
                                       // Placeholder avatars if none provided
                                      [1,2,3].map((_, i) => (
                                          <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-dark overflow-hidden bg-gray-800 flex items-center justify-center text-xs text-brand-gold">
                                            {i+1}
                                          </div>
                                      ))
                                   )}
                                   <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-brand-gold flex items-center justify-center text-xs font-bold text-black z-10">
                                       100+
                                   </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Split Layout Image (Right Side) - Optional */}
                    {showSplitLayoutImage && splitLayoutImage && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="hidden lg:block relative w-[500px] h-[600px]"
                        >
                            <div className="absolute inset-0 bg-brand-gold/20 rounded-2xl transform rotate-3 blur-2xl top-10" />
                            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <img
                                    src={splitLayoutImage}
                                    alt="Hero Feature"
                                    className="w-full h-full object-cover"
                                />
                                {/* Floating Card Example */}
                                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center">
                                            <Play className="w-5 h-5 text-black fill-black ml-1" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">System Demo</p>
                                            <p className="text-xs text-gray-400">Experience the difference</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            {showScrollIndicator && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <span className="text-xs uppercase tracking-widest text-brand-gold/80">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-px h-12 bg-gradient-to-b from-brand-gold/80 to-transparent"
                    />
                </motion.div>
            )}
        </section>
    );
}