import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Upload, X, Loader2, Video as VideoIcon, Play } from 'lucide-react';
import { useState, useEffect, useId, useRef } from 'react';

interface VideoItem {
    id: number;
    path: string;
    url: string;
    mime_type?: string;
    size?: number;
    duration?: number;
}

interface VideoSelectorProps {
    value?: VideoItem | null;
    onChange: (value: VideoItem | null) => void;
    error?: string;
    label?: string;
    description?: string;
}

export function VideoSelector({
    value = null,
    onChange,
    error,
    label,
    description,
}: VideoSelectorProps) {
    const uniqueId = useId();
    const uploadInputId = `video-upload-input-${uniqueId}`;
    const [video, setVideo] = useState<VideoItem | null>(value);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Update video when value changes
    useEffect(() => {
        setVideo(value);
    }, [value]);

    const getCsrfToken = () => {
        const name = 'XSRF-TOKEN';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        }
        return '';
    };

    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return 'Unknown size';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
    };

    const formatDuration = (seconds?: number): string => {
        if (!seconds) return 'Unknown duration';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        setUploadError(null);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('video', file);

            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    setUploadProgress(percentComplete);
                }
            });

            // Handle completion
            const uploadPromise = new Promise((resolve, reject) => {
                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            resolve(data);
                        } catch (err) {
                            reject(new Error('Failed to parse response'));
                        }
                    } else {
                        try {
                            const errorData = JSON.parse(xhr.responseText);
                            // Extract detailed error message
                            let errorMessage = errorData.message || 'Upload failed';
                            
                            // If there are validation errors, include them
                            if (errorData.errors) {
                                const errorMessages = Object.values(errorData.errors).flat();
                                if (errorMessages.length > 0) {
                                    errorMessage = errorMessages.join(' ');
                                }
                            }
                            
                            reject(new Error(errorMessage));
                        } catch (err) {
                            reject(new Error(`Upload failed with status ${xhr.status}`));
                        }
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error during upload'));
                });

                xhr.addEventListener('abort', () => {
                    reject(new Error('Upload cancelled'));
                });
            });

            xhr.open('POST', '/dashboard/admin/media/upload-video');
            xhr.setRequestHeader('X-XSRF-TOKEN', getCsrfToken());
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.withCredentials = true;
            xhr.send(formData);

            const data: any = await uploadPromise;

            // Ensure URL is properly formatted
            let videoUrl = data.media.url;
            if (!videoUrl && data.media.path) {
                videoUrl = data.media.path.startsWith('/storage/')
                    ? data.media.path
                    : '/storage/' + data.media.path.replace(/^\//, '');
            }

            const newVideoItem: VideoItem = {
                id: data.media.id,
                path: data.media.path,
                url: videoUrl || data.media.path,
                mime_type: data.media.mime_type,
                size: data.media.size,
                duration: data.media.duration,
            };

            setVideo(newVideoItem);
            onChange(newVideoItem);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload video';
            setUploadError(errorMessage);
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['video/mp4', 'video/webm'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please select a valid video file (MP4 or WebM only)');
            return;
        }

        // Validate file size (20MB - optimal for background videos)
        if (file.size > 20 * 1024 * 1024) {
            setUploadError('Video size must be less than 20MB. Tip: Compress your video for web use.');
            return;
        }

        // Check if already has video
        if (video) {
            setUploadError('Please remove the current video before uploading a new one');
            return;
        }

        // Upload file
        uploadFile(file);

        // Reset input
        e.target.value = '';
    };

    const handleRemove = () => {
        setVideo(null);
        onChange(null);
    };

    return (
        <div className="space-y-2">
            {label && (
                <div className="space-y-1">
                    <Label>{label}</Label>
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
            )}

            {/* Video Recommendations */}
            {!video && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm font-medium mb-2">Video Recommendations:</p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>
                            <strong>Format:</strong> MP4 or WebM (H.264 codec recommended for MP4)
                        </li>
                        <li>
                            <strong>Resolution:</strong> 1920x1080 (Full HD) or 1280x720 (HD)
                        </li>
                        <li>
                            <strong>File Size:</strong> Under 20MB (3-5MB recommended for best performance)
                        </li>
                        <li>
                            <strong>Duration:</strong> 10-30 seconds for background loops
                        </li>
                        <li>
                            <strong>Aspect Ratio:</strong> 16:9 (landscape) recommended
                        </li>
                        <li>
                            <strong>Fallback:</strong> Provide a background image as fallback
                        </li>
                    </ul>
                </div>
            )}

            {/* Upload Button */}
            {!video && (
                <div className="mb-4">
                    <Input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={handleFileChange}
                        className="hidden"
                        id={uploadInputId}
                        disabled={uploading}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById(uploadInputId)?.click()}
                        disabled={uploading}
                        className="w-full"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading... {uploadProgress > 0 && `${Math.round(uploadProgress)}%`}
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Background Video
                            </>
                        )}
                    </Button>
                    {uploadError && (
                        <p className="text-sm text-destructive mt-2">{uploadError}</p>
                    )}
                </div>
            )}

            {/* Video Preview */}
            {video && (
                <div className="border rounded-lg overflow-hidden bg-muted/50">
                    <div className="relative aspect-video bg-black">
                        <video
                            ref={videoRef}
                            src={video.url}
                            className="w-full h-full object-cover"
                            controls
                            muted
                            loop
                        >
                            <source src={video.url} type={video.mime_type || 'video/mp4'} />
                            Your browser does not support the video tag.
                        </video>
                        
                        {/* Remove Button Overlay */}
                        <div className="absolute top-2 right-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleRemove}
                                className="shadow-lg"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                            </Button>
                        </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-3 space-y-1 border-t">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">File Size:</span>
                            <span className="font-medium">{formatFileSize(video.size)}</span>
                        </div>
                        {video.duration && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-medium">{formatDuration(video.duration)}</span>
                            </div>
                        )}
                        {video.mime_type && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Type:</span>
                                <span className="font-medium">{video.mime_type}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <InputError message={error} />}
        </div>
    );
}

