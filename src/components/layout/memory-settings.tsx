'use client';

import React, { useState, useMemo } from 'react';
import {
    Brain,
    Plus,
    Search,
    Trash2,
    Pencil,
    Globe,
    FolderKanban,
    MessageSquare,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { useSettings } from '@/state/settings-context';
import { MemoryRecord, MemoryScope, MemoryCategory, MemorySource } from '@/types';
import { filterMemories } from '@/lib/memory-service';
import { formatRelativeTime } from '@/lib/date-utils';
import {
    SettingsContent,
    SettingsSectionBlock,
    SettingsRow,
    SettingsDivider,
} from '@/components/layout/settings-content';
import { cn } from '@/lib/utils';

const CATEGORIES: MemoryCategory[] = [
    'Preference',
    'Project',
    'Workflow',
    'Context',
    'Instruction',
    'Other',
];

const SCOPES: MemoryScope[] = ['Global', 'Project', 'Chat'];

/**
 * MemorySettings: Complete management interface for Memory Rules,
 * Context scope partitioning, Add/Edit dialogs, search, and Clear All.
 */
export function MemorySettings() {
    const {
        useMemory,
        memories,
        setUseMemory,
        addMemory,
        updateMemory,
        deleteMemory,
        toggleMemoryEnabled,
        clearAllMemories,
    } = useSettings();

    const [searchQuery, setSearchQuery] = useState('');
    const [scopeFilter, setScopeFilter] = useState<MemoryScope | 'All'>('All');
    const [categoryFilter, setCategoryFilter] = useState<MemoryCategory | 'All'>('All');

    // Modal Dialog States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
    const [expandedMemoryId, setExpandedMemoryId] = useState<string | null>(null);
    const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);
    const [memoryToDeleteId, setMemoryToDeleteId] = useState<string | null>(null);

    // Form Fields
    const [formTitle, setFormTitle] = useState('');
    const [formContent, setFormContent] = useState('');
    const [formCategory, setFormCategory] = useState<MemoryCategory>('Preference');
    const [formScope, setFormScope] = useState<MemoryScope>('Global');
    const [formEnabled, setFormEnabled] = useState(true);
    const [formError, setFormError] = useState<string | null>(null);

    // Filtered memory list
    const filteredList = useMemo(() => {
        return filterMemories({
            memories,
            searchQuery,
            scopeFilter,
            categoryFilter,
        });
    }, [memories, searchQuery, scopeFilter, categoryFilter]);

    const handleOpenAddModal = () => {
        setEditingMemoryId(null);
        setFormTitle('');
        setFormContent('');
        setFormCategory('Preference');
        setFormScope('Global');
        setFormEnabled(true);
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (mem: MemoryRecord) => {
        setEditingMemoryId(mem.id);
        setFormTitle(mem.title);
        setFormContent(mem.content);
        setFormCategory(mem.category);
        setFormScope(mem.scope);
        setFormEnabled(mem.enabled);
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleSaveMemory = (e: React.FormEvent) => {
        e.preventDefault();
        const title = formTitle.trim();
        const content = formContent.trim();

        if (!title || !content) {
            setFormError('Both Title and Content are required');
            return;
        }

        if (content.length > 2000) {
            setFormError('Content exceeds 2000 characters limit');
            return;
        }

        if (editingMemoryId) {
            updateMemory(editingMemoryId, {
                title,
                content,
                category: formCategory,
                scope: formScope,
                enabled: formEnabled,
            });
        } else {
            addMemory({
                title,
                content,
                category: formCategory,
                source: 'Manual' as MemorySource,
                scope: formScope,
                enabled: formEnabled,
            });
        }

        setIsModalOpen(false);
    };

    return (
        <SettingsContent
            sectionId="memory"
            title="Memory System"
            description="Manage long-term knowledge, custom preferences, and contextual scope rules."
        >
            {/* 1. Master Toggle Section */}
            <SettingsSectionBlock title="Context Engine">
                <SettingsRow
                    label="Use Memory"
                    description="Enable Kleava to reference relevant saved knowledge during conversations"
                    control={
                        <button
                            type="button"
                            role="switch"
                            aria-checked={useMemory}
                            onClick={() => setUseMemory(!useMemory)}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                useMemory ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    useMemory ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />
            </SettingsSectionBlock>

            <SettingsDivider />

            {/* 2. Memory Actions, Search & Filtering Header */}
            <SettingsSectionBlock title="Stored Knowledge">
                <div className="flex flex-col space-y-2">
                    {/* Top Bar: Add Action & Search Input */}
                    <div className="flex items-center space-x-1.5">
                        <div className="relative flex-1 flex items-center">
                            <Search className="absolute left-2.5 w-3.5 h-3.5 text-kleava-text-secondary/70 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search memories..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-kleava-md bg-kleava-surface-light/40 border border-kleava-border-subtle/70 text-xs text-kleava-text-primary placeholder:text-kleava-text-secondary/70 focus:outline-none focus:border-kleava-accent"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenAddModal}
                            className="h-8 px-2.5 rounded-kleava-md bg-kleava-accent text-white flex items-center space-x-1 text-xs font-medium hover:opacity-90 transition-opacity focus-ring-kleava flex-shrink-0"
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span className="hidden sm:inline">Add</span>
                        </button>
                    </div>

                    {/* Scope & Category Filter Selectors */}
                    <div className="flex items-center space-x-1.5 text-xs">
                        <select
                            value={scopeFilter}
                            onChange={(e) => setScopeFilter(e.target.value as MemoryScope | 'All')}
                            className="flex-1 px-2 py-1 rounded-kleava-sm bg-kleava-surface border border-kleava-border-subtle/80 text-kleava-text-primary text-[11px] focus:outline-none"
                        >
                            <option value="All">All Scopes</option>
                            {SCOPES.map((s) => (
                                <option key={s} value={s}>
                                    Scope: {s}
                                </option>
                            ))}
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as MemoryCategory | 'All')}
                            className="flex-1 px-2 py-1 rounded-kleava-sm bg-kleava-surface border border-kleava-border-subtle/80 text-kleava-text-primary text-[11px] focus:outline-none"
                        >
                            <option value="All">All Categories</option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 3. Memory Cards List */}
                <div className="mt-2.5 flex flex-col space-y-1.5">
                    {filteredList.length === 0 ? (
                        <div className="py-8 text-center px-4 rounded-kleava-md bg-kleava-surface-light/20 border border-kleava-border-subtle/40">
                            <Brain className="w-6 h-6 text-kleava-text-secondary/40 mx-auto mb-1.5" />
                            <p className="typography-caption text-kleava-text-secondary">
                                {searchQuery || scopeFilter !== 'All' || categoryFilter !== 'All'
                                    ? 'No matching memories found.'
                                    : 'No memory rules stored yet.'}
                            </p>
                        </div>
                    ) : (
                        filteredList.map((mem) => {
                            const isExpanded = expandedMemoryId === mem.id;

                            return (
                                <div
                                    key={mem.id}
                                    className={cn(
                                        'p-2.5 rounded-kleava-md border transition-all duration-150',
                                        mem.enabled && useMemory
                                            ? 'bg-kleava-surface border-kleava-border-subtle/70 shadow-xs'
                                            : 'bg-kleava-surface-soft/40 border-kleava-border-subtle/40 opacity-65'
                                    )}
                                >
                                    <div className="flex items-start justify-between space-x-2">
                                        <div className="flex-1 min-w-0">
                                            {/* Title & Badges */}
                                            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                                                <span className="typography-label text-xs font-semibold text-kleava-text-primary truncate">
                                                    {mem.title}
                                                </span>

                                                {/* Scope Badge */}
                                                <span className="typography-metadata text-[9px] uppercase px-1 py-0.2 rounded bg-kleava-surface-soft text-kleava-text-secondary font-mono flex items-center space-x-0.5">
                                                    {mem.scope === 'Global' && <Globe className="w-2.5 h-2.5" />}
                                                    {mem.scope === 'Project' && <FolderKanban className="w-2.5 h-2.5" />}
                                                    {mem.scope === 'Chat' && <MessageSquare className="w-2.5 h-2.5" />}
                                                    <span>{mem.scope}</span>
                                                </span>

                                                {/* Category Badge */}
                                                <span className="typography-metadata text-[9px] uppercase px-1 py-0.2 rounded bg-kleava-accent/15 text-kleava-accent font-semibold">
                                                    {mem.category}
                                                </span>
                                            </div>

                                            {/* Content Preview / Full Text */}
                                            <p className="typography-metadata text-[11px] text-kleava-text-secondary mt-1 leading-relaxed whitespace-pre-wrap">
                                                {isExpanded ? mem.content : `${mem.content.slice(0, 110)}${mem.content.length > 110 ? '...' : ''}`}
                                            </p>

                                            {mem.content.length > 110 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setExpandedMemoryId(isExpanded ? null : mem.id)}
                                                    className="mt-0.5 text-[10px] text-kleava-accent hover:underline flex items-center space-x-0.5 focus:outline-none"
                                                >
                                                    <span>{isExpanded ? 'Show less' : 'Expand'}</span>
                                                    {isExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                                                </button>
                                            )}
                                        </div>

                                        {/* Right Action Controls */}
                                        <div className="flex items-center space-x-1 flex-shrink-0 pt-0.5">
                                            {/* Enable/Disable Item Switch */}
                                            <button
                                                type="button"
                                                aria-label={mem.enabled ? 'Disable memory' : 'Enable memory'}
                                                onClick={() => toggleMemoryEnabled(mem.id)}
                                                className={cn(
                                                    'relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150',
                                                    mem.enabled ? 'bg-kleava-accent' : 'bg-kleava-border-subtle'
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150',
                                                        mem.enabled ? 'translate-x-3' : 'translate-x-0'
                                                    )}
                                                />
                                            </button>

                                            {/* Edit Button */}
                                            <button
                                                type="button"
                                                aria-label={`Edit ${mem.title}`}
                                                onClick={() => handleOpenEditModal(mem)}
                                                className="p-1 rounded text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-soft transition-colors"
                                            >
                                                <Pencil className="w-3 h-3" />
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                type="button"
                                                aria-label={`Delete ${mem.title}`}
                                                onClick={() => setMemoryToDeleteId(mem.id)}
                                                className="p-1 rounded text-kleava-text-secondary hover:text-kleava-destructive hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-1.5 flex items-center justify-between text-[9.5px] text-kleava-text-secondary/60">
                                        <span>Source: {mem.source}</span>
                                        <span>{formatRelativeTime(mem.updatedAt)}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Clear All Action */}
                {memories.length > 0 && (
                    <div className="pt-2 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setIsClearAllDialogOpen(true)}
                            className="typography-metadata text-[10.5px] text-kleava-destructive hover:underline"
                        >
                            Clear All Memories
                        </button>
                    </div>
                )}
            </SettingsSectionBlock>

            {/* 4. Add / Edit Memory Modal Dialog */}
            {isModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={editingMemoryId ? 'Edit Memory' : 'Add Memory'}
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 animate-in fade-in duration-150"
                >
                    <div
                        className="w-full max-w-sm bg-kleava-surface rounded-kleava-lg border border-kleava-border-subtle shadow-kleava-floating p-4 flex flex-col space-y-3 font-ui"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-kleava-border-subtle/50">
                            <span className="typography-label font-semibold text-xs text-kleava-text-primary">
                                {editingMemoryId ? 'Edit Memory' : 'Add Memory Rule'}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="w-5 h-5 rounded hover:bg-kleava-surface-soft flex items-center justify-center text-kleava-text-secondary text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        {formError && (
                            <div className="p-2 rounded bg-red-50 border border-red-200 text-[11px] text-kleava-destructive">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSaveMemory} className="flex flex-col space-y-2.5">
                            <div>
                                <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Response Style Rule"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 border border-kleava-border-subtle focus:outline-none focus:border-kleava-accent"
                                />
                            </div>

                            <div>
                                <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                                    Memory Content (Instructions or facts) *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="e.g. Always generate code snippets in TypeScript with explicit types..."
                                    value={formContent}
                                    onChange={(e) => setFormContent(e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 border border-kleava-border-subtle focus:outline-none focus:border-kleava-accent resize-y"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="flex-1">
                                    <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={formCategory}
                                        onChange={(e) => setFormCategory(e.target.value as MemoryCategory)}
                                        className="w-full px-2 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 border border-kleava-border-subtle focus:outline-none"
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1">
                                    <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                                        Scope
                                    </label>
                                    <select
                                        value={formScope}
                                        onChange={(e) => setFormScope(e.target.value as MemoryScope)}
                                        className="w-full px-2 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 border border-kleava-border-subtle focus:outline-none"
                                    >
                                        {SCOPES.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <span className="typography-metadata text-[11px] text-kleava-text-primary">
                                    Active / Enabled
                                </span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={formEnabled}
                                    onClick={() => setFormEnabled(!formEnabled)}
                                    className={cn(
                                        'relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150',
                                        formEnabled ? 'bg-kleava-accent' : 'bg-kleava-border-subtle'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150',
                                            formEnabled ? 'translate-x-3' : 'translate-x-0'
                                        )}
                                    />
                                </button>
                            </div>

                            <div className="pt-2 flex items-center justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-3 py-1.5 text-xs rounded bg-kleava-surface-soft text-kleava-text-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3.5 py-1.5 text-xs rounded bg-kleava-accent text-white font-medium hover:opacity-90"
                                >
                                    Save Memory
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 5. Delete Single Memory Confirmation */}
            {memoryToDeleteId && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 animate-in fade-in duration-150"
                >
                    <div className="w-full max-w-xs bg-kleava-surface rounded-kleava-lg border border-kleava-border-subtle shadow-kleava-floating p-4 flex flex-col space-y-3 font-ui text-center">
                        <span className="typography-label text-xs font-semibold text-kleava-destructive">
                            Delete this memory?
                        </span>
                        <p className="typography-metadata text-[11px] text-kleava-text-secondary">
                            This record will be permanently removed from your context engine.
                        </p>
                        <div className="flex items-center justify-center space-x-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setMemoryToDeleteId(null)}
                                className="px-3 py-1 text-xs rounded bg-kleava-surface-soft text-kleava-text-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    deleteMemory(memoryToDeleteId);
                                    setMemoryToDeleteId(null);
                                }}
                                className="px-3 py-1 text-xs rounded bg-kleava-destructive text-white font-medium hover:opacity-90"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. Clear All Memories Confirmation */}
            {isClearAllDialogOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 animate-in fade-in duration-150"
                >
                    <div className="w-full max-w-xs bg-kleava-surface rounded-kleava-lg border border-kleava-border-subtle shadow-kleava-floating p-4 flex flex-col space-y-3 font-ui text-center">
                        <span className="typography-label text-xs font-semibold text-kleava-destructive">
                            Clear all memories?
                        </span>
                        <p className="typography-metadata text-[11px] text-kleava-text-secondary">
                            All stored knowledge across Global, Project, and Chat scopes will be erased.
                        </p>
                        <div className="flex items-center justify-center space-x-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsClearAllDialogOpen(false)}
                                className="px-3 py-1 text-xs rounded bg-kleava-surface-soft text-kleava-text-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    clearAllMemories();
                                    setIsClearAllDialogOpen(false);
                                }}
                                className="px-3 py-1 text-xs rounded bg-kleava-destructive text-white font-medium hover:opacity-90"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SettingsContent>
    );
}

export default MemorySettings;