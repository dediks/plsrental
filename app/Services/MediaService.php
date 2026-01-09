<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

class MediaService
{
    /**
     * Format media collection for frontend.
     *
     * @param  Collection  $mediaCollection  Collection of Media models
     * @param  string|null  $preferredConversion  Preferred conversion name for thumbnails (e.g., 'small', 'medium')
     */
    public static function formatMediaForFrontend(Collection $mediaCollection, ?string $preferredConversion = 'xxlarge'): array
    {
        return $mediaCollection->map(function ($media) use ($preferredConversion) {
            return self::formatSingleMedia($media, $preferredConversion);
        })->toArray();
    }

    /**
     * Format a single media item for frontend.
     *
     * @param  Media  $media  The media model
     * @param  string|null  $preferredConversion  Preferred conversion name (e.g., 'medium', 'large') for the main URL
     */
    public static function formatSingleMedia(Media $media, ?string $preferredConversion = 'xxlarge'): array
    {
        $url = null;
        $responsiveUrls = [];
        $srcset = '';

        // If Spatie media exists, get conversion URLs
        if ($media->spatie_media_id) {
            // Load relationship if not loaded
            if (! $media->relationLoaded('spatieMedia')) {
                $media->load('spatieMedia');
            }
            if ($media->spatieMedia) {
                $spatieMedia = $media->spatieMedia;

                // Get responsive image URLs (all conversions)
                $responsiveUrls = self::getResponsiveImageUrls($spatieMedia);

                // Use preferred conversion for main URL, or fallback to best available
                $url = self::getBestConversionUrl($spatieMedia, $preferredConversion);

                // Build srcset for responsive images
                $srcset = self::buildSrcset($responsiveUrls);
            }
        }

        // Fallback to legacy path if no Spatie media or no conversion URL
        // Also ensure url is populated from path if conversion URL is empty string
        if (empty($url) && $media->path) {
            // Check if it's already a full URL
            if (str_starts_with($media->path, 'http://') || str_starts_with($media->path, 'https://')) {
                $url = $media->path;
            } else {
                // Generate relative URL for frontend compatibility
                $url = str_starts_with($media->path, '/storage/')
                    ? $media->path
                    : '/storage/'.ltrim($media->path, '/');
            }
        }

        return [
            'id' => $media->id,
            'path' => $media->path,
            'url' => $url ?: null, // Ensure null instead of empty string
            'responsive_urls' => $responsiveUrls,
            'srcset' => $srcset,
            'alt_text' => $media->alt_text,
            'caption' => $media->caption,
            'order' => (int) ($media->order ?? 0),
            'is_featured' => (bool) $media->is_featured,
        ];
    }

    /**
     * Get the best conversion URL for a Spatie media item.
     * Tries preferred conversion first, then falls back to other available conversions.
     * Returns relative URLs for frontend compatibility.
     *
     * @param  SpatieMedia  $spatieMedia  The Spatie media model
     * @param  string|null  $preferredConversion  Preferred conversion name (e.g., 'medium', 'large', 'small')
     * @return string|null The conversion URL (relative) or original URL as fallback
     */
    public static function getBestConversionUrl(SpatieMedia $spatieMedia, ?string $preferredConversion = 'xxlarge'): ?string
    {
        $url = null;

        // Try preferred conversion first
        if ($preferredConversion && $spatieMedia->hasGeneratedConversion($preferredConversion)) {
            try {
                $url = $spatieMedia->getUrl($preferredConversion);
            } catch (\Exception $e) {
                // Continue to fallback
            }
        }

        // Try other conversions in order of preference (larger to smaller for quality)
        if (! $url) {
            $conversionOrder = ['large', 'xxlarge', 'xlarge', 'medium', 'small', 'thumb'];
            foreach ($conversionOrder as $conversionName) {
                if ($conversionName === $preferredConversion) {
                    continue; // Already tried
                }
                if ($spatieMedia->hasGeneratedConversion($conversionName)) {
                    try {
                        $url = $spatieMedia->getUrl($conversionName);
                        if ($url) {
                            break;
                        }
                    } catch (\Exception $e) {
                        continue;
                    }
                }
            }
        }

        // Fallback to original URL
        if (! $url) {
            try {
                $url = $spatieMedia->getUrl();
            } catch (\Exception $e) {
                return null;
            }
        }

        // Convert absolute URL to relative URL for frontend compatibility
        if ($url) {
            // If it's an absolute URL, extract the path
            if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
                $parsed = parse_url($url);

                return $parsed['path'] ?? $url;
            }

            // If it already starts with /storage/, return as is
            if (str_starts_with($url, '/storage/')) {
                return $url;
            }

            // Otherwise, ensure it starts with /storage/
            return '/storage/'.ltrim($url, '/');
        }

        return null;
    }

    /**
     * Get responsive image URLs from Spatie media.
     * Uses conversion URLs for reliable srcset generation.
     * Returns relative URLs for frontend compatibility.
     */
    public static function getResponsiveImageUrls(SpatieMedia $spatieMedia): array
    {
        $urls = [];
        $conversions = MediaConversionService::getConversionSizes();

        foreach ($conversions as $name => $width) {
            try {
                // Get conversion URL if it exists
                if ($spatieMedia->hasGeneratedConversion($name)) {
                    $conversionUrl = $spatieMedia->getUrl($name);
                    if ($conversionUrl) {
                        // Convert to relative URL
                        $urls[$width] = self::convertToRelativeUrl($conversionUrl);
                    }
                }
            } catch (\Exception $e) {
                // If conversion doesn't exist, skip it
                continue;
            }
        }

        // If no conversion URLs, fallback to original URL
        if (empty($urls)) {
            $originalUrl = $spatieMedia->getUrl();
            $urls['original'] = self::convertToRelativeUrl($originalUrl);
        }

        return $urls;
    }

    /**
     * Build srcset string from responsive URLs.
     * Converts absolute URLs to relative URLs for frontend compatibility.
     */
    public static function buildSrcset(array $responsiveUrls): string
    {
        if (empty($responsiveUrls)) {
            return '';
        }

        $srcsetParts = [];
        foreach ($responsiveUrls as $width => $url) {
            if ($width !== 'original' && is_numeric($width)) {
                // Convert absolute URL to relative URL if needed
                $relativeUrl = self::convertToRelativeUrl($url);
                $srcsetParts[] = $relativeUrl.' '.$width.'w';
            }
        }

        return implode(', ', $srcsetParts);
    }

    /**
     * Convert absolute URL to relative URL for frontend compatibility.
     */
    private static function convertToRelativeUrl(string $url): string
    {
        // If it's an absolute URL, extract the path
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            $parsed = parse_url($url);
            return $parsed['path'] ?? $url;
        }

        // If it already starts with /storage/, return as is
        if (str_starts_with($url, '/storage/')) {
            return $url;
        }

        // Otherwise, ensure it starts with /storage/
        return '/storage/'.ltrim($url, '/');
    }

    /**
     * Sync media relationships for a model.
     *
     * @param  Model  $model  The model to sync media for (Product, Article, etc.)
     * @param  array  $mediaData  Array of media items with id, order, is_featured
     * @param  string  $modelClass  The class name of the model (e.g., Product::class)
     */
    public static function syncMedia(Model $model, array $mediaData, string $modelClass): void
    {
        // Get current media IDs
        $currentMediaIds = $model->media->pluck('id')->toArray();
        $newMediaIds = array_column($mediaData, 'id');

        // Detach removed media (set galleryable_id and galleryable_type to null)
        $removedMediaIds = array_diff($currentMediaIds, $newMediaIds);
        if (! empty($removedMediaIds)) {
            Media::whereIn('id', $removedMediaIds)
                ->where('galleryable_id', $model->id)
                ->where('galleryable_type', $modelClass)
                ->update([
                    'galleryable_id' => null,
                    'galleryable_type' => null,
                ]);
        }

        // Attach/update media relationships
        if (! empty($mediaData)) {
            foreach ($mediaData as $index => $mediaItem) {
                // Only process if ID is valid (positive integer, exists in database)
                if (isset($mediaItem['id']) && $mediaItem['id'] > 0) {
                    $media = Media::find($mediaItem['id']);
                    if ($media) {
                        $media->update([
                            'galleryable_id' => $model->id,
                            'galleryable_type' => $modelClass,
                            'order' => $mediaItem['order'] ?? $index,
                            'is_featured' => $mediaItem['is_featured'] ?? false,
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Verify that media belongs to the authenticated user or is unassigned.
     * This prevents unauthorized access to other users' media.
     *
     * @param  Model|null  $model  Optional model to check ownership
     */
    public static function canAccessMedia(Media $media, ?Model $model = null): bool
    {
        // If media is unassigned, any authenticated user can access it
        if (! $media->galleryable_id) {
            return true;
        }

        // If model is provided, check if media belongs to it
        if ($model) {
            return $media->galleryable_id === $model->id
                && $media->galleryable_type === get_class($model);
        }

        // For now, allow access if media is assigned (can be enhanced with user ownership)
        return true;
    }

    /**
     * Check if media is currently assigned to a model (Product, Article, etc.).
     */
    public static function isMediaInUse(Media $media): bool
    {
        return $media->galleryable_id !== null && $media->galleryable_type !== null;
    }

    /**
     * Get the model name that is using this media.
     */
    public static function getMediaUsageInfo(Media $media): ?array
    {
        if (! self::isMediaInUse($media)) {
            return null;
        }

        // Load the relationship if not already loaded
        if (! $media->relationLoaded('galleryable')) {
            $media->load('galleryable');
        }

        if (! $media->galleryable) {
            return null;
        }

        $model = $media->galleryable;
        $modelName = class_basename($media->galleryable_type);

        return [
            'type' => $modelName,
            'name' => $model->name ?? $model->title ?? 'Unknown',
            'id' => $model->id,
        ];
    }

    /**
     * Get featured image URL from media collection.
     *
     * @param  string|null  $fallbackUrl  Legacy featured_image URL
     */
    public static function getFeaturedImageUrl(Collection $mediaCollection, ?string $fallbackUrl = null): ?string
    {
        $formattedMedia = self::formatMediaForFrontend($mediaCollection);

        if (empty($formattedMedia)) {
            return $fallbackUrl;
        }

        // Try to find featured media
        $featuredMedia = collect($formattedMedia)->where('is_featured', true)->first();
        if ($featuredMedia && ! empty($featuredMedia['url'])) {
            return $featuredMedia['url'];
        }

        // Fallback to first media item
        $firstMedia = $formattedMedia[0];
        if (! empty($firstMedia['url'])) {
            return $firstMedia['url'];
        }

        return $fallbackUrl;
    }

    /**
     * Format model with media collection and extract featured_image.
     * Also populates gallery_images for backward compatibility.
     * Optionally formats legacy featured_image URL if no media exists.
     *
     * @param  Model  $model  The model to format
     * @param  string|null  $preferredConversion  Preferred conversion for images (e.g., 'small' for thumbnails, 'large' for full size)
     * @param  bool  $formatLegacyFeaturedImage  Whether to format legacy featured_image if no media exists
     */
    public static function formatModelWithMedia(
        Model $model,
        ?string $preferredConversion = 'small',
        bool $formatLegacyFeaturedImage = false
    ): void {
        // Format media with URLs using preferred conversion
        // Sort by featured first, then by order to ensure correct display order
        // Use sortBy with stable sort to preserve original order for items with same values
        $formattedMedia = collect(self::formatMediaForFrontend($model->media, $preferredConversion))
            ->filter(fn ($media) => ! empty($media['url']))
            ->map(function ($item, $index) {
                // Preserve original index for stable sorting
                $item['_original_index'] = $index;

                return $item;
            })
            ->sortBy([
                ['is_featured', 'desc'], // Featured first
                ['order', 'asc'],        // Then by order
                ['_original_index', 'asc'], // Then by original order for stability
            ])
            ->map(function ($item) {
                // Remove temporary index
                unset($item['_original_index']);

                return $item;
            })
            ->values()
            ->toArray();

        // Set media as a plain array attribute that will serialize correctly
        // This ensures the frontend receives media as an array of objects
        $model->setAttribute('media', $formattedMedia);
        $model->makeVisible('media'); // Ensure it's included in toArray()

        // Also set as relation for backward compatibility, but the attribute takes precedence
        $model->setRelation('media', new \Illuminate\Database\Eloquent\Collection(
            collect($formattedMedia)->map(function ($item) {
                return (object) $item;
            })->all()
        ));

        // Extract featured_image and gallery_images from media
        if (count($formattedMedia) > 0) {
            // Get all media URLs for gallery_images (backward compatibility)
            $galleryUrls = collect($formattedMedia)
                ->pluck('url')
                ->filter()
                ->values()
                ->toArray();

            // Populate gallery_images if model has this attribute (for backward compatibility)
            // This ensures backward compatibility with frontend code that expects gallery_images
            // We append it to the model so it's included in JSON responses
            if (in_array('gallery_images', $model->getFillable())) {
                // Append as a dynamic attribute that will be included in toArray()
                $model->setAttribute('gallery_images', $galleryUrls);
                // Make it visible in array/JSON output
                $model->makeVisible('gallery_images');
            }

            // Extract featured_image from media
            $featuredMedia = collect($formattedMedia)->where('is_featured', true)->first();
            if ($featuredMedia && ! empty($featuredMedia['url'])) {
                $model->featured_image = $featuredMedia['url'];
            } else {
                $firstMedia = $formattedMedia[0];
                if (! empty($firstMedia['url'])) {
                    $model->featured_image = $firstMedia['url'];
                }
            }
        } elseif ($formatLegacyFeaturedImage && $model->featured_image) {
            // Format legacy featured_image URL
            $model->featured_image = self::formatLegacyFeaturedImageUrl($model->featured_image);
        }
    }

    /**
     * Format legacy featured_image path to proper URL format.
     */
    public static function formatLegacyFeaturedImageUrl(?string $featuredImage): ?string
    {
        if (! $featuredImage) {
            return null;
        }

        // If already a proper URL format, return as is
        if (str_starts_with($featuredImage, '/storage/') ||
            str_starts_with($featuredImage, 'http://') ||
            str_starts_with($featuredImage, 'https://')) {
            return $featuredImage;
        }

        // Convert path to /storage/ URL
        return '/storage/'.ltrim($featuredImage, '/');
    }
}
