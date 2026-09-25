import {
    MemoryRecord,
    SelectedContextMemory,
    CandidateMemorySuggestion,
    MemoryCategory,
    MemoryScope,
} from '@/types';

export interface MemoryEngineInput {
    conversationId: string;
    projectId?: string;
    userMessage: string;
    memories: MemoryRecord[];
    useMemory: boolean;
    maxLimit?: number;
}

/**
 * Tokenizes text for deterministic keyword-matching heuristic.
 */
function extractKeywords(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s\u0980-\u09FF]/gi, ' ')
        .split(/\s+/)
        .filter((word) => word.length >= 3);
}

/**
 * Evaluates deterministic relevance score for an applicable memory item.
 */
function calculateRelevanceScore(
    mem: MemoryRecord,
    userTokens: string[],
    conversationId: string,
    projectId?: string
): { score: number; reason: string } {
    let score = 0;
    const reasons: string[] = [];

    // 1. Scope-based base priority
    if (mem.scope === 'Conversation' && mem.chatId === conversationId) {
        score += 40;
        reasons.push('Active conversation scope (+40)');
    } else if (mem.scope === 'Project' && mem.projectId === projectId) {
        score += 25;
        reasons.push('Active project scope (+25)');
    } else if (mem.scope === 'Global') {
        score += 10;
        reasons.push('Global scope (+10)');
    }

    // 2. Pinned modifier
    if (mem.pinned) {
        score += 30;
        reasons.push('Pinned priority (+30)');
    }

    // 3. Usage policy
    if (mem.usage === 'always') {
        score += 50;
        reasons.push('Usage: Always (+50)');
    }

    // 4. Keyword / Heuristic Overlap
    const memTokens = extractKeywords(`${mem.title} ${mem.content} ${(mem.tags || []).join(' ')}`);
    const matchedTokens = userTokens.filter((token) => memTokens.includes(token));

    if (matchedTokens.length > 0) {
        const tokenScore = Math.min(matchedTokens.length * 15, 60);
        score += tokenScore;
        reasons.push(`Keywords matched: [${matchedTokens.slice(0, 3).join(', ')}] (+${tokenScore})`);
    }

    // 5. Recency modifier (updated within last 24h)
    const isRecent = Date.now() - new Date(mem.updatedAt).getTime() < 86400000;
    if (isRecent) {
        score += 5;
        reasons.push('Recently updated (+5)');
    }

    return { score, reason: reasons.join(', ') || 'Default matching' };
}

/**
 * Memory Context Engine: Resolves, scores, and prioritizes applicable memories
 * strictly adhering to Global, Project, and Conversation boundary constraints.
 */
export function resolveConversationMemoryContext({
    conversationId,
    projectId,
    userMessage,
    memories,
    useMemory,
    maxLimit = 6,
}: MemoryEngineInput): SelectedContextMemory[] {
    if (!useMemory || !memories || memories.length === 0) return [];

    // 1. Strict Scope Filtering
    const eligibleMemories = memories.filter((mem) => {
        if (!mem.enabled) return false;
        if (mem.usage === 'never') return false;

        if (mem.scope === 'Global') return true;
        if (mem.scope === 'Project' && projectId && mem.projectId === projectId) return true;
        if (mem.scope === 'Conversation' && mem.chatId === conversationId) return true;

        return false;
    });

    if (eligibleMemories.length === 0) return [];

    // 2. Deterministic Relevance Evaluation
    const userTokens = extractKeywords(userMessage);

    const scoredMemories: SelectedContextMemory[] = eligibleMemories.map((mem) => {
        const { score, reason } = calculateRelevanceScore(mem, userTokens, conversationId, projectId);

        return {
            memoryId: mem.id,
            title: mem.title,
            content: mem.content,
            type: mem.type || 'Preference',
            scope: mem.scope,
            priorityScore: score,
            reason,
            source: mem.source,
        };
    });

    // 3. Deterministic Sorting: Highest priority score first, stable ID tie-breaker
    scoredMemories.sort((a, b) => {
        if (b.priorityScore !== a.priorityScore) {
            return b.priorityScore - a.priorityScore;
        }
        return a.memoryId.localeCompare(b.memoryId);
    });

    return scoredMemories.slice(0, maxLimit);
}

/**
 * Assembles a structured, isolated memory context envelope for AI prompt injection.
 * Ensures memory text is cleanly demarcated and not treated as trusted executable code.
 */
export function assembleStructuredMemoryContext(
    selectedMemories: SelectedContextMemory[]
): string {
    if (!selectedMemories || selectedMemories.length === 0) return '';

    const entries = selectedMemories
        .map(
            (m, idx) =>
                `[Memory Record ${idx + 1}] (${m.type} | Scope: ${m.scope})\nContent: ${m.content.trim()}`
        )
        .join('\n\n');

    return `\n\n=== RELEVANT CONTEXT & USER RULES ===\n${entries}\n=====================================\n`;
}

/**
 * Automatic Memory Candidate Detection Heuristic.
 * Scans outgoing user messages for intentional preference or rule declarations.
 * Requires user confirmation before any permanent storage.
 */
export function detectCandidateMemories(
    userMessage: string,
    conversationId: string
): CandidateMemorySuggestion | null {
    const trimmed = userMessage.trim();
    if (trimmed.length < 12 || trimmed.length > 280) return null;

    const lower = trimmed.toLowerCase();

    // Pattern detection for preference declarations
    const preferencePatterns = [
        /^(?:i prefer|please always|always remember|remember that|my preference is)\s+(.+)/i,
        /^(?:আমার পছন্দ|সবসময় মনে রাখবেন|মনে রাখবে)\s+(.+)/i,
    ];

    for (const pattern of preferencePatterns) {
        const match = trimmed.match(pattern);
        if (match && match[1]) {
            const extractedContent = match[1].trim();
            if (extractedContent.length >= 6) {
                return {
                    id: `cand_${Date.now()}`,
                    content: extractedContent,
                    suggestedType: 'Preference' as MemoryCategory,
                    suggestedScope: 'Global' as MemoryScope,
                    confidence: 0.85,
                    sourceConversationId: conversationId,
                    tags: ['preference', 'user-rule'],
                };
            }
        }
    }

    // Pattern detection for project instructions
    if (lower.includes('for this project') || lower.includes('এই প্রজেক্টে') || lower.includes('in our code standard')) {
        return {
            id: `cand_${Date.now()}`,
            content: trimmed,
            suggestedType: 'Instruction' as MemoryCategory,
            suggestedScope: 'Project' as MemoryScope,
            confidence: 0.75,
            sourceConversationId: conversationId,
            tags: ['instruction', 'project-rule'],
        };
    }

    return null;
}