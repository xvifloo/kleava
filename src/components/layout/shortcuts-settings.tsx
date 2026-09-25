'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Keyboard, Search, RotateCcw, Pencil, Check } from 'lucide-react';
import { useSettings } from '@/state/settings-context';
import { KeyboardShortcutItem, ShortcutCategory } from '@/types';
import { formatShortcutKeys } from '@/config/shortcuts';
import {
    SettingsContent,
    SettingsSectionBlock,
    SettingsDivider,
} from '@/components/layout/settings-content';
import { cn } from '@/lib/utils';

const CATEGORIES: ShortcutCategory[] = [
    'Global',
    'Navigation',
    'Chat',
    'Composer',
    'Settings',
];

/**
 * ShortcutsSettings: Complete Keyboard Shortcuts customizer with visual keycaps,
 * in-situ recording modal, conflict detection, and reset capabilities.
 */
export function ShortcutsSettings() {
    const {
        shortcuts,
        updateShortcut,
        toggleShortcutEnabled,
        resetShortcut,
        resetAllShortcuts,
    } = useSettings();

    const [searchQuery, setSearchQuery] = useState('');
    const [editingShortcut, setEditingShortcut] = useState<KeyboardShortcutItem | null>(null);
    const [recordedKeys, setRecordedKeys] = useState<string[]>([]);
    const [conflictError, setConflictError] = useState<string | null>(null);
    const [isResetAllModalOpen, setIsResetAllModalOpen] = useState(false);

    // Filter shortcuts
    const filteredShortcuts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return shortcuts;
        return shortcuts.filter(
            (s) =>
                s.description.toLowerCase().includes(q) ||
                s.category.toLowerCase().includes(q) ||
                s.keys.join('+').toLowerCase().includes(q)
        );
    }, [shortcuts, searchQuery]);

    // Key recording listener
    useEffect(() => {
        if (!editingShortcut) return;

        const handleRecordKey = (e: KeyboardEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const modifiers: string[] = [];
            if (e.ctrlKey) modifiers.push('Ctrl');
            if (e.metaKey) modifiers.push('Meta');
            if (e.altKey) modifiers.push('Alt');
            if (e.shiftKey) modifiers.push('Shift');

            const mainKey =
                e.key !== 'Control' && e.key !== 'Meta' && e.key !== 'Alt' && e.key !== 'Shift'
                    ? e.key.length === 1
                        ? e.key.toUpperCase()
                        : e.key
                    : null;

            if (mainKey) {
                setRecordedKeys([...modifiers, mainKey]);
            } else if (modifiers.length > 0) {
                setRecordedKeys(modifiers);
            }
        };

        window.addEventListener('keydown', handleRecordKey);
        return () => window.removeEventListener('keydown', handleRecordKey);
    }, [editingShortcut]);

    const handleSaveRecorded = () => {
        if (!editingShortcut || recordedKeys.length === 0) return;

        const success = updateShortcut(editingShortcut.id, recordedKeys);
        if (!success) {
            setConflictError(
                `Shortcut '${recordedKeys.join('+')}' is already assigned to another action.`
            );
            return;
        }

        setEditingShortcut(null);
        setRecordedKeys([]);
        setConflictError(null);
    };

    return (
        <SettingsContent
            sectionId="shortcuts"
            title="Keyboard Shortcuts"
            description="View, customize, and manage keyboard commands for rapid workspace navigation."
        >
            {/* Search Bar */}
            <div className="relative mb-2 flex items-center select-none font-ui">
                <Search className="absolute left-2.5 w-3.5 h-3.5 text-kleava-text-secondary/70 pointer-events-none" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search shortcuts or key combinations..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-kleava-md bg-kleava-surface-light/40 border border-kleava-border-subtle/70 text-xs text-kleava-text-primary placeholder:text-kleava-text-secondary/70 focus:outline-none focus:border-kleava-accent"
                />
            </div>

            {/* Grouped Shortcuts Feed */}
            <div className="flex flex-col space-y-3.5 select-none font-ui">
                {CATEGORIES.map((category) => {
                    const inGroup = filteredShortcuts.filter((s) => s.category === category);
                    if (inGroup.length === 0) return null;

                    return (
                        <SettingsSectionBlock key={category} title={category}>
                            <div className="flex flex-col space-y-1.5">
                                {inGroup.map((shortcut) => {
                                    const formattedKeys = formatShortcutKeys(shortcut.keys);

                                    return (
                                        <div
                                            key={shortcut.id}
                                            className={cn(
                                                'w-full flex items-center justify-between p-2 rounded-kleava-md border transition-all',
                                                shortcut.enabled
                                                    ? 'bg-kleava-surface border-kleava-border-subtle/70 shadow-xs'
                                                    : 'bg-kleava-surface-soft/40 border-kleava-border-subtle/40 opacity-60'
                                            )}
                                        >
                                            <div className="flex flex-col min-w-0 pr-2">
                                                <span className="typography-label text-xs font-medium text-kleava-text-primary truncate">
                                                    {shortcut.description}
                                                </span>
                                                <div className="flex items-center space-x-1.5 mt-0.5">
                                                    <span className="typography-metadata text-[9.5px] text-kleava-text-secondary">
                                                        Scope: {shortcut.scope}
                                                    </span>
                                                    {shortcut.isCustom && (
                                                        <span className="typography-metadata text-[8.5px] uppercase px-1 py-0.2 rounded bg-blue-50 text-blue-600 font-semibold">
                                                            Custom
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Action: Keycaps & Controls */}
                                            <div className="flex items-center space-x-1.5 flex-shrink-0">
                                                {/* Keycap Badges */}
                                                <div className="flex items-center space-x-1">
                                                    {formattedKeys.map((k, kIdx) => (
                                                        <kbd
                                                            key={kIdx}
                                                            className="px-1.5 py-0.5 rounded-[4px] bg-kleava-surface-soft border border-kleava-border-subtle/80 font-code text-[10px] text-kleava-text-primary shadow-2xs font-semibold"
                                                        >
                                                            {k}
                                                        </kbd>
                                                    ))}
                                                </div>

                                                {/* Edit Shortcut */}
                                                <button
                                                    type="button"
                                                    aria-label={`Customize ${shortcut.description}`}
                                                    onClick={() => {
                                                        setEditingShortcut(shortcut);
                                                        setRecordedKeys(shortcut.keys);
                                                        setConflictError(null);
                                                    }}
                                                    className="p-1 rounded text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-soft transition-colors focus-ring-kleava"
                                                >
                                                    <Pencil className="w-3 h-3" />
                                                </button>

                                                {/* Reset Single Shortcut (if customized) */}
                                                {shortcut.isCustom && (
                                                    <button
                                                        type="button"
                                                        aria-label={`Reset ${shortcut.description}`}
                                                        onClick={() => resetShortcut(shortcut.id)}
                                                        className="p-1 rounded text-kleava-text-secondary hover:text-kleava-accent hover:bg-kleava-surface-soft transition-colors"
                                                    >
                                                        <RotateCcw className="w-3 h-3" />
                                                    </button>
                                                )}

                                                {/* Enable/Disable Toggle */}
                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={shortcut.enabled}
                                                    aria-label={shortcut.enabled ? 'Disable shortcut' : 'Enable shortcut'}
                                                    onClick={() => toggleShortcutEnabled(shortcut.id)}
                                                    className={cn(
                                                        'relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ml-0.5',
                                                        shortcut.enabled ? 'bg-kleava-accent' : 'bg-kleava-border-subtle'
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150',
                                                            shortcut.enabled ? 'translate-x-3' : 'translate-x-0'
                                                        )}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </SettingsSectionBlock>
                    );
                })}
            </div>

            <SettingsDivider />

            {/* Reset All Shortcuts Trigger */}
            <div className="flex justify-end pt-1 select-none font-ui">
                <button
                    type="button"
                    onClick={() => setIsResetAllModalOpen(true)}
                    className="typography-metadata text-[10.5px] text-kleava-destructive hover:underline"
                >
                    Reset all shortcuts to defaults
                </button>
            </div>

            {/* Key Recording Modal */}
            {editingShortcut && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Record Shortcut"
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 animate-in fade-in duration-150 select-none font-ui"
                >
                    <div
                        className="w-full max-w-sm bg-kleava-surface rounded-kleava-lg border border-kleava-border-subtle shadow-kleava-floating p-4 flex flex-col space-y-3 font-ui text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-kleava-border-subtle/50">
                            <span className="typography-label font-semibold text-xs text-kleava-text-primary">
                                Record Keyboard Shortcut
                            </span>
                            <button
                                type="button"
                                onClick={() => setEditingShortcut(null)}
                                className="w-5 h-5 rounded hover:bg-kleava-surface-soft flex items-center justify-center text-kleava-text-secondary text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="typography-metadata text-[11px] text-kleava-text-secondary">
                            Press your desired key combination for: <br />
                            <strong className="text-kleava-text-primary font-medium">{editingShortcut.description}</strong>
                        </p>

                        {/* Visual Recorded Display */}
                        <div className="py-4 px-3 rounded-kleava-md bg-kleava-surface-soft/60 border border-kleava-border-subtle/80 flex items-center justify-center space-x-1.5 min-h-[48px]">
                            {recordedKeys.length === 0 ? (
                                <span className="typography-metadata text-xs text-kleava-text-secondary italic">
                                    Press keys on keyboard...
                                </span>
                            ) : (
                                formatShortcutKeys(recordedKeys).map((k, idx) => (
                                    <kbd
                                        key={idx}
                                        className="px-2 py-1 rounded-[5px] bg-kleava-surface border border-kleava-border-subtle font-code text-xs text-kleava-text-primary shadow-xs font-bold"
                                    >
                                        {k}
                                    </kbd>
                                ))
                            )}
                        </div>

                        {conflictError && (
                            <div className="p-2 rounded bg-red-50 border border-red-200 text-[10.5px] text-kleava-destructive text-left">
                                {conflictError}
                            </div>
                        )}

                        <div className="flex items-center justify-end space-x-2 pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingShortcut(null);
                                    setRecordedKeys([]);
                                    setConflictError(null);
                                }}
                                className="px-3 py-1.5 text-xs rounded bg-kleava-surface-soft text-kleava-text-secondary hover:text-kleava-text-primary"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={recordedKeys.length === 0}
                                onClick={handleSaveRecorded}
                                className="px-3.5 py-1.5 text-xs rounded bg-kleava-accent text-white font-medium hover:opacity-90 disabled:opacity-50 flex items-center space-x-1"
                            >
                                <Check className="w-3 h-3" />
                                <span>Save Shortcut</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset All Confirmation Modal */}
            {isResetAllModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 animate-in fade-in duration-150 select-none font-ui"
                >
                    <div className="w-full max-w-xs bg-kleava-surface rounded-kleava-lg border border-kleava-border-subtle shadow-kleava-floating p-4 flex flex-col space-y-3 font-ui text-center">
                        <span className="typography-label text-xs font-semibold text-kleava-destructive">
                            Reset all shortcuts?
                        </span>
                        <p className="typography-metadata text-[11px] text-kleava-text-secondary leading-relaxed">
                            All custom keybindings will be restored to the canonical Kleava keyboard defaults.
                        </p>
                        <div className="flex items-center justify-center space-x-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsResetAllModalOpen(false)}
                                className="px-3 py-1 text-xs rounded bg-kleava-surface-soft text-kleava-text-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    resetAllShortcuts();
                                    setIsResetAllModalOpen(false);
                                }}
                                className="px-3 py-1 text-xs rounded bg-kleava-destructive text-white font-medium hover:opacity-90"
                            >
                                Reset All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SettingsContent>
    );
}

export default ShortcutsSettings;