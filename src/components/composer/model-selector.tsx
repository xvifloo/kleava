'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles, Cpu, Lock } from 'lucide-react';
import { useSettings } from '@/state/settings-context';
import { ModelGroup } from '@/types';
import { cn } from '@/lib/utils';

export interface ModelSelectorProps {
    selectedModelId: string;
    onModelChange: (modelId: string) => void;
    disabled?: boolean;
    className?: string;
}

/**
 * ModelSelector: Dedicated multi-model picker popover synchronized with
 * global Settings state and custom user-added model profiles.
 */
export function ModelSelector({
    selectedModelId,
    onModelChange,
    disabled = false,
    className,
}: ModelSelectorProps) {
    const { models } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

    // Close on outside click or Escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
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

    const groups: ModelGroup[] = ['Recommended', 'Kleava', 'Custom', 'External Providers'];

    return (
        <div className={cn('relative inline-flex items-center', className)} ref={menuRef}>
            {/* Compact Trigger Button */}
            <button
                type="button"
                aria-label="Select AI model"
                aria-expanded={isOpen}
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'h-7 px-2.5 rounded-kleava-control flex items-center space-x-1.5 font-ui',
                    'bg-kleava-surface-soft text-kleava-text-primary text-xs font-medium',
                    'hover:bg-kleava-surface-light hover:text-kleava-accent transition-colors',
                    'border border-kleava-border-subtle/50',
                    'focus-ring-kleava select-none',
                    disabled && 'opacity-60 cursor-not-allowed'
                )}
            >
                {currentModel?.id === 'auto' ? (
                    <Sparkles className="w-3 h-3 text-kleava-accent flex-shrink-0" />
                ) : (
                    <Cpu className="w-3 h-3 text-kleava-text-secondary flex-shrink-0" />
                )}
                <span className="truncate max-w-[90px] sm:max-w-[120px]">{currentModel?.name || 'Kleava 0.7'}</span>
                <ChevronDown className="w-3 h-3 text-kleava-text-secondary flex-shrink-0" />
            </button>

            {/* Popover Menu Window */}
            {isOpen && (
                <div
                    role="menu"
                    aria-label="AI Model Options"
                    className={cn(
                        'absolute left-0 bottom-9 z-50 font-ui',
                        'w-[270px] sm:w-[290px] max-h-[320px] overflow-y-auto scrollbar-none',
                        'bg-kleava-surface text-kleava-text-primary',
                        'rounded-kleava-md border border-kleava-border-subtle/80',
                        'shadow-kleava-floating p-1.5 flex flex-col space-y-2 select-none',
                        'animate-in fade-in zoom-in-95 duration-150 origin-bottom-left'
                    )}
                >
                    {groups.map((groupName) => {
                        const modelsInGroup = models.filter((m) => m.group === groupName);
                        if (modelsInGroup.length === 0) return null;

                        return (
                            <div key={groupName} className="flex flex-col space-y-0.5">
                                {/* Group Heading */}
                                <div className="px-2 py-0.5">
                                    <span className="typography-metadata uppercase tracking-wider text-[10px] font-semibold text-kleava-text-secondary/70">
                                        {groupName}
                                    </span>
                                </div>

                                {/* Model Options */}
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
                                                <div className="flex items-center space-x-1.5">
                                                    <span className="text-xs font-medium truncate">{model.name}</span>
                                                    {model.badge && (
                                                        <span className="typography-metadata text-[9px] uppercase px-1 py-0.2 rounded bg-kleava-accent/15 text-kleava-accent font-semibold">
                                                            {model.badge}
                                                        </span>
                                                    )}
                                                    {model.isCustom && (
                                                        <span className="typography-metadata text-[9px] uppercase px-1 py-0.2 rounded bg-blue-50 text-blue-600 font-semibold">
                                                            Custom
                                                        </span>
                                                    )}
                                                    {!model.isAvailable && (
                                                        <span className="flex items-center space-x-0.5 text-[9px] text-kleava-text-secondary/60">
                                                            <Lock className="w-2.5 h-2.5" />
                                                            <span>Config</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="typography-metadata text-[10.5px] text-kleava-text-secondary/80 line-clamp-1 mt-0.5 font-normal">
                                                    {model.description}
                                                </span>
                                            </div>

                                            {/* Selected Checkmark */}
                                            {isSelected && (
                                                <Check className="w-3.5 h-3.5 text-kleava-accent flex-shrink-0 mt-0.5" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ModelSelector;