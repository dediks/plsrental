<?php

namespace App\Services;

use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;

/**
 * Service for managing media conversions configuration.
 * Provides a single source of truth for responsive image sizes and conversion settings.
 */
class MediaConversionService
{
    /**
     * Get responsive image conversion sizes.
     * Format: ['conversion_name' => width_in_pixels]
     *
     * @return array<string, int>
     */
    public static function getConversionSizes(): array
    {
        return [
            'thumb' => 320,
            'small' => 640,
            'medium' => 768,
            'large' => 1024,
            'xlarge' => 1280,
            'xxlarge' => 1920,
        ];
    }

    /**
     * Get responsive image widths for srcset generation.
     *
     * @return array<int>
     */
    public static function getResponsiveWidths(): array
    {
        return array_values(self::getConversionSizes());
    }

    /**
     * Register responsive image conversions for a model that implements HasMedia.
     * This method should be called from the model's registerMediaConversions() method.
     *
     * @param  HasMedia  $model  The model implementing HasMedia interface
     */
    public static function registerConversions(HasMedia $model): void
    {
        $sizes = self::getConversionSizes();

        foreach ($sizes as $name => $width) {
            $model->addMediaConversion($name)
                ->width($width)
                ->fit(Fit::Max, $width, null)
                ->format('webp')
                ->quality(85)
                ->performOnCollections('default', 'images', 'gallery')
                ->nonQueued(); // Generate immediately
        }
    }
}
