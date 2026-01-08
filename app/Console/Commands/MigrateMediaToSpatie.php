<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\Media;
use App\Models\MediaLibrary;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MigrateMediaToSpatie extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'media:migrate-to-spatie {--dry-run : Run without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate existing media to Spatie Media Library and generate WebP conversions';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->info('DRY RUN MODE - No changes will be made');
        }

        // Get or create MediaLibrary instance for unassigned media
        $mediaLibrary = MediaLibrary::firstOrCreate([]);

        // Get all existing media records without Spatie media
        $mediaRecords = Media::whereNull('spatie_media_id')->get();

        $this->info("Found {$mediaRecords->count()} media records to migrate");

        $successCount = 0;
        $errorCount = 0;
        $skippedCount = 0;

        $progressBar = $this->output->createProgressBar($mediaRecords->count());
        $progressBar->start();

        foreach ($mediaRecords as $mediaRecord) {
            try {
                // Check if file exists
                if (! $this->fileExists($mediaRecord->path)) {
                    Log::warning("Media file not found: {$mediaRecord->path}");
                    $skippedCount++;
                    $progressBar->advance();

                    continue;
                }

                // Skip non-image files (videos, etc.)
                $mimeType = $mediaRecord->mime_type ?? mime_content_type(Storage::disk('public')->path($mediaRecord->path));
                if ($mimeType && ! str_starts_with($mimeType, 'image/')) {
                    Log::info("Skipping non-image file: {$mediaRecord->path} (mime: {$mimeType})");
                    $skippedCount++;
                    $progressBar->advance();

                    continue;
                }

                // Determine the model to attach to
                $model = null;
                $collection = 'default';

                // if ($mediaRecord->galleryable_id && $mediaRecord->galleryable_type) {
                //     // Try to find the model
                //     if ($mediaRecord->galleryable_type === Product::class) {
                //         $model = Product::find($mediaRecord->galleryable_id);
                //         $collection = $mediaRecord->is_featured ? 'images' : 'gallery';
                //     } elseif ($mediaRecord->galleryable_type === Article::class) {
                //         $model = Article::find($mediaRecord->galleryable_id);
                //         $collection = 'images';
                //     }
                // }

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
                    $skippedCount++;
                    $progressBar->advance();

                    continue;
                }

                if (! $dryRun) {
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
                }

                $successCount++;
            } catch (\Exception $e) {
                Log::error("Error migrating media ID {$mediaRecord->id}: ".$e->getMessage());
                $this->error("\nError migrating media ID {$mediaRecord->id}: ".$e->getMessage());
                $errorCount++;
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info('Migration complete!');
        $this->info("  Success: {$successCount}");
        $this->info("  Skipped: {$skippedCount}");
        $this->info("  Errors: {$errorCount}");

        return Command::SUCCESS;
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
}
