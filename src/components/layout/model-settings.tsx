'use client';

import React, { useState, useMemo } from 'react';
import {
    Sparkles,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Check,
    Cpu,
    Lock,
    Search,
    Key,
    Shield,
    Zap,
    Target,
    PenTool,
} from 'lucide-react';
import { useSettings } from '@/state/settings-context';
import {
    ModelProfile,
    ModelProvider,
    ResponseLengthMode,
    ModelCapability,
    ModelGroup,
} from '@/types';
import { GENERATION_PRESETS, GenerationPreset } from '@/config/models';
import {
    SettingsContent,
    SettingsSectionBlock,
    SettingsRow,
    SettingsDivider,
} from '@/components/layout/settings-content';
import { cn } from '@/lib/utils';

/**
 * ModelSettings: Complete AI Models, Model Registry, Provider Configuration,
 * API Key management, and Capability-aware Generation Parameters.
 */
export function ModelSettings() {
    const {
        models,
        activeModelId,
        generationConfig,
        setActiveModelId,
        updateGenerationConfig,
        applyGenerationPreset,
        addCustomModel,
        deleteCustomModel,
    } = useSettings();

    const [searchQuery, setSearchQuery] = useState('');
    const [providerFilter, setProviderFilter] = useState<string>('All');
    const [capabilityFilter, setCapabilityFilter] = useState<string>('All');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [modelToDeleteId, setModelToDeleteId] = useState<string | null>(null);

    // Form State for Add Custom Model
    const [formName, setFormName] = useState('');
    const [formProvider, setFormProvider] = useState<ModelProvider>('openai');
    const [formModelId, setFormModelId] = useState('');
    const [formApiKey, setFormApiKey] = useState('');
    const [formBaseUrl, setFormBaseUrl] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formCapabilities, setFormCapabilities] = useState<ModelCapability[]>([
        'text',
        'coding',
    ]);
    const [showApiKey, setShowApiKey] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const activeModel = models.find((m) => m.id === activeModelId) || models[0];
    const supportsReasoning = Boolean(
        activeModel?.capabilities.includes('reasoning') || activeModel?.id === 'auto'
    );
    const supportsVision = Boolean(
        activeModel?.capabilities.includes('vision') || activeModel?.id === 'auto'
    );

    const toggleCapability = (cap: ModelCapability) => {
        setFormCapabilities((prev) =>
            prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
        );
    };

    // Filter models by search query, provider, and capability
    const filteredModels = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();

        return models.filter((model) => {
            const matchesSearch =
                !q ||
                model.name.toLowerCase().includes(q) ||
                model.provider.toLowerCase().includes(q) ||
                model.description.toLowerCase().includes(q);

            const matchesProvider =
                providerFilter === 'All' || model.provider.toLowerCase() === providerFilter.toLowerCase();

            const matchesCapability =
                capabilityFilter === 'All' ||
                model.capabilities.includes(capabilityFilter as ModelCapability);

            return matchesSearch && matchesProvider && matchesCapability;
        });
    }, [models, searchQuery, providerFilter, capabilityFilter]);

    const handleSaveCustomModel = (e: React.FormEvent) => {
        e.preventDefault();
        const name = formName.trim();
        const id = formModelId.trim();
        const baseUrl = formBaseUrl.trim();

        if (!name || !id) {
            setFormError('Model Display Name and Model Identifier (ID) are required');
            return;
        }

        if (baseUrl && !/^https?:\/\/.+/i.test(baseUrl)) {
            setFormError('Endpoint Base URL must start with http:// or https://');
            return;
        }

        if (models.some((m) => m.id.toLowerCase() === id.toLowerCase())) {
            setFormError(`Model ID '${id}' already exists in registry`);
            return;
        }

        const success = addCustomModel({
            id,
            name,
            provider: formProvider,
            group: 'Custom',
            description: formDescription.trim() || `Custom ${formProvider.toUpperCase()} model`,
            capabilities: formCapabilities.length > 0 ? formCapabilities : ['text'],
            apiKey: formApiKey.trim() || undefined,
            baseUrl: baseUrl || undefined,
            isAvailable: true,
            availability: 'available',
        });

        if (success) {
            setActiveModelId(id);
            setFormName('');
            setFormModelId('');
            setFormApiKey('');
            setFormBaseUrl('');
            setFormDescription('');
            setFormCapabilities(['text', 'coding']);
            setFormError(null);
            setIsAddModalOpen(false);
        }
    };

    return (
        <SettingsContent
            sectionId="ai-models"
            title="AI Models & Registry"
            description="Configure model registry, custom provider endpoints, API keys, and generation behavior."
        >
            {/* 1. Model Registry Search & Filter Bar */}
            <SettingsSectionBlock title="Model Registry">
                <div className="flex flex-col space-y-2 select-none mb-2">
                    <div className="flex items-center space-x-1.5">
                        <div className="relative flex-1 flex items-center">
                            <Search className="absolute left-2.5 w-3.5 h-3.5 text-kleava-text-secondary/70 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search models or providers..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-kleava-md bg-kleava-surface-light/40 border border-kleava-border-subtle/70 text-xs text-kleava-text-primary placeholder:text-kleava-text-secondary/70 focus:outline-none focus:border-kleava-accent"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(true)}
                            className="h-8 px-2.5 rounded-kleava-md bg-kleava-accent text-white flex items-center space-x-1 text-xs font-medium hover:opacity-90 transition-opacity focus-ring-kleava flex-shrink-0"
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span className="hidden sm:inline">Add Model</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs">
                        <select
                            value={providerFilter}
                            onChange={(e) => setProviderFilter(e.target.value)}
                            className="flex-1 px-2 py-1 rounded-kleava-sm bg-kleava-surface border border-kleava-border-subtle/80 text-kleava-text-primary text-[11px] focus:outline-none font-medium"
                        >
                            <option value="All">All Providers</option>
                            <option value="kleava">Kleava Native</option>
                            <option value="openai">OpenAI</option>
                            <option value="anthropic">Anthropic</option>
                            <option value="google">Google</option>
                            <option value="custom">Custom / Local</option>
                        </select>

                        <select
                            value={capabilityFilter}
                            onChange={(e) => setCapabilityFilter(e.target.value)}
                            className="flex-1 px-2 py-1 rounded-kleava-sm bg-kleava-surface border border-kleava-border-subtle/80 text-kleava-text-primary text-[11px] focus:outline-none font-medium"
                        >
                            <option value="All">All Capabilities</option>
                            <option value="vision">Vision</option>
                            <option value="reasoning">Reasoning</option>
                            <option value="coding">Coding</option>
                            <option value="speed">Speed</option>
                        </select>
                    </div>
                </div>

                {/* Model Cards Feed */}
                <div className="flex flex-col space-y-1.5">
                    {filteredModels.length === 0 ? (
                        <div className="py-6 text-center text-xs text-kleava-text-secondary">
                            No matching models found in registry.
                        </div>
                    ) : (
                        filteredModels.map((model) => {
                            const isSelected = model.id === activeModelId;

                            return (
                                <div
                                    key={model.id}
                                    onClick={() => {
                                        if (model.isAvailable) {
                                            setActiveModelId(model.id);
                                        }
                                    }}
                                    className={cn(
                                        'w-full flex items-center justify-between p-2.5 rounded-kleava-md select-none border transition-all duration-150',
                                        isSelected
                                            ? 'bg-kleava-surface-soft border-kleava-accent/40 shadow-xs'
                                            : model.isAvailable
                                                ? 'bg-kleava-surface-light/30 border-kleava-border-subtle/50 hover:bg-kleava-surface-light/60 cursor-pointer'
                                                : 'bg-kleava-surface-soft/40 border-kleava-border-subtle/40 opacity-60 cursor-not-allowed'
                                    )}
                                >
                                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                                        <div className="w-6 h-6 rounded-full bg-kleava-surface flex items-center justify-center border border-kleava-border-subtle flex-shrink-0">
                                            {model.id === 'auto' ? (
                                                <Sparkles className="w-3.5 h-3.5 text-kleava-accent" />
                                            ) : (
                                                <Cpu className="w-3.5 h-3.5 text-kleava-text-secondary" />
                                            )}
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center space-x-1.5 flex-wrap gap-y-0.5">
                                                <span className="typography-label text-xs font-semibold truncate text-kleava-text-primary">
                                                    {model.name}
                                                </span>

                                                <span className="typography-metadata text-[8.5px] uppercase px-1 py-0.2 rounded bg-kleava-surface-soft text-kleava-text-secondary font-mono">
                                                    {model.provider}
                                                </span>

                                                {model.badge && (
                                                    <span className="typography-metadata text-[9px] uppercase px-1 py-0.2 rounded bg-kleava-accent/15 text-kleava-accent font-semibold">
                                                        {model.badge}
                                                    </span>
                                                )}

                                                {model.availability === 'config_required' && (
                                                    <span className="flex items-center space-x-0.5 text-[8.5px] text-amber-600 bg-amber-50 px-1 rounded font-medium">
                                                        <Lock className="w-2.5 h-2.5" />
                                                        <span>Config Required</span>
                                                    </span>
                                                )}
                                            </div>

                                            <span className="typography-metadata text-[10.5px] text-kleava-text-secondary truncate mt-0.5">
                                                {model.description}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                                        {model.isCustom && (
                                            <button
                                                type="button"
                                                aria-label={`Delete custom model ${model.name}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModelToDeleteId(model.id);
                                                }}
                                                className="p-1 rounded text-kleava-text-secondary hover:text-kleava-destructive hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}

                                        {isSelected && <Check className="w-4 h-4 text-kleava-accent stroke-[2.5]" />}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </SettingsSectionBlock>

            <SettingsDivider />

            {/* 2. Generation Presets */}
            <SettingsSectionBlock title="Response Presets">
                <div className="grid grid-cols-3 gap-1.5 select-none">
                    {(Object.keys(GENERATION_PRESETS) as GenerationPreset[]).map((key) => {
                        const preset = GENERATION_PRESETS[key];
                        const isMatched =
                            generationConfig.temperature === preset.config.temperature &&
                            generationConfig.responseLength === preset.config.responseLength;

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => applyGenerationPreset(key)}
                                className={cn(
                                    'flex flex-col items-start p-2 rounded-kleava-md border text-left transition-all',
                                    isMatched
                                        ? 'bg-kleava-surface-soft border-kleava-accent/60 shadow-xs'
                                        : 'bg-kleava-surface-light/30 border-kleava-border-subtle/50 hover:bg-kleava-surface-light/60'
                                )}
                            >
                                <div className="flex items-center space-x-1 mb-0.5">
                                    {key === 'balanced' && <Zap className="w-3 h-3 text-kleava-accent" />}
                                    {key === 'precise' && <Target className="w-3 h-3 text-blue-500" />}
                                    {key === 'creative' && <PenTool className="w-3 h-3 text-purple-500" />}
                                    <span className="typography-label text-[11px] font-semibold text-kleava-text-primary">
                                        {preset.label}
                                    </span>
                                </div>
                                <span className="typography-metadata text-[9px] text-kleava-text-secondary line-clamp-1">
                                    {preset.description}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </SettingsSectionBlock>

            <SettingsDivider />

            {/* 3. Parameter Controls */}
            <SettingsSectionBlock title="Parameters & Controls">
                {/* Temperature Slider */}
                <SettingsRow
                    label={`Temperature: ${generationConfig.temperature.toFixed(2)}`}
                    description="Balances creativity (1.0) and deterministic accuracy (0.0)"
                    control={
                        <input
                            type="range"
                            min="0.0"
                            max="1.0"
                            step="0.05"
                            aria-label="Temperature"
                            value={generationConfig.temperature}
                            onChange={(e) =>
                                updateGenerationConfig({ temperature: parseFloat(e.target.value) })
                            }
                            className="w-24 sm:w-28 accent-kleava-accent cursor-pointer"
                        />
                    }
                />

                {/* Response Length Segmented Control */}
                <SettingsRow
                    label="Response Length"
                    description="Target output verbosity threshold"
                    control={
                        <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80 select-none">
                            {(['short', 'balanced', 'detailed', 'maximum'] as ResponseLengthMode[]).map(
                                (mode) => {
                                    const isSelected = generationConfig.responseLength === mode;
                                    return (
                                        <button
                                            key={mode}
                                            type="button"
                                            role="radio"
                                            aria-checked={isSelected}
                                            onClick={() => updateGenerationConfig({ responseLength: mode })}
                                            className={cn(
                                                'px-1.5 py-0.5 rounded-kleava-sm typography-metadata text-[10px] capitalize transition-all',
                                                isSelected
                                                    ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                                                    : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                                            )}
                                        >
                                            {mode}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    }
                />

                {/* Streaming Toggle */}
                <SettingsRow
                    label="Stream Responses"
                    description="Render progressive token stream in real-time"
                    control={
                        <button
                            type="button"
                            role="switch"
                            aria-checked={generationConfig.streaming}
                            onClick={() =>
                                updateGenerationConfig({ streaming: !generationConfig.streaming })
                            }
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                generationConfig.streaming ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    generationConfig.streaming ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Reasoning Mode Toggle */}
                <SettingsRow
                    label="Deep Reasoning"
                    description={
                        supportsReasoning
                            ? 'Activate extended analytical reasoning mode on capable models'
                            : 'Current active model does not support reasoning mode'
                    }
                    className={cn(!supportsReasoning && 'opacity-60')}
                    control={
                        <button
                            type="button"
                            role="switch"
                            disabled={!supportsReasoning}
                            aria-checked={generationConfig.reasoningMode}
                            onClick={() =>
                                updateGenerationConfig({
                                    reasoningMode: !generationConfig.reasoningMode,
                                })
                            }
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                generationConfig.reasoningMode && supportsReasoning
                                    ? 'bg-kleava-accent'
                                    : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    generationConfig.reasoningMode && supportsReasoning
                                        ? 'translate-x-4'
                                        : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Vision Mode Toggle */}
                <SettingsRow
                    label="Vision Processing"
                    description={
                        supportsVision
                            ? 'Enable image understanding and multimodal attachment inputs'
                            : 'Vision mode requires a vision-capable model'
                    }
                    className={cn(!supportsVision && 'opacity-60')}
                    control={
                        <button
                            type="button"
                            role="switch"
                            disabled={!supportsVision}
                            aria-checked={generationConfig.visionEnabled}
                            onClick={() =>
                                updateGenerationConfig({
                                    visionEnabled: !generationConfig.visionEnabled,
                                })
                            }
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                generationConfig.visionEnabled && supportsVision
                                    ? 'bg-kleava-accent'
                                    : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    generationConfig.visionEnabled && supportsVision
                                        ? 'translate-x-4'
                                        : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Auto Model Selection Switch */}
                <SettingsRow
                    label="Auto Model Routing"
                    description="Dynamically select optimal model based on vision or reasoning requirements"
                    control={
                        <button
                            type="button"
                            role="switch"
                            aria-checked={generationConfig.autoModelSelection}
                            onClick={() => {
                                const next = !generationConfig.autoModelSelection;
                                updateGenerationConfig({ autoModelSelection: next });
                                if (next) {
                                    setActiveModelId('auto');
                                }
                            }}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                generationConfig.autoModelSelection
                                    ? 'bg-kleava-accent'
                                    : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    generationConfig.autoModelSelection
                                        ? 'translate-x-4'
                                        : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />
            </SettingsSectionBlock>

            {/* 4. Add Custom Model Modal Dialog */}
            {isAddModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Add AI Model"
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 animate-in fade-in duration-150 select-none font-ui"
                >
                    <div
                        className="w-full max-w-sm bg-kleava-surface rounded-kleava-lg border border-kleava-border-subtle shadow-kleava-floating p-4 flex flex-col space-y-3 font-ui"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-kleava-border-subtle/50">
                            <span className="typography-label font-semibold text-xs text-kleava-text-primary">
                                Add Custom AI Model
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
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

                        <form onSubmit={handleSaveCustomModel} className="flex flex-col space-y-2.5">
                            <div>
                                <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                                    Model Display Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. GPT-4o Mini"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 border border-kleava-border-subtle focus:outline-none focus:border-kleava-accent"
                                />
                            </div>

                            <div>
                                <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                                    Provider *
                                </label>
                                <select
                                    value={formProvider}
                                    onChange={(e) => setFormProvider(e.target.value as ModelProvider)}
                                    className="w-full px-2.5 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 border border-kleava-border-subtle focus:outline-none focus:border-kleava-accent font-medium"
                                >
                                    <option value="openai">OpenAI Compatible</option>
                                    <option value="anthropic">Anthropic Compatible</option>
                                    <option value="google">Google Gemini API</option>
                                    <option value="local">Local Model (Ollama / vLLM)</option>
                                    <option value="custom">Custom API Endpoint</option>
                                </select>
                            </div>

                            <div>
                                <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                                    Model Identifier (ID) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. gpt-4o-mini"
                                    value={formModelId}
                                    onChange={(e) => setFormModelId(e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 border border-kleava-border-subtle font-code focus:outline-none focus:border-kleava-accent"
                                />
                            </div>

                            <div>
                                <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                                    API Key (Stored locally in memory)
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showApiKey ? 'text' : 'password'}
                                        placeholder="sk-..."
                                        value={formApiKey}
                                        onChange={(e) => setFormApiKey(e.target.value)}
                                        className="w-full pl-2.5 pr-8 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 border border-kleava-border-subtle font-code focus:outline-none focus:border-kleava-accent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-2 text-kleava-text-secondary hover:text-kleava-text-primary"
                                    >
                                        {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                                    Base URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://api.openai.com/v1"
                                    value={formBaseUrl}
                                    onChange={(e) => setFormBaseUrl(e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 border border-kleava-border-subtle font-code focus:outline-none focus:border-kleava-accent"
                                />
                            </div>

                            {/* Capabilities Checkboxes */}
                            <div>
                                <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                                    Supported Capabilities
                                </label>
                                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                                    {(['text', 'vision', 'reasoning', 'coding', 'tools'] as ModelCapability[]).map(
                                        (cap) => (
                                            <button
                                                key={cap}
                                                type="button"
                                                onClick={() => toggleCapability(cap)}
                                                className={cn(
                                                    'px-2 py-0.5 rounded text-[10px] uppercase font-mono transition-colors border',
                                                    formCapabilities.includes(cap)
                                                        ? 'bg-kleava-accent/15 border-kleava-accent text-kleava-accent font-semibold'
                                                        : 'bg-kleava-surface-soft border-kleava-border-subtle text-kleava-text-secondary'
                                                )}
                                            >
                                                {cap}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-3 py-1.5 text-xs rounded bg-kleava-surface-soft text-kleava-text-secondary hover:text-kleava-text-primary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3.5 py-1.5 text-xs rounded bg-kleava-accent text-white font-medium hover:opacity-90 transition-opacity"
                                >
                                    Save Model
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 5. Delete Model Confirmation Dialog */}
            {modelToDeleteId && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 animate-in fade-in duration-150 select-none font-ui"
                >
                    <div className="w-full max-w-xs bg-kleava-surface rounded-kleava-lg border border-kleava-border-subtle shadow-kleava-floating p-4 flex flex-col space-y-3 font-ui text-center">
                        <span className="typography-label text-xs font-semibold text-kleava-destructive">
                            Delete Custom Model?
                        </span>
                        <p className="typography-metadata text-[11px] text-kleava-text-secondary">
                            This will remove the model profile and its API configurations from your browser.
                        </p>
                        <div className="flex items-center justify-center space-x-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setModelToDeleteId(null)}
                                className="px-3 py-1 text-xs rounded bg-kleava-surface-soft text-kleava-text-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    deleteCustomModel(modelToDeleteId);
                                    setModelToDeleteId(null);
                                }}
                                className="px-3 py-1 text-xs rounded bg-kleava-destructive text-white font-medium hover:opacity-90"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SettingsContent>
    );
}

export default ModelSettings;