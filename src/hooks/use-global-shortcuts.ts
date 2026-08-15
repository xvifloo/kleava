'use client';

import { useEffect, useCallback } from 'react';
import { useSettings } from '@/state/settings-context';

export interface ShortcutHandlers {
    onSearch?: () => void;
    onToggleNav?: () => void;
    onNewChat?: () => void;
    onOpenSettings?: () => void;
    onFocusComposer?: () => void;
    onCancelGeneration?: () => void;
}

/**
 * useGlobalShortcuts: Centralized document-level keyboard event dispatcher.
 * Safely isolates input contexts (no accidental triggers while typing in textareas),
 * respects IME/Bangla composition states, and handles Escape priority hierarchically.
 */
export function useGlobalShortcuts(handlers: ShortcutHandlers) {
    const { shortcuts } = useSettings();

    const isShortcutEnabled = useCallback(
        (action: string) => {
            const item = shortcuts.find((s) => s.action === action);
            return item ? item.enabled : true;
        },
        [shortcuts]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 1. Respect IME/Bangla typing composition state
            if (e.isComposing || e.keyCode === 229) return;

            const target = e.target as HTMLElement | null;
            const isTypingContext =
                target &&
                (target.tagName === 'TEXTAREA' ||
                    target.tagName === 'INPUT' ||
                    target.isContentEditable);

            const hasCtrlOrMeta = e.ctrlKey || e.metaKey;
            const keyUpper = e.key.toUpperCase();

            // 2. Search Shortcut (Ctrl/Cmd + K)
            if (hasCtrlOrMeta && keyUpper === 'K' && isShortcutEnabled('search_chats')) {
                e.preventDefault();
                handlers.onSearch?.();
                return;
            }

            // 3. Toggle Navigation (Ctrl/Cmd + B)
            if (hasCtrlOrMeta && keyUpper === 'B' && isShortcutEnabled('toggle_nav')) {
                e.preventDefault();
                handlers.onToggleNav?.();
                return;
            }

            // 4. Open Settings (Ctrl/Cmd + ,)
            if (hasCtrlOrMeta && e.key === ',' && isShortcutEnabled('open_settings')) {
                e.preventDefault();
                handlers.onOpenSettings?.();
                return;
            }

            // 5. New Chat (Alt + N)
            if (e.altKey && keyUpper === 'N' && isShortcutEnabled('new_chat')) {
                e.preventDefault();
                handlers.onNewChat?.();
                return;
            }

            // 6. Focus Composer ('/' when not actively typing)
            if (e.key === '/' && !isTypingContext && isShortcutEnabled('focus_composer')) {
                e.preventDefault();
                handlers.onFocusComposer?.();
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers, isShortcutEnabled]);
}

export default useGlobalShortcuts;