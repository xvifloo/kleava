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
 * Filter memories for Settings management UI (search & categories).
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

    return memories.filter((mem) => {
        // 1. Search Query Match
        const matchesQuery =
            !query ||
            mem.title.toLowerCase().includes(query) ||
            mem.content.toLowerCase().includes(query);

        // 2. Scope Filter Match
        const matchesScope = scopeFilter === 'All' || mem.scope === scopeFilter;

        // 3. Category Filter Match
        const matchesCategory = categoryFilter === 'All' || mem.category === categoryFilter;

        return matchesQuery && matchesScope && matchesCategory;
    });
}

/**
 * Deterministic memory retrieval boundary for AI Prompt compilation.
 * Ready for future vector search / embedding integrations.
 */
export function getRelevantMemories({
    useMemory,
    memories,
    activeProjectId,
    activeChatId,
}: {
    useMemory: boolean;
    memories: MemoryRecord[];
    activeProjectId?: string;
    activeChatId?: string;
}): MemoryRecord[] {
    if (!useMemory) return [];

    return memories.filter((mem) => {
        if (!mem.enabled) return false;

        // Global memory applies everywhere
        if (mem.scope === 'Global') return true;

        // Project scope applies to current project
        if (mem.scope === 'Project' && activeProjectId && mem.projectId === activeProjectId) {
            return true;
        }

        // Chat scope applies strictly to active chat session
        if (mem.scope === 'Chat' && activeChatId && mem.chatId === activeChatId) {
            return true;
        }

        return false;
    });
}