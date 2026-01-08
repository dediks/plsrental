<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

/**
 * Model to hold unassigned media files using Spatie Media Library.
 */
class MediaLibrary extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'media_library';

    protected $fillable = [];

    /**
     * Register media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('default')
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

        $this->addMediaCollection('images')
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

        $this->addMediaCollection('gallery')
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

        $this->addMediaCollection('logos')
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']);
    }

    /**
     * Register media conversions for responsive images.
     */
    public function registerMediaConversions(?SpatieMedia $media = null): void
    {
        \App\Services\MediaConversionService::registerConversions($this);
    }
}
