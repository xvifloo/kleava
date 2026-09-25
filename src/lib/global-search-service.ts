import {
    ChatSession,
    ChatMessage,
    MemoryRecord,
    ModelProfile,
    GlobalSearchResult,
    SettingsSection,
} from '@/types';

export interface GlobalSearchInput {
    query: string;
    chats: ChatSession[];
    messages: ChatMessage[];
    memories: MemoryRecord[];
    models: ModelProfile[];
    isIncognito?: boolean;
}

const SEARCHABLE_SETTINGS: Array<{
    section: SettingsSection;
    title: string;
    keywords: string[];
}> = [
        { section: 'general', title: 'General (Theme, Language, Scale)', keywords: ['theme', 'dark', 'light', 'language', 'font', 'size', 'compact', 'autosave'] },
        { section: 'ai-models', title: 'AI Models & Providers', keywords: ['model', 'gpt', 'claude', 'gemini', 'temperature', 'streaming', 'reasoning', 'api key'] },
        { section: 'memory', title: 'Memory System & Rules', keywords: ['memory', 'knowledge', 'scope', 'rules', 'context', 'preference'] },
        { section: 'notifications', title: 'Notifications & Alerts', keywords: ['notification', 'alert', 'sound', 'audio', 'task'] },
        { section: 'personalization', title: 'Personalization & Tone', keywords: ['tone', 'style', 'emoji', 'technical', 'proactive', 'formatting'] },
        { section: 'privacy', title: 'Privacy & Data Controls', keywords: ['privacy', 'export', 'delete', 'telemetry', 'backup', 'clear'] },
        { section: 'shortcuts', title: 'Keyboard Shortcuts', keywords: ['shortcut', 'hotkey', 'keyboard', 'ctrl', 'cmd'] },
        { section: 'about', title: 'About Kleava AI', keywords: ['about', 'version', 'xvifloo', 'credits'] },
    ];

/**
 * Executes a fast, multi-category case-insensitive search across all accessible Kleava assets.
 */
export function executeGlobalSearch({
    query,
    chats,
    messages,
    memories,
    models,
    isIncognito = false,
}: GlobalSearchInput): Record<string, GlobalSearchResult[]> {
    const q = (query || '').trim().toLowerCase();
    if (!q) return {};

    const results: Record<string, GlobalSearchResult[]> = {
        Chats: [],
        Settings: [],
        'AI Models': [],
        Memories: [],
        Messages: [],
    };

    // 1. Search Chats (Titles & Projects)
    chats.forEach((chat) => {
        if (chat.title.toLowerCase().includes(q) || (chat.projectId && chat.projectId.toLowerCase().includes(q))) {
            results.Chats.push({
                id: `search_chat_${chat.id}`,
                category: 'Chats',
                title: chat.title,
                subtitle: chat.projectId ? `Project: ${chat.projectId}` : undefined,
                badge: chat.isArchived ? 'Archived' : chat.isPinned ? 'Pinned' : undefined,
                targetChatId: chat.id,
                isArchived: chat.isArchived,
            });
        }
    });

    // 2. Search Settings Sections
    SEARCHABLE_SETTINGS.forEach((item) => {
        if (
            item.title.toLowerCase().includes(q) ||
            item.keywords.some((k) => k.includes(q))
        ) {
            results.Settings.push({
                id: `search_setting_${item.section}`,
                category: 'Settings',
                title: item.title,
                subtitle: `Jump to Settings → ${item.section}`,
                targetSettingsSection: item.section,
            });
        }
    });

    // 3. Search AI Models
    models.forEach((m) => {
        if (
            m.name.toLowerCase().includes(q) ||
            m.provider.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q)
        ) {
            results['AI Models'].push({
                id: `search_model_${m.id}`,
                category: 'AI Models',
                title: m.name,
                subtitle: `${m.provider.toUpperCase()} • ${m.description}`,
                badge: m.badge,
                targetModelId: m.id,
            });
        }
    });

    // 4. Search Memories
    memories.forEach((mem) => {
        if (
            mem.title.toLowerCase().includes(q) ||
            mem.content.toLowerCase().includes(q) ||
            (mem.tags && mem.tags.some((t) => t.toLowerCase().includes(q)))
        ) {
            results.Memories.push({
                id: `search_mem_${mem.id}`,
                category: 'Memories',
                title: mem.title,
                subtitle: `[${mem.type}] ${mem.content.slice(0, 70)}...`,
                badge: mem.scope,
                targetSettingsSection: 'memory',
            });
        }
    });

    // 5. Search Messages (Excluding active incognito temporary session if active)
    if (!isIncognito) {
        messages.forEach((msg) => {
            if (msg.content.toLowerCase().includes(q)) {
                const snippetIndex = msg.content.toLowerCase().indexOf(q);
                const snippet = msg.content.slice(Math.max(0, snippetIndex - 20), snippetIndex + 50);
                results.Messages.push({
                    id: `search_msg_${msg.id}`,
                    category: 'Messages',
                    title: `"${snippet.trim()}..."`,
                    subtitle: `From: ${msg.role === 'user' ? 'You' : 'AI'}`,
                    targetChatId: msg.chatId,
                });
            }
        });
    }

    // Remove empty categories
    Object.keys(results).forEach((key) => {
        if (results[key].length === 0) {
            delete results[key];
        }
    });

    return results;
}