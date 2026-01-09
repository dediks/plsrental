<?php

namespace App\Models;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
    ];

    /**
     * Cache TTL in seconds (24 hours).
     */
    private const CACHE_TTL = 86400;

    /**
     * Get cache key for a setting.
     */
    private static function getCacheKey(string $key): string
    {
        return "settings.{$key}";
    }

    /**
     * Get a setting value by key.
     */
    public static function get(string $key, $default = null)
    {
        $cacheKey = self::getCacheKey($key);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            
            if (!$setting) {
                return $default;
            }

            if ($setting->type === 'json') {
                return json_decode($setting->value, true) ?? $default;
            }

            return $setting->value ?? $default;
        });
    }

    /**
     * Set a setting value by key.
     */
    public static function set(string $key, $value, string $type = 'string'): void
    {
        if ($type === 'json' && !is_string($value)) {
            $value = json_encode($value);
        }

        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'type' => $type]
        );

        // Clear cache for this setting
        Cache::forget(self::getCacheKey($key));
    }

    /**
     * Get a media ID setting value by key.
     * Returns the media ID if stored, or null if not set.
     */
    public static function getMediaId(string $key): ?int
    {
        $value = self::get($key);

        if ($value === null || $value === '') {
            return null;
        }

        // If it's already a numeric ID, return it
        if (is_numeric($value)) {
            return (int) $value;
        }

        // If it's a string (legacy path), try to find the Media record
        if (is_string($value)) {
            return self::migratePathToMediaId($key, $value);
        }

        return null;
    }

    /**
     * Set a media ID setting value by key.
     */
    public static function setMediaId(string $key, ?int $mediaId): void
    {
        if ($mediaId === null) {
            self::set($key, null);
        } else {
            self::set($key, (string) $mediaId, 'string');
        }
    }

    /**
     * Get media URL from a media ID setting.
     * Returns the URL if media exists, or fallback path if provided.
     */
    public static function getMediaUrl(string $key, ?string $fallbackPath = null): ?string
    {
        $mediaId = self::getMediaId($key);

        if ($mediaId === null) {
            return $fallbackPath;
        }

        $media = Media::find($mediaId);

        if (!$media) {
            return $fallbackPath;
        }

        // Get URL from Media model (which uses Spatie media)
        return $media->url;
    }

    /**
     * Get logo URL with special handling for paths.
     */
    public static function getLogoUrl(string $key, string $fallbackPath): string
    {
        $url = self::getMediaUrl($key, $fallbackPath);

        if (!$url) {
            return $fallbackPath;
        }

        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            $parsed = parse_url($url);
            return $parsed['path'] ?? $url;
        }

        if (str_starts_with($url, '/')) {
            return $url;
        }

        return '/storage/' . ltrim($url, '/');
    }

    /**
     * Migrate a path-based setting to media ID-based storage.
     * Attempts to find a Media record by path and update the setting.
     *
     * @return int|null The media ID if found, null otherwise
     */
    private static function migratePathToMediaId(string $key, string $path): ?int
    {
        // Skip migration for default logo paths
        if (in_array($path, ['/images/logo.png'], true)) {
            return null;
        }

        // Try to find Media record by path
        $media = Media::where('path', $path)
            ->orWhere('path', ltrim($path, '/storage/'))
            ->orWhere('path', ltrim($path, '/'))
            ->first();

        if ($media) {
            // Migrate to ID-based storage
            self::setMediaId($key, $media->id);
            return $media->id;
        }

        return null;
    }
}
