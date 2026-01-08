<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BatchDestroyMediaRequest;
use App\Http\Requests\Admin\UpdateMediaRequest;
use App\Models\Media;
use App\Services\MediaService;
use App\Services\MediaUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function __construct(
        protected MediaUploadService $uploadService
    ) {}

    /**
     * Upload a new media file.
     */
    public function upload(Request $request)
    {
        $context = $request->input('context', 'product');
        $isLogoContext = $context === 'logo';

        // Build validation rules based on context
        $imageRules = [
            'required',
            'max:5120', // 5MB max
        ];

        if ($isLogoContext) {
            // For logos, allow SVG in addition to standard image formats
            $imageRules[] = 'mimes:jpeg,jpg,png,gif,webp,svg';
        } elseif ($context === 'product') {
            // For product context, only allow PNG, WEBP, and JPG
            $imageRules[] = 'image';
            $imageRules[] = 'mimes:jpeg,jpg,png,webp';
            $imageRules[] = 'dimensions:max_width=5000,max_height=5000';
        } else {
            // For other contexts, allow standard image formats with dimensions
            $imageRules[] = 'image';
            $imageRules[] = 'mimes:jpeg,jpg,png,gif,webp';
            $imageRules[] = 'dimensions:max_width=5000,max_height=5000';
        }

        // Validate file upload with strict security checks
        $validated = $request->validate([
            'image' => $imageRules,
            'context' => 'nullable|string|in:product,article,gallery,logo',
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:500',
        ], [
            'image.required' => 'Please select an image to upload.',
            'image.max' => $context === 'gallery'
                ? 'Hero background images must not exceed 5MB. Please compress your image and try again.'
                : 'Image size must not exceed 5MB. Please compress your image and try again.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'Invalid image format. Allowed formats: JPEG, PNG, GIF, WEBP.',
            'image.dimensions' => 'Image dimensions must not exceed 5000x5000 pixels.',
        ]);

        try {
            $file = $request->file('image');
            $media = $this->uploadService->uploadImage(
                $file,
                $context,
                $request->input('alt_text'),
                $request->input('caption')
            );

            return response()->json([
                'success' => true,
                'media' => array_merge(
                    MediaService::formatSingleMedia($media),
                    ['order' => $media->order ?? 0, 'is_featured' => $media->is_featured ?? false]
                ),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Upload a new video file.
     */
    public function uploadVideo(Request $request)
    {
        try {
            // Check if file was uploaded
            if (! $request->hasFile('video')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No video file uploaded.',
                    'errors' => ['video' => ['No video file was provided.']],
                ], 422);
            }

            // Check for upload errors
            $file = $request->file('video');
            if (! $file->isValid()) {
                $error = $file->getError();
                $errorMessage = match ($error) {
                    UPLOAD_ERR_INI_SIZE => 'The video exceeds the server upload limit.',
                    UPLOAD_ERR_FORM_SIZE => 'The video exceeds the form upload limit.',
                    UPLOAD_ERR_PARTIAL => 'The video was only partially uploaded.',
                    UPLOAD_ERR_NO_FILE => 'No video was uploaded.',
                    UPLOAD_ERR_NO_TMP_DIR => 'Server error: Missing temporary folder.',
                    UPLOAD_ERR_CANT_WRITE => 'Server error: Failed to write file to disk.',
                    UPLOAD_ERR_EXTENSION => 'Server error: A PHP extension stopped the file upload.',
                    default => 'Unknown upload error occurred.',
                };

                return response()->json([
                    'success' => false,
                    'message' => $errorMessage,
                    'errors' => ['video' => [$errorMessage]],
                ], 422);
            }

            // Validate video upload with strict security checks
            $validated = $request->validate([
                'video' => [
                    'required',
                    'file',
                    'mimes:mp4,webm',
                    'max:20480', // 20MB max - ideal for hero background videos
                ],
                'context' => 'nullable|string|in:product,article,gallery,video',
                'alt_text' => 'nullable|string|max:255',
                'caption' => 'nullable|string|max:500',
            ]);

            $media = $this->uploadService->uploadVideo(
                $file,
                $request->input('context', 'video'),
                $request->input('alt_text'),
                $request->input('caption')
            );

            return response()->json([
                'success' => true,
                'media' => array_merge(
                    MediaService::formatSingleMedia($media),
                    [
                        'order' => $media->order ?? 0,
                        'is_featured' => $media->is_featured ?? false,
                    ]
                ),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed: '.$e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Video upload error: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while uploading the video: '.$e->getMessage(),
                'errors' => ['video' => [$e->getMessage()]],
            ], 500);
        }
    }

    /**
     * Update media metadata.
     */
    public function update(UpdateMediaRequest $request, Media $media)
    {
        // Verify user can access this media
        if (! MediaService::canAccessMedia($media)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this media.',
            ], 403);
        }

        $media->update($request->validated());

        return response()->json([
            'success' => true,
            'media' => MediaService::formatSingleMedia($media->fresh()),
        ]);
    }

    /**
     * Delete a media file.
     */
    public function destroy(Media $media)
    {
        // Verify user can access this media
        if (! MediaService::canAccessMedia($media)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this media.',
            ], 403);
        }

        // Check if media is currently assigned to a product or other model
        if (MediaService::isMediaInUse($media)) {
            $usageInfo = MediaService::getMediaUsageInfo($media);

            if ($usageInfo) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot delete media: This image is currently used by a {$usageInfo['type']} ({$usageInfo['name']}).",
                ], 422);
            }
        }

        // File deletion is handled by model event
        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Media deleted successfully.',
        ]);
    }

    /**
     * Batch delete media files.
     */
    public function batchDestroy(BatchDestroyMediaRequest $request)
    {
        $ids = $request->validated()['ids'];
        $deletedCount = 0;
        $errors = [];

        foreach ($ids as $id) {
            $media = Media::find($id);

            if (! $media) {
                $errors[] = "Media with ID {$id} not found.";

                continue;
            }

            // Verify user can access this media
            if (! MediaService::canAccessMedia($media)) {
                $errors[] = "Unauthorized to delete media with ID {$id}.";

                continue;
            }

            // Check if media is currently assigned to a product or other model
            if (MediaService::isMediaInUse($media)) {
                $usageInfo = MediaService::getMediaUsageInfo($media);

                if ($usageInfo) {
                    $errors[] = "Media with ID {$id} is currently used by a {$usageInfo['type']} ({$usageInfo['name']}).";

                    continue;
                }
            }

            // File deletion is handled by model event
            $media->delete();
            $deletedCount++;
        }

        if ($deletedCount === 0) {
            return response()->json([
                'success' => false,
                'message' => 'No media items were deleted.',
                'errors' => $errors,
            ], 400);
        }

        $message = $deletedCount === 1
            ? '1 media item deleted successfully.'
            : "{$deletedCount} media items deleted successfully.";

        return response()->json([
            'success' => true,
            'message' => $message,
            'deleted_count' => $deletedCount,
            'errors' => $errors,
        ]);
    }

    /**
     * Get media list (for selector/search or management page).
     */
    public function index(Request $request)
    {
        $query = Media::query()->with('galleryable');

        // Search by filename or alt_text (case-insensitive)
        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(filename) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(alt_text) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(caption) LIKE ?', ["%{$search}%"]);
            });
        }

        // Filter by context (galleryable_type)
        if ($request->has('type') && $request->type) {
            $query->where('galleryable_type', $request->type);
        }

        // Filter by unassigned (no galleryable, excluding logos)
        if ($request->has('unassigned') && $request->unassigned) {
            $query->whereNull('galleryable_id')
                ->where('path', 'not like', 'logos/%');
        }

        $media = $query->orderBy('created_at', 'desc')->paginate(20);

        // Get count of unused media (unassigned, excluding logos which are used in settings)
        $unusedMediaCount = Media::whereNull('galleryable_id')
            ->where('path', 'not like', 'logos/%')
            ->count();

        // Check if it's an Inertia request (page navigation)
        $isInertiaRequest = $request->header('X-Inertia') !== null ||
                           $request->header('X-Inertia-Version') !== null;

        // If it's NOT an Inertia request but wants JSON (for MediaSelector API), return JSON
        if (! $isInertiaRequest && ($request->wantsJson() || $request->ajax())) {
            // Format media for frontend using service (get collection from paginator)
            $formattedMedia = MediaService::formatMediaForFrontend($media->getCollection());

            return response()->json([
                'data' => $formattedMedia,
                'current_page' => $media->currentPage(),
                'last_page' => $media->lastPage(),
                'per_page' => $media->perPage(),
                'total' => $media->total(),
            ]);
        }

        // Otherwise, return Inertia page for media management
        // Format media items
        $formattedMedia = $media->getCollection()->map(function ($item) {
            return [
                'id' => $item->id,
                'filename' => $item->filename,
                'path' => $item->path,
                'url' => $item->url,
                'alt_text' => $item->alt_text,
                'caption' => $item->caption,
                'mime_type' => $item->mime_type,
                'size' => $item->size,
                'order' => $item->order,
                'is_featured' => $item->is_featured,
                'galleryable_type' => $item->galleryable_type,
                'galleryable_id' => $item->galleryable_id,
                'galleryable' => $item->galleryable ? [
                    'id' => $item->galleryable->id,
                    'name' => $item->galleryable->name ?? $item->galleryable->title ?? null,
                ] : null,
                'created_at' => $item->created_at?->toDateTimeString(),
            ];
        });

        return Inertia::render('admin/media/Index', [
            'media' => [
                'data' => $formattedMedia,
                'current_page' => $media->currentPage(),
                'last_page' => $media->lastPage(),
                'per_page' => $media->perPage(),
                'total' => $media->total(),
                'from' => $media->firstItem(),
                'to' => $media->lastItem(),
                'links' => $media->linkCollection()->toArray(),
            ],
            'filters' => $request->only(['search', 'type', 'unassigned']),
            'unusedMediaCount' => $unusedMediaCount,
        ]);
    }
}
