import { KeyboardShortcutItem } from '@/types';

/**
 * KLEAVA AI — CENTRALIZED SHORTCUT REGISTRY
 */
export const DEFAULT_SHORTCUTS: KeyboardShortcutItem[] = [
    // Global & Navigation
    {
        id: 'search_chats',
        action: 'search_chats',
        keys: ['Ctrl', 'K'],
        category: 'Global',
        description: 'Open chat search and jump between conversations',
        enabled: true,
        scope: 'Global',
    },
    {
        id: 'toggle_nav',
        action: 'toggle_nav',
        keys: ['Ctrl', 'B'],
        category: 'Navigation',
        description: 'Open or close the floating navigation drawer',
        enabled: true,
        scope: 'Global',
    },
    {
        id: 'new_chat',
        action: 'new_chat',
        keys: ['Alt', 'N'],
        category: 'Chat',
        description: 'Start a fresh conversation and reset workspace',
        enabled: true,
        scope: 'App',
    },
    {
        id: 'open_settings',
        action: 'open_settings',
        keys: ['Ctrl', ','],
        category: 'Settings',
        description: 'Open application preferences and configuration',
        enabled: true,
        scope: 'App',
    },

    // Composer Shortcuts
    {
        id: 'focus_composer',
        action: 'focus_composer',
        keys: ['/'],
        category: 'Composer',
        description: 'Focus the prompt input area when not typing',
        enabled: true,
        scope: 'App',
    },
    {
        id: 'send_message',
        action: 'send_message',
        keys: ['Enter'],
        category: 'Composer',
        description: 'Send outgoing message prompt',
        enabled: true,
        scope: 'Composer',
    },
    {
        id: 'new_line',
        action: 'new_line',
        keys: ['Shift', 'Enter'],
        category: 'Composer',
        description: 'Insert a new line inside the prompt editor',
        enabled: true,
        scope: 'Composer',
    },
    {
        id: 'cancel_generation',
        action: 'cancel_generation',
        keys: ['Escape'],
        category: 'Composer',
        description: 'Stop active AI response stream generation',
        enabled: true,
        scope: 'Global',
    },
    {
        id: 'toggle_expanded_mode',
        action: 'toggle_expanded_mode',
        keys: ['Ctrl', 'Shift', 'E'],
        category: 'Composer',
        description: 'Toggle expanded workspace writing mode',
        enabled: true,
        scope: 'App',
    },
];

/**
 * Formats keys for active platform (e.g. replacing 'Ctrl' with '⌘' on macOS).
 */
export function formatShortcutKeys(keys: string[]): string[] {
    if (typeof window === 'undefined') return keys;
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);

    return keys.map((k) => {
        if (isMac) {
            if (k === 'Ctrl' || k === 'Control') return '⌘ Cmd';
            if (k === 'Alt') return '⌥ Opt';
            if (k === 'Shift') return '⇧ Shift';
        }
        return k;
    });
}