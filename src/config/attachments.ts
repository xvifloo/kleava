/**
 * KLEAVA AI — ATTACHMENTS CONFIGURATION
 * Centralized boundaries for file validation, size limits, and security constraints.
 */

export const ATTACHMENT_CONFIG = {
    // Max individual file size: 20 MB
    maxFileSizeBytes: 20 * 1024 * 1024,
    maxFileSizeLabel: '20 MB',

    // Max attachments per prompt
    maxAttachmentsCount: 5,

    // Allowed image MIME types
    allowedImageTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ],

    // Disallowed dangerous executable extensions
    blockedExtensions: ['.exe', '.bat', '.cmd', '.sh', '.vbs', '.app', '.msi', '.com'],
} as const;

/**
 * Converts byte count into human-readable size string.
 * Examples: '450 B', '12 KB', '2.4 MB'
 */
export function formatFileSize(bytes: number): string {
    if (!bytes || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const formatted = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
    return `${formatted} ${units[i]}`;
}