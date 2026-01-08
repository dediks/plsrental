/**
 * Determine video MIME type based on file extension
 */
export function getVideoMimeType(videoUrl: string): string {
    const url = videoUrl.toLowerCase();
    if (url.endsWith('.webm')) {
        return 'video/webm';
    }
    // Default to mp4
    return 'video/mp4';
}

