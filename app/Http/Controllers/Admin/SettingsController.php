<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Media;
use App\Models\Setting;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function edit()
    {
        $maintenanceMode = (bool) Setting::get('maintenance_mode', false);

        // Get logo media IDs (with automatic migration from paths)
        $logoLightMediaId = Setting::getMediaId('logo_light');

        // Format logo data for frontend
        $logoLight = $this->formatLogoForFrontend($logoLightMediaId, '/images/black-logo.svg');
        
        // If no media, return fallback path as string for backward compatibility
        if ($logoLight === null) {
            $logoLight = '/images/black-logo.svg';
        }

        return Inertia::render('admin/settings/Edit', [
            'logoLight' => $logoLight,
            'maintenanceMode' => $maintenanceMode,
        ]);
    }

    /**
     * Format logo media for frontend.
     * Returns an object with id and url, or null if no media.
     */
    private function formatLogoForFrontend(?int $mediaId, string $fallbackPath): ?array
    {
        if ($mediaId === null) {
            // Return fallback path as a simple string for default logos
            return null;
        }

        $media = Media::find($mediaId);

        if (!$media) {
            return null;
        }

        // For logos, use original URL directly (logos don't have conversions)
        $url = null;
        if ($media->spatie_media_id) {
            if (!$media->relationLoaded('spatieMedia')) {
                $media->load('spatieMedia');
            }
            if ($media->spatieMedia) {
                try {
                    // Get original URL directly for logos (no conversions)
                    // Spatie returns absolute URLs which work better for images
                    $originalUrl = $media->spatieMedia->getUrl();
                    
                    // Validate the URL - ensure it contains the file path, not just an ID
                    if ($originalUrl && str_contains($originalUrl, $media->spatieMedia->file_name)) {
                        $url = $originalUrl;
                    } else {
                        // Construct URL from Spatie media data if getUrl() returns invalid value
                        $url = '/storage/' . $media->spatieMedia->id . '/' . $media->spatieMedia->file_name;
                    }
                } catch (\Exception $e) {
                    // Construct URL from Spatie media data on exception
                    if ($media->spatieMedia) {
                        $url = '/storage/' . $media->spatieMedia->id . '/' . $media->spatieMedia->file_name;
                    }
                }
            }
        }

        // Fallback to legacy path if Spatie URL not available
        if (!$url && $media->path) {
            // The path stored is like "logos/17/filename.svg" - need to extract just the ID and filename
            if (str_contains($media->path, '/')) {
                $pathParts = explode('/', $media->path);
                // Get the last two parts (ID and filename)
                if (count($pathParts) >= 2) {
                    $spatieId = $pathParts[count($pathParts) - 2];
                    $filename = $pathParts[count($pathParts) - 1];
                    $url = '/storage/' . $spatieId . '/' . $filename;
                } else {
                    $url = str_starts_with($media->path, '/storage/')
                        ? $media->path
                        : '/storage/' . ltrim($media->path, '/');
                }
            } else {
                $url = str_starts_with($media->path, '/storage/')
                    ? $media->path
                    : '/storage/' . ltrim($media->path, '/');
            }
        }

        // Final fallback - construct from Spatie media if available
        if (!$url && $media->spatie_media_id && $media->spatieMedia) {
            $url = '/storage/' . $media->spatieMedia->id . '/' . $media->spatieMedia->file_name;
        }

        // Absolute last fallback
        if (!$url) {
            $url = $fallbackPath;
        }

        // Final validation: ensure URL is valid and contains a file path
        // If URL is just /storage/{id} without filename, reconstruct it
        if ($url && str_starts_with($url, '/storage/') && !str_contains($url, '.')) {
            // URL is malformed (likely just /storage/{id}), reconstruct from Spatie media
            if ($media->spatie_media_id && $media->spatieMedia) {
                $url = '/storage/' . $media->spatieMedia->id . '/' . $media->spatieMedia->file_name;
            } elseif ($media->path && str_contains($media->path, '/')) {
                // Extract from path
                $pathParts = explode('/', $media->path);
                if (count($pathParts) >= 2) {
                    $spatieId = $pathParts[count($pathParts) - 2];
                    $filename = $pathParts[count($pathParts) - 1];
                    $url = '/storage/' . $spatieId . '/' . $filename;
                }
            }
        }

        return [
            'id' => $media->id,
            'url' => $url,
        ];
    }

    /**
     * Update the settings.
     */
    public function update(UpdateSettingsRequest $request)
    {
        $validated = $request->validated();

        // Update logo settings using media IDs
        if (array_key_exists('logoLight', $validated)) {
            $mediaId = $validated['logoLight'] ? (int) $validated['logoLight'] : null;
            Setting::setMediaId('logo_light', $mediaId);
        }

        // Update maintenance mode setting
        if (array_key_exists('maintenanceMode', $validated)) {
            Setting::set('maintenance_mode', $validated['maintenanceMode'] ? '1' : '0', 'string');
        }

        return redirect()->route('admin.settings.edit')
            ->with('success', 'Settings updated successfully.');
    }
}

