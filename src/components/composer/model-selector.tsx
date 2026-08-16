'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
    ChevronDown,
    Check,
    Sparkles,
    Cpu,
    Search,
    Lock,
    Code,
    Eye,
    Brain,
    FileText,
    Wrench,
} from 'lucide-react';
import { useSettings } from '@/state/settings-context';
import { ModelGroup, ModelCapability } from '@/types';
import { cn } from '@/lib/utils';

export interface ModelSelectorProps {
    selectedModelId: string;
    onModelChange: (modelId: string) => void;
    disabled?: boolean;
    className?: string;
}

function renderCapabilityIcon(cap: ModelCapability) {
    switch (cap) {
        case 'text':
            return (
                <span key={cap} title="Text Processing" className="inline-flex">
                    <FileText className="w-2.5 h-2.5 text-kleava-text-secondary/70" />
                </span>
            );
        case 'vision':
            return (
                <span key={cap} title="Vision / Image Understanding" className="inline-flex">
                    <Eye className="w-2.5 h-2.5 text-blue-500" />
                </span>
            );
        case 'reasoning':
            return (
                <span key={cap} title="Deep Analytical Reasoning" className="inline-flex">
                    <Brain className="w-2.5 h-2.5 text-purple-500" />
                </span>
            );
        case 'coding':
            return (
                <span key={cap} title="Code Generation" className="inline-flex">
                    <Code className="w-2.5 h-2.5 text-emerald-600" />
                </span>
            );
        case 'speed':
            return (
                <span key={cap} title="Fast Execution" className="inline-flex">
                    <Sparkles className="w-2.5 h-2.5 text-kleava-accent" />
                </span>
            );
        case 'tools':
            return (
                <span key={cap} title="Tool Use" className="inline-flex">
                    <Wrench className="w-2.5 h-2.5 text-amber-600" />
                </span>
            );
        default:
            return null;
    }
}

/**
 * ModelSelector: 36px height trigger matching the attachment button,
 * with search and keyboard arrow navigation.
 */
export function ModelSelector({
    selectedModelId,
    onModelChange,
    disabled = false,
    className,
}: ModelSelectorProps) {
    const { models } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [focusedIndex, setFocusedIndex] = useState<number>(0);

    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

    const filteredModels = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return models;
        return models.filter(
            (m) =>
                m.name.toLowerCase().includes(q) ||
                m.provider.toLowerCase().includes(q) ||
                m.description.toLowerCase().includes(q)
        );
    }, [models, searchQuery]);

    const availableSelectable = useMemo(
        () => filteredModels.filter((m) => m.isAvailable),
        [filteredModels]
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                setSearchQuery('');
                triggerRef.current?.focus();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const handleMenuKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!isOpen || availableSelectable.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex((prev) => (prev + 1) % availableSelectable.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex(
                    (prev) => (prev - 1 + availableSelectable.length) % availableSelectable.length
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const targetModel = availableSelectable[focusedIndex];
                if (targetModel) {
                    onModelChange(targetModel.id);
                    setIsOpen(false);
                    setSearchQuery('');
                    triggerRef.current?.focus();
                }
            }
        },
        [isOpen, availableSelectable, focusedIndex, onModelChange]
    );

    const groups: ModelGroup[] = ['Recommended', 'Built-in', 'Custom', 'External Providers'];

    return (
        <div
            className={cn('relative inline-flex items-center select-none font-ui shrink-0', className)}
            ref={menuRef}
            onKeyDown={handleMenuKeyDown}
        >
            {/* 36px Height Trigger Button matching Attachment Button */}
            <button
                ref={triggerRef}
                type="button"
                aria-label={`Current AI model: ${currentModel?.name || 'Kleava 0.7'}. Click to change model.`}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'h-[36px] min-h-[36px] px-3 rounded-kleava-control flex items-center space-x-1.5',
                    'bg-kleava-surface-soft text-kleava-text-primary text-xs font-medium',
                    'hover:bg-kleava-surface-light hover:text-kleava-accent transition-colors',
                    'border border-kleava-border-subtle/50 shadow-xs',
                    'focus-ring-kleava',
                    disabled && 'opacity-60 cursor-not-allowed'
                )}
            >
                {currentModel?.id === 'auto' ? (
                    <Sparkles className="w-3.5 h-3.5 text-kleava-accent shrink-0" />
                ) : (
                    <Cpu className="w-3.5 h-3.5 text-kleava-text-secondary shrink-0" />
                )}
                <span className="truncate max-w-[90px] sm:max-w-[120px]">
                    {currentModel?.name || 'Kleava 0.7'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-kleava-text-secondary shrink-0" />
            </button>

            {/* Floating Popover Window */}
            {isOpen && (
                <div
                    role="menu"
                    aria-label="AI Model Registry Options"
                    className={cn(
                        'absolute left-0 bottom-11 z-50',
                        'w-[280px] sm:w-[310px] max-h-[360px] flex flex-col',
                        'bg-kleava-surface text-kleava-text-primary',
                        'rounded-kleava-md border border-kleava-border-subtle/80',
                        'shadow-kleava-floating p-2 select-none',
                        'animate-in fade-in zoom-in-95 duration-150 origin-bottom-left'
                    )}
                >
                    <div className="relative mb-2 flex items-center shrink-0">
                        <Search className="absolute left-2.5 w-3 h-3 text-kleava-text-secondary/70 pointer-events-none" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search models or providers..."
                            className="w-full pl-7 pr-2.5 py-1 text-xs rounded-kleava-sm bg-kleava-surface-light/40 border border-kleava-border-subtle/70 placeholder:text-kleava-text-secondary/70 focus:outline-none focus:border-kleava-accent"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-none space-y-2 pr-0.5 min-h-[140px]">
                        {filteredModels.length === 0 ? (
                            <div className="py-6 text-center text-xs text-kleava-text-secondary">
                                No matching models found.
                            </div>
                        ) : (
                            groups.map((groupName) => {
                                const modelsInGroup = filteredModels.filter((m) => m.group === groupName);
                                if (modelsInGroup.length === 0) return null;

                                return (
                                    <div key={groupName} className="flex flex-col space-y-0.5">
                                        <div className="px-2 py-0.5 flex items-center justify-between">
                                            <span className="typography-metadata uppercase tracking-wider text-[9.5px] font-semibold text-kleava-text-secondary/70">
                                                {groupName}
                                            </span>
                                        </div>

                                        {modelsInGroup.map((model) => {
                                            const isSelected = model.id === currentModel?.id;

                                            return (
                                                <button
                                                    key={model.id}
                                                    type="button"
                                                    role="menuitem"
                                                    disabled={!model.isAvailable}
                                                    onClick={() => {
                                                        if (model.isAvailable) {
                                                            onModelChange(model.id);
                                                            setIsOpen(false);
                                                            setSearchQuery('');
                                                            triggerRef.current?.focus();
                                                        }
                                                    }}
                                                    className={cn(
                                                        'w-full flex items-start justify-between px-2.5 py-1.5 rounded-kleava-sm text-left',
                                                        'transition-colors duration-150',
                                                        isSelected
                                                            ? 'bg-kleava-surface-soft text-kleava-text-primary font-medium'
                                                            : model.isAvailable
                                                                ? 'text-kleava-text-primary hover:bg-kleava-surface-light'
                                                                : 'text-kleava-text-secondary/50 cursor-not-allowed'
                                                    )}
                                                >
                                                    <div className="flex flex-col min-w-0 pr-1.5">
                                                        <div className="flex items-center space-x-1.5 flex-wrap">
                                                            <span className="text-xs font-medium truncate">{model.name}</span>

                                                            <span className="typography-metadata text-[8.5px] uppercase px-1 py-0.2 rounded bg-kleava-surface-soft text-kleava-text-secondary/80 font-mono">
                                                                {model.provider}
                                                            </span>

                                                            {model.badge && (
                                                                <span className="typography-metadata text-[8.5px] uppercase px-1 py-0.2 rounded bg-kleava-accent/15 text-kleava-accent font-semibold">
                                                                    {model.badge}
                                                                </span>
                                                            )}

                                                            {!model.isAvailable && (
                                                                <span className="flex items-center space-x-0.5 text-[9px] text-amber-600 bg-amber-50 px-1 rounded font-medium">
                                                                    <Lock className="w-2.5 h-2.5" />
                                                                    <span>Config</span>
                                                                </span>
                                                            )}
                                                        </div>

                                                        <span className="typography-metadata text-[10px] text-kleava-text-secondary line-clamp-1 mt-0.5">
                                                            {model.description}
                                                        </span>

                                                        <div className="flex items-center space-x-1 mt-1">
                                                            {model.capabilities.map((cap) => renderCapabilityIcon(cap))}
                                                        </div>
                                                    </div>

                                                    {isSelected && (
                                                        <Check className="w-3.5 h-3.5 text-kleava-accent shrink-0 mt-0.5" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ModelSelector;