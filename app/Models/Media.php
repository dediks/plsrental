<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

class Media extends Model
{
    use HasFactory;

    protected $table = 'media_metadata';

    protected $fillable = [
        'spatie_media_id',
        'path',
        'filename',
        'mime_type',
        'size',
        'alt_text',
        'caption',
        'order',
        'is_featured',
        'galleryable_id',
        'galleryable_type',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'order' => 'integer',
            'is_featured' => 'boolean',
        ];
    }

    /**
     * Get the Spatie media record.
     */
    public function spatieMedia(): BelongsTo
    {
        return $this->belongsTo(SpatieMedia::class, 'spatie_media_id');
    }

    /**
     * Get the parent galleryable model (Product, Article, Gallery, etc.).
     */
    public function galleryable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the image URL.
     * If Spatie media exists, prefer WebP conversion over original.
     */
    public function getUrlAttribute(): ?string
    {
        // If Spatie media exists, use conversion URL (prefer 'medium' for general use)
        if ($this->spatie_media_id) {
            if (! $this->relationLoaded('spatieMedia')) {
                $this->load('spatieMedia');
            }
            if ($this->spatieMedia) {
                // Use MediaService to get best conversion URL
                return \App\Services\MediaService::getBestConversionUrl($this->spatieMedia, 'medium');
            }
        }

        // Fallback to legacy path
        if (! $this->path) {
            return null;
        }

        if (str_starts_with($this->path, 'http://') || str_starts_with($this->path, 'https://')) {
            return $this->path;
        }

        if (str_starts_with($this->path, '/storage/')) {
            return $this->path;
        }

        // Generate relative URL for frontend compatibility
        return '/storage/'.ltrim($this->path, '/');
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Automatically delete Spatie media and files when the media record is deleted
        static::deleting(function ($media) {
            // Delete Spatie media if linked (this will also delete files and conversions)
            if ($media->spatie_media_id && $media->spatieMedia) {
                $media->spatieMedia->delete();
            } elseif ($media->path && Storage::disk('public')->exists($media->path)) {
                // Fallback: delete legacy file if Spatie media doesn't exist
                Storage::disk('public')->delete($media->path);
            }
        });
    }
}
