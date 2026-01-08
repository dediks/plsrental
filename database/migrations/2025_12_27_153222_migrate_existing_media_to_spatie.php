<?php

use App\Models\Media;
use App\Models\Product;
use App\Models\Article;
use App\Models\MediaLibrary;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get or create MediaLibrary instance for unassigned media
        $mediaLibrary = MediaLibrary::firstOrCreate([]);

        // Get all existing media records
        $mediaRecords = Media::whereNull('spatie_media_id')->get();

        foreach ($mediaRecords as $mediaRecord) {
            // Use DB transaction for each record to prevent one failure from aborting all
            DB::transaction(function () use ($mediaRecord, $mediaLibrary) {
                try {
                    // Check if file exists
                    if (! $this->fileExists($mediaRecord->path)) {
                        Log::warning("Media file not found: {$mediaRecord->path}");

                        return;
                    }

                    // Skip non-image files (videos, etc.) - we only need responsive images for images
                    $mimeType = $mediaRecord->mime_type ?? mime_content_type(Storage::disk('public')->path($mediaRecord->path));
                    if ($mimeType && ! str_starts_with($mimeType, 'image/')) {
                        Log::info("Skipping non-image file: {$mediaRecord->path} (mime: {$mimeType})");

                        return;
                    }

                    // Determine the model to attach to
                    $model = null;
                    $collection = 'default';

                    if ($mediaRecord->galleryable_id && $mediaRecord->galleryable_type) {
                        // Try to find the model
                        if ($mediaRecord->galleryable_type === Product::class) {
                            $model = Product::find($mediaRecord->galleryable_id);
                            $collection = $mediaRecord->is_featured ? 'images' : 'gallery';
                        } elseif ($mediaRecord->galleryable_type === Article::class) {
                            $model = Article::find($mediaRecord->galleryable_id);
                            $collection = 'images';
                        }
                    }

                    // If no model found, use MediaLibrary
                    if (! $model) {
                        $model = $mediaLibrary;
                        // Determine collection based on path
                        if (str_contains($mediaRecord->path, 'logos')) {
                            $collection = 'logos';
                        } elseif (str_contains($mediaRecord->path, 'gallery')) {
                            $collection = 'gallery';
                        } else {
                            $collection = 'default';
                        }
                    }

                    // Get full file path
                    $filePath = Storage::disk('public')->path($mediaRecord->path);

                    if (! file_exists($filePath)) {
                        Log::warning("Media file path does not exist: {$filePath}");

                        return;
                    }

                    // Add media using Spatie
                    $spatieMedia = $model
                        ->addMedia($filePath)
                        ->usingName($mediaRecord->filename)
                        ->usingFileName($mediaRecord->filename)
                        ->withCustomProperties([
                            'alt_text' => $mediaRecord->alt_text,
                            'caption' => $mediaRecord->caption,
                            'order' => $mediaRecord->order,
                            'is_featured' => $mediaRecord->is_featured,
                        ])
                        ->toMediaCollection($collection);

                    // Update Media record with Spatie media ID
                    $mediaRecord->update([
                        'spatie_media_id' => $spatieMedia->id,
                    ]);

                    Log::info("Migrated media ID {$mediaRecord->id} to Spatie media ID {$spatieMedia->id}");
                } catch (\Exception $e) {
                    Log::error("Error migrating media ID {$mediaRecord->id}: ".$e->getMessage());
                    throw $e; // Re-throw to rollback this transaction
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove spatie_media_id from all media records
        // Note: This will not delete Spatie media records, just unlink them
        Media::whereNotNull('spatie_media_id')->update(['spatie_media_id' => null]);
    }

    /**
     * Check if file exists in storage.
     */
    private function fileExists(string $path): bool
    {
        try {
            return Storage::disk('public')->exists($path);
        } catch (\Exception $e) {
            return false;
        }
    }
};
