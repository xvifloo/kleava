/**
 * Strips code blocks, markdown tags, and special symbols to produce
 * natural, clean plain-text suitable for Text-to-Speech playback.
 */
export function extractCleanSpeechText(markdown: string): string {
    if (!markdown) return '';

    return markdown
        // 1. Remove fenced code blocks completely
        .replace(/```[\s\S]*?```/g, '')
        // 2. Remove inline code snippets
        .replace(/`([^`]+)`/g, '$1')
        // 3. Remove markdown headers (#, ##, etc.)
        .replace(/^#{1,6}\s+/gm, '')
        // 4. Remove blockquotes
        .replace(/^>\s+/gm, '')
        // 5. Remove list markers (*, -, 1.)
        .replace(/^[\s]*[-*+]\s+/gm, '')
        .replace(/^[\s]*\d+\.\s+/gm, '')
        // 6. Convert links [text](url) to just text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // 7. Remove bold/italic markers
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        // 8. Normalize spacing
        .replace(/\n+/g, ' ')
        .trim();
}

/**
 * Validates external URLs to prevent malformed or unsafe link navigation.
 */
export function isSafeUrl(url: string): boolean {
    try {
        const parsed = new URL(url, 'https://kleava.ai');
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}