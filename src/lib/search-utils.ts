import React from 'react';
import { ChatSession } from '@/types';

/**
 * Normalizes string for case-insensitive and diacritic-tolerant comparison
 * supporting both English and Bangla scripts.
 */
export function normalizeSearchString(str: string): string {
    return (str || '').toLowerCase().trim();
}

/**
 * Evaluates whether a chat session matches a search query across title or metadata.
 */
export function matchesChatQuery(chat: ChatSession, query: string): boolean {
    if (!query) return true;
    const q = normalizeSearchString(query);
    const title = normalizeSearchString(chat.title);
    const projectId = normalizeSearchString(chat.projectId || '');

    return title.includes(q) || projectId.includes(q);
}

/**
 * Chunks text into highlighted match parts and plain text spans.
 */
export function highlightMatch(text: string, query: string): React.ReactNode {
    if (!query || !query.trim()) return text;

    const trimmedQuery = query.trim();
    const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
        if (part.toLowerCase() === trimmedQuery.toLowerCase()) {
            return React.createElement(
                'span',
                {
                    key: index,
                    className: 'bg-kleava-accent/20 text-kleava-text-primary rounded-[2px] px-0.5 font-medium',
                },
                part
            );
        }
        return part;
    });
}