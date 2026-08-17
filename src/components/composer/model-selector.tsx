'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
    ChevronDown,
    Check,
    Sparkles,
    Cpu,
    Lock,
    Code,
    Eye,
    Brain,
    FileText,
    Wrench,
    Key,
    EyeOff,
} from 'lucide-react';
import { useSettings } from '@/state/settings-context';
import { ModelGroup, ModelCapability, ModelProvider } from '@/types';
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
 * ModelSelector: Borderless trigger with an organic floating glass popover.
 * Features categorized model picker and an in-situ API Key & Provider Configuration section.
 */
export function ModelSelector({
    selectedModelId,
    onModelChange,
    disabled = false,
    className,
}: ModelSelectorProps) {
    const { models, configureProviderKey } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number>(0);

    // In-situ API Provider Config Form State
    const [showConfigSection, setShowConfigSection] = useState(false);
    const [configProvider, setConfigProvider] = useState<ModelProvider>('openai');
    const [configApiKey, setConfigApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const [configSuccessMessage, setConfigSuccessMessage] = useState<string | null>(null);
    const [configError, setConfigError] = useState<string | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

    const availableSelectable = useMemo(
        () => models.filter((m) => m.isAvailable),
        [models]
    );

    // Close on outside click or Escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setShowConfigSection(false);
                setConfigError(null);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                setShowConfigSection(false);
                setConfigError(null);
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

    // Keyboard navigation through model options
    const handleMenuKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!isOpen || showConfigSection || availableSelectable.length === 0) return;

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
                    triggerRef.current?.focus();
                }
            }
        },
        [isOpen, showConfigSection, availableSelectable, focusedIndex, onModelChange]
    );

    const handleSaveApiKey = (e: React.FormEvent) => {
        e.preventDefault();
        const key = configApiKey.trim();
        if (!key) {
            setConfigError('API Key cannot be empty');
            return;
        }

        configureProviderKey(configProvider, key);
        setConfigSuccessMessage(`Configured ${configProvider.toUpperCase()} successfully`);
        setConfigApiKey('');
        setConfigError(null);

        setTimeout(() => {
            setConfigSuccessMessage(null);
            setShowConfigSection(false);
        }, 1800);
    };

    const groups: ModelGroup[] = ['Recommended', 'Built-in', 'External Providers', 'Custom'];

    return (
        <div
            className={cn('relative inline-flex items-center select-none font-ui shrink-0', className)}
            ref={menuRef}
            onKeyDown={handleMenuKeyDown}
        >
            {/* Borderless 36px Height Trigger Button matching Attachment Button */}
            <button
                ref={triggerRef}
                type="button"
                aria-label={`Current AI model: ${currentModel?.name || 'Kleava 0.7'}. Click to change model.`}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'h-[36px] min-h-[36px] px-3 rounded-kleava-control flex items-center space-x-1.5 border-0 outline-none ring-0',
                    'bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-primary text-xs font-medium',
                    'hover:bg-kleava-surface-light dark:hover:bg-[#253531] hover:text-kleava-accent transition-colors',
                    'shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kleava-accent',
                    isOpen && 'bg-kleava-surface-light dark:bg-[#253531] text-kleava-accent',
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

            {/* Floating Glass-Morph Model Selection & API Config Panel */}
            {isOpen && (
                <div
                    role="menu"
                    aria-label="AI Model Registry Options"
                    className={cn(
                        'absolute left-0 bottom-11 z-50',
                        'w-[290px] sm:w-[320px] max-h-[380px] flex flex-col',
                        'bg-kleava-surface/95 dark:bg-[#151F1C]/95 backdrop-blur-xl',
                        'text-kleava-text-primary rounded-kleava-lg border border-kleava-border-subtle/30',
                        'shadow-[0_12px_36px_-4px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.6)] p-2 select-none',
                        'transform-gpu origin-bottom-left',
                        'animate-in fade-in zoom-in-90 duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]'
                    )}
                >
                    {/* Main Models List */}
                    <div className="flex-1 overflow-y-auto scrollbar-none space-y-2 pr-0.5 min-h-[120px]">
                        {groups.map((groupName) => {
                            const modelsInGroup = models.filter((m) => m.group === groupName);
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
                                                        setShowConfigSection(false);
                                                        triggerRef.current?.focus();
                                                    } else if (model.availability === 'config_required') {
                                                        // Quick jump to provider configuration
                                                        setConfigProvider(model.provider);
                                                        setShowConfigSection(true);
                                                    }
                                                }}
                                                className={cn(
                                                    'w-full flex items-start justify-between px-2.5 py-1.5 rounded-kleava-sm text-left',
                                                    'transition-colors duration-150 border-0 outline-none',
                                                    isSelected
                                                        ? 'bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-primary font-medium'
                                                        : model.isAvailable
                                                            ? 'text-kleava-text-primary hover:bg-kleava-surface-light dark:hover:bg-[#1E2A27]/60'
                                                            : 'text-kleava-text-secondary/60 hover:bg-amber-500/10 cursor-pointer'
                                                )}
                                            >
                                                <div className="flex flex-col min-w-0 pr-1.5">
                                                    <div className="flex items-center space-x-1.5 flex-wrap">
                                                        <span className="text-xs font-medium truncate">{model.name}</span>

                                                        <span className="typography-metadata text-[8.5px] uppercase px-1 py-0.2 rounded bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-secondary/80 font-mono">
                                                            {model.provider}
                                                        </span>

                                                        {model.badge && (
                                                            <span className="typography-metadata text-[8.5px] uppercase px-1 py-0.2 rounded bg-kleava-accent/15 text-kleava-accent font-semibold">
                                                                {model.badge}
                                                            </span>
                                                        )}

                                                        {!model.isAvailable && (
                                                            <span className="flex items-center space-x-0.5 text-[9px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-1 rounded font-medium">
                                                                <Lock className="w-2.5 h-2.5" />
                                                                <span>Setup API</span>
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
                        })}
                    </div>

                    {/* Bottom In-Situ API Provider Configuration Section */}
                    <div className="pt-2 mt-1.5 border-t border-kleava-border-subtle/30 flex flex-col space-y-1.5 shrink-0">
                        {!showConfigSection ? (
                            <button
                                type="button"
                                onClick={() => setShowConfigSection(true)}
                                className="w-full flex items-center justify-between px-2 py-1 rounded text-xs text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-light dark:hover:bg-[#1E2A27]/60 transition-colors"
                            >
                                <div className="flex items-center space-x-1.5">
                                    <Key className="w-3.5 h-3.5 text-kleava-accent" />
                                    <span>Configure Provider API Key</span>
                                </div>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                        ) : (
                            <div className="p-2 rounded-kleava-md bg-kleava-surface-light/40 dark:bg-[#1E2A27]/60 flex flex-col space-y-2 animate-in fade-in duration-150">
                                <div className="flex items-center justify-between pb-1 border-b border-kleava-border-subtle/30">
                                    <span className="typography-metadata text-[10.5px] font-semibold text-kleava-text-primary">
                                        Provider Credentials
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowConfigSection(false);
                                            setConfigError(null);
                                        }}
                                        className="text-[10px] text-kleava-text-secondary hover:text-kleava-text-primary"
                                    >
                                        Close
                                    </button>
                                </div>

                                {configSuccessMessage && (
                                    <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[10px]">
                                        {configSuccessMessage}
                                    </div>
                                )}

                                {configError && (
                                    <div className="p-1 rounded bg-red-50 dark:bg-red-950/30 text-kleava-destructive text-[10px]">
                                        {configError}
                                    </div>
                                )}

                                <form onSubmit={handleSaveApiKey} className="flex flex-col space-y-1.5">
                                    <div>
                                        <label className="typography-metadata text-[9.5px] text-kleava-text-secondary block mb-0.5">
                                            Company / Provider
                                        </label>
                                        <select
                                            value={configProvider}
                                            onChange={(e) => setConfigProvider(e.target.value as ModelProvider)}
                                            className="w-full px-2 py-1 rounded bg-kleava-surface dark:bg-[#151F1C] border border-kleava-border-subtle text-xs text-kleava-text-primary focus:outline-none focus:border-kleava-accent font-medium"
                                        >
                                            <option value="openai">OpenAI (GPT-4o)</option>
                                            <option value="anthropic">Anthropic (Claude 3.5)</option>
                                            <option value="google">Google (Gemini 1.5)</option>
                                            <option value="custom">Custom Provider</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="typography-metadata text-[9.5px] text-kleava-text-secondary block mb-0.5">
                                            API Key (Encrypted in memory)
                                        </label>
                                        <div className="relative flex items-center">
                                            <input
                                                type={showApiKey ? 'text' : 'password'}
                                                value={configApiKey}
                                                onChange={(e) => setConfigApiKey(e.target.value)}
                                                placeholder="sk-..."
                                                className="w-full pl-2 pr-7 py-1 rounded bg-kleava-surface dark:bg-[#151F1C] border border-kleava-border-subtle text-xs font-mono text-kleava-text-primary focus:outline-none focus:border-kleava-accent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowApiKey(!showApiKey)}
                                                className="absolute right-1.5 text-kleava-text-secondary/70 hover:text-kleava-text-primary"
                                            >
                                                {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-1 text-xs rounded bg-kleava-accent text-white font-medium hover:opacity-90 transition-opacity focus-ring-kleava mt-1"
                                    >
                                        Save & Activate
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ModelSelector;