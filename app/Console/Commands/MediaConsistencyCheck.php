<?php

namespace App\Console\Commands;

use App\Models\Media;
use App\Models\MediaLibrary;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MediaConsistencyCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'media:check-consistency {--fix : Attempt to fix simple issues}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for consistency between database media records and physical files';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting media consistency check...');

        $ghostRecords = 0;
        $orphanedSpatieRecords = 0;
        $validRecords = 0;

        // 1. Check Media Metadata vs Physical Files / Spatie Records
        $this->info('Checking Media Metadata records...');
        
        Media::chunk(100, function ($mediaItems) use (&$ghostRecords, &$orphanedSpatieRecords, &$validRecords) {
            foreach ($mediaItems as $media) {
                $isIssue = false;

                // Check Spatie Link
                if ($media->spatie_media_id) {
                    if (!$media->spatieMedia) {
                        $this->error("Media ID {$media->id}: Links to non-existent Spatie Media ID {$media->spatie_media_id}");
                        $orphanedSpatieRecords++;
                        $isIssue = true;
                    } elseif (!file_exists($media->spatieMedia->getPath())) {
                         // Note: Spatie's getPath() returns the absolute path
                        $this->error("Media ID {$media->id}: Spatie file missing at " . $media->spatieMedia->getPath());
                        $ghostRecords++;
                        $isIssue = true;
                    }
                } 
                // Check Legacy Path
                elseif ($media->path) {
                    $disk = Storage::disk('public');
                    // Remove /storage/ prefix for disk check if present
                    $relativePath = str_replace('/storage/', '', $media->path);
                    $relativePath = ltrim($relativePath, '/');

                    if (!$disk->exists($relativePath) && !str_starts_with($media->path, 'http')) {
                        $this->error("Media ID {$media->id}: Legacy file missing at {$media->path}");
                        $ghostRecords++;
                        $isIssue = true;
                    }
                }

                if (!$isIssue) {
                    $validRecords++;
                }
            }
        });

        $this->newLine();
        $this->info("Summary:");
        $this->info("Valid Records: {$validRecords}");
        if ($ghostRecords > 0) {
            $this->error("Ghost Records (File missing): {$ghostRecords}");
        }
        if ($orphanedSpatieRecords > 0) {
            $this->error("Orphaned Spatie Links (Metadata -> Missing Spatie DB Record): {$orphanedSpatieRecords}");
        }

        if ($ghostRecords === 0 && $orphanedSpatieRecords === 0) {
            $this->info('Media consistency check passed!');
        } else {
            $this->warn('Issues found. Please review the errors above.');
        }
    }
}
