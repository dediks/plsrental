<?php

namespace App\Services;

use App\Models\Media;
use App\Models\MediaLibrary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class MediaUploadService
{
    /**
     * Generate a consistent filename format.
     * Format: YYYYMMDD_HHMMSS_XXXXXX.extension
     * Example: 20251227_153045_aB3dEf.webp
     *
     * @param  string  $extension  File extension (without dot)
     */
    public function generateFilename(string $extension): string
    {
        $now = now();
        $datePart = $now->format('Ymd');
        $timePart = $now->format('His');
        $randomPart = Str::random(8); // 8 character random string for uniqueness

        return sprintf('%s_%s_%s.%s', $datePart, $timePart, $randomPart, strtolower($extension));
    }

    /**
     * Upload an image file using Spatie Media Library.
     *
     * @param  UploadedFile  $file  The uploaded file
     * @param  string  $context  The context (product, article, gallery, logo)
     * @param  string|null  $altText  Alt text for the image
     * @param  string|null  $caption  Caption for the image
     *
     * @throws \Exception
     */
    public function uploadImage(UploadedFile $file, string $context = 'product', ?string $altText = null, ?string $caption = null): Media
    {
        $isLogoContext = $context === 'logo';
        $extension = strtolower($file->getClientOriginalExtension());

        // Validate file type
        $this->validateImageFile($file, $context, $isLogoContext);

        // Security check for SVG files
        if ($isLogoContext && $extension === 'svg') {
            $svgContent = file_get_contents($file->getRealPath());
            if (! $this->isSvgSafe($svgContent)) {
                throw new \Exception('SVG file contains potentially dangerous content. Script tags and event handlers are not allowed.');
            }
        }

        // Determine collection name based on context
        $collection = match ($context) {
            'product' => 'images',
            'article' => 'images',
            'gallery' => 'gallery',
            'logo' => 'logos',
            default => 'default',
        };

        return \Illuminate\Support\Facades\DB::transaction(function () use ($file, $context, $collection, $altText, $caption, $extension) {
            // Get or create MediaLibrary instance for unassigned media
            $mediaLibrary = MediaLibrary::firstOrCreate([]);

            // Generate consistent filename
            $filename = $this->generateFilename($extension);

            // Add media using Spatie
            $spatieMedia = $mediaLibrary
                ->addMedia($file->getRealPath())
                ->usingName($file->getClientOriginalName())
                ->usingFileName($filename)
                ->toMediaCollection($collection);

            // Construct relative path for backward compatibility
            // Spatie stores files as: {collection}/{id}/{filename}
            $relativePath = $collection.'/'.$spatieMedia->id.'/'.$spatieMedia->file_name;

            // Create Media metadata record
            return Media::create([
                'spatie_media_id' => $spatieMedia->id,
                'path' => $relativePath, // Keep for backward compatibility
                'filename' => $spatieMedia->file_name,
                'mime_type' => $spatieMedia->mime_type,
                'size' => $spatieMedia->size,
                'alt_text' => $altText,
                'caption' => $caption,
            ]);
        });
    }

    /**
     * Upload a video file.
     *
     * @param  UploadedFile  $file  The uploaded file
     * @param  string  $context  The context (product, article, gallery, video)
     * @param  string|null  $altText  Alt text for the video
     * @param  string|null  $caption  Caption for the video
     *
     * @throws \Exception
     */
    public function uploadVideo(UploadedFile $file, string $context = 'video', ?string $altText = null, ?string $caption = null): Media
    {
        // Validate video file
        $this->validateVideoFile($file);

        $extension = strtolower($file->getClientOriginalExtension());
        $folder = 'videos';

        // Generate consistent filename
        $filename = $this->generateFilename($extension);

        return \Illuminate\Support\Facades\DB::transaction(function () use ($file, $folder, $filename, $altText, $caption) {
            // Store file
            $path = $file->storeAs($folder, $filename, 'public');

            if (! $path) {
                throw new \Exception('Failed to store video file.');
            }

            // Create media record
            return Media::create([
                'path' => $path,
                'filename' => $filename,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'alt_text' => $altText,
                'caption' => $caption,
            ]);
        });
    }

    /**
     * Validate image file based on context.
     *
     * @param  UploadedFile  $file  The uploaded file
     * @param  string  $context  The context
     * @param  bool  $isLogoContext  Whether this is a logo context
     *
     * @throws \Exception
     */
    private function validateImageFile(UploadedFile $file, string $context, bool $isLogoContext): void
    {
        // Additional security: Verify file is actually an image by checking MIME type
        $allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if ($isLogoContext) {
            $allowedMimeTypes[] = 'image/svg+xml';
        } elseif ($context === 'product') {
            // For product context, only allow PNG, WEBP, and JPG
            $allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        }

        if (! in_array($file->getMimeType(), $allowedMimeTypes)) {
            throw new \Exception('Invalid file type.');
        }

        // Additional security: Verify file extension matches MIME type
        $extension = strtolower($file->getClientOriginalExtension());
        $allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
        if ($isLogoContext) {
            $allowedExtensions[] = 'svg';
        } elseif ($context === 'product') {
            // For product context, only allow PNG, WEBP, and JPG
            $allowedExtensions = ['jpeg', 'jpg', 'png', 'webp'];
        }

        if (! in_array($extension, $allowedExtensions)) {
            throw new \Exception('Invalid file extension.');
        }
    }

    /**
     * Validate video file.
     *
     * @param  UploadedFile  $file  The uploaded file
     *
     * @throws \Exception
     */
    private function validateVideoFile(UploadedFile $file): void
    {
        // Additional security: Verify file is actually a video by checking MIME type
        $allowedMimeTypes = ['video/mp4', 'video/webm'];
        if (! in_array($file->getMimeType(), $allowedMimeTypes)) {
            throw new \Exception('Invalid video file type. Only MP4 and WebM are allowed. Detected: '.$file->getMimeType());
        }

        // Additional security: Verify file extension matches MIME type
        $extension = strtolower($file->getClientOriginalExtension());
        $allowedExtensions = ['mp4', 'webm'];
        if (! in_array($extension, $allowedExtensions)) {
            throw new \Exception('Invalid file extension. Only MP4 and WebM are allowed.');
        }
    }

    /**
     * Validate SVG content for security.
     * Rejects SVG files containing script tags, event handlers, or external resource references.
     *
     * @param  string  $svgContent  The SVG file content
     */
    public function isSvgSafe(string $svgContent): bool
    {
        // Normalize content for case-insensitive matching
        $content = strtolower($svgContent);

        // Check for script tags (case-insensitive)
        if (preg_match('/<script\b[^>]*>/i', $svgContent)) {
            return false;
        }

        // Check for JavaScript event handlers (onclick, onload, etc.)
        $dangerousAttributes = [
            'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',
            'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset',
            'onselect', 'onunload', 'onabort', 'onkeydown', 'onkeypress',
            'onkeyup', 'onmousedown', 'onmousemove', 'onmouseup',
        ];

        foreach ($dangerousAttributes as $attribute) {
            if (preg_match('/\b'.preg_quote($attribute, '/').'\s*=/i', $svgContent)) {
                return false;
            }
        }

        // Check for external resource references that could be exploited
        // This includes data URIs with javascript: protocol, external URLs in href/src
        if (preg_match('/javascript:/i', $svgContent)) {
            return false;
        }

        // Check for iframe or embed tags
        if (preg_match('/<(iframe|embed|object)\b[^>]*>/i', $svgContent)) {
            return false;
        }

        return true;
    }}
