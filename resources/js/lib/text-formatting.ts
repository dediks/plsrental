/**
 * Convert plain text with newlines to HTML with <br> tags.
 * Escapes HTML to prevent XSS attacks.
 */
export function formatPlainTextWithNewlines(value: string | undefined | null): string {
    if (!value) {
        return '';
    }
    
    // Ensure it's a string
    let str = String(value);
    
    // If the string already contains literal <br> tags (not HTML), convert them first
    // This handles cases where <br> was saved as literal text instead of newlines
    str = str.replace(/&lt;br&gt;/gi, '\n').replace(/<br\s*\/?>/gi, '\n');
    
    // First escape HTML to prevent XSS (do this after handling <br> tags)
    let escaped = str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Convert all types of line breaks to <br> tags
    // Handle \r\n (Windows), \n (Unix), and \r (old Mac) line breaks
    return escaped
        .replace(/\r\n/g, '<br>')
        .replace(/\r/g, '<br>')
        .replace(/\n/g, '<br>');
}

/**
 * Format specification key to readable title.
 * Converts snake_case or camelCase to Title Case.
 */
export function formatSpecKey(key: string): string {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

