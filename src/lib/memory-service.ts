import { MemoryRecord, MemoryScope, MemoryCategory } from '@/types';

export interface MemoryQueryParams {
    useMemory: boolean;
    memories: MemoryRecord[];
    searchQuery?: string;
    scopeFilter?: MemoryScope | 'All';
    categoryFilter?: MemoryCategory | 'All';
    activeProjectId?: string;
    activeChatId?: string;
}

/**
 * Filter memories for Settings management UI (search across title, content, tags, and category/scope filters).
 * Pinned memories are placed on top, followed by updatedAt descending.
 */
export function filterMemories({
    memories,
    searchQuery = '',
    scopeFilter = 'All',
    categoryFilter = 'All',
}: {
    memories: MemoryRecord[];
    searchQuery?: string;
    scopeFilter?: MemoryScope | 'All';
    categoryFilter?: MemoryCategory | 'All';
}): MemoryRecord[] {
    const query = searchQuery.trim().toLowerCase();

    const filtered = memories.filter((mem) => {
        // 1. Search Query Match
        const matchesQuery =
            !query ||
            mem.title.toLowerCase().includes(query) ||
            mem.content.toLowerCase().includes(query) ||
            mem.type.toLowerCase().includes(query) ||
            (mem.tags && mem.tags.some((t) => t.toLowerCase().includes(query)));

        // 2. Scope Filter Match
        const matchesScope = scopeFilter === 'All' || mem.scope === scopeFilter;

        // 3. Category Filter Match
        const matchesCategory = categoryFilter === 'All' || mem.type === categoryFilter;

        return matchesQuery && matchesScope && matchesCategory;
    });

    // Sort: Pinned items first, then by updatedAt descending
    return filtered.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
}

/**
 * Deterministic memory retrieval engine for active conversation context compilation.
 * Gathers enabled Global + active Project + active Conversation memories up to max limit.
 */
export function getRelevantMemories({
    useMemory,
    memories,
    activeProjectId,
    activeChatId,
    limit = 8,
}: {
    useMemory: boolean;
    memories: MemoryRecord[];
    activeProjectId?: string;
    activeChatId?: string;
    limit?: number;
}): MemoryRecord[] {
    if (!useMemory) return [];

    const eligible = memories.filter((mem) => {
        if (!mem.enabled) return false;

        // Global memory applies to all conversations
        if (mem.scope === 'Global') return true;

        // Project scope applies strictly to active project
        if (mem.scope === 'Project' && activeProjectId && mem.projectId === activeProjectId) {
            return true;
        }

        // Conversation scope applies strictly to active chat session
        if (mem.scope === 'Conversation' && activeChatId && mem.chatId === activeChatId) {
            return true;
        }

        return false;
    });

    // Prioritize pinned memories, then latest updated
    const sorted = eligible.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return sorted.slice(0, limit);
}

/**
 * Compiles a clean, provider-agnostic memory context prompt string.
 */
export function compileMemoryContext(memories: MemoryRecord[]): string {
    if (!memories || memories.length === 0) return '';

    const formattedRules = memories
        .map((m, idx) => `[${idx + 1}] (${m.type} - ${m.scope}): ${m.content}`)
        .join('\n');

    return `\n--- Relevant Context & User Preferences ---\n${formattedRules}\n------------------------------------------\n`;
}