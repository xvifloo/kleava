'use client';

import React, { useState } from 'react';
import { Brain, Check, X } from 'lucide-react';
import { CandidateMemorySuggestion, MemoryCategory, MemoryScope } from '@/types';
import { cn } from '@/lib/utils';

export interface MemorySuggestionCardProps {
    suggestion: CandidateMemorySuggestion;
    onAccept: (
        suggestionId: string,
        content: string,
        type: MemoryCategory,
        scope: MemoryScope
    ) => void;
    onDismiss: (suggestionId: string) => void;
    className?: string;
}

const CATEGORIES: MemoryCategory[] = [
    'Personal',
    'Preference',
    'Project',
    'Workflow',
    'Context',
    'Instruction',
    'Custom',
    'Other',
];

const SCOPES: MemoryScope[] = ['Global', 'Project', 'Conversation'];

/**
 * MemorySuggestionCard: Compact, non-intrusive suggestion banner displayed
 * when a candidate memory pattern is detected in the user's message stream.
 */
export function MemorySuggestionCard({
    suggestion,
    onAccept,
    onDismiss,
    className,
}: MemorySuggestionCardProps) {
    const [selectedType, setSelectedType] = useState<MemoryCategory>(suggestion.suggestedType);
    const [selectedScope, setSelectedScope] = useState<MemoryScope>(suggestion.suggestedScope);
    const [editedContent, setEditedContent] = useState<string>(suggestion.content);

    const handleSave = () => {
        onAccept(suggestion.id, editedContent.trim(), selectedType, selectedScope);
    };

    return (
        <div
            role="region"
            aria-label="Memory save suggestion"
            className={cn(
                'w-full max-w-[92%] sm:max-w-[85%] md:max-w-[78%] my-2.5 p-3 rounded-kleava-md select-none',
                'bg-kleava-surface-light/70 border border-kleava-accent/35 shadow-xs',
                'flex flex-col space-y-2.5 font-ui text-xs',
                'animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out',
                className
            )}
        >
            {/* 1. Header Bar: Icon & Context Notice */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-kleava-accent font-medium">
                    <Brain className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="typography-metadata text-[11px] font-semibold text-kleava-text-primary">
                        Save as Memory Rule?
                    </span>
                </div>

                <button
                    type="button"
                    aria-label="Dismiss memory suggestion"
                    onClick={() => onDismiss(suggestion.id)}
                    className="p-1 rounded-full text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-soft transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>

            {/* 2. Editable Content Preview */}
            <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-kleava-sm bg-kleava-surface border border-kleava-border-subtle text-xs text-kleava-text-primary focus:outline-none focus:border-kleava-accent"
            />

            {/* 3. Controls & Action Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
                <div className="flex items-center space-x-1.5">
                    {/* Scope Selector */}
                    <select
                        value={selectedScope}
                        onChange={(e) => setSelectedScope(e.target.value as MemoryScope)}
                        className="px-2 py-1 rounded-kleava-sm bg-kleava-surface border border-kleava-border-subtle text-[11px] text-kleava-text-primary focus:outline-none font-medium"
                    >
                        {SCOPES.map((scope) => (
                            <option key={scope} value={scope}>
                                Scope: {scope}
                            </option>
                        ))}
                    </select>

                    {/* Category Selector */}
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as MemoryCategory)}
                        className="px-2 py-1 rounded-kleava-sm bg-kleava-surface border border-kleava-border-subtle text-[11px] text-kleava-text-primary focus:outline-none font-medium"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Action Triggers */}
                <div className="flex items-center space-x-1.5 ml-auto">
                    <button
                        type="button"
                        onClick={() => onDismiss(suggestion.id)}
                        className="px-2.5 py-1 text-[11px] rounded bg-kleava-surface-soft text-kleava-text-secondary hover:text-kleava-text-primary transition-colors"
                    >
                        Ignore
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-3 py-1 text-[11px] rounded bg-kleava-accent text-white font-medium hover:opacity-90 flex items-center space-x-1 transition-opacity focus-ring-kleava"
                    >
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Save Memory</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MemorySuggestionCard;