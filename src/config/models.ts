import { ModelProfile } from '@/types';

/**
 * KLEAVA AI — CENTRALIZED MODEL REGISTRY
 * Authoritative registry of all internal, external, and automated AI models.
 */
export const MODELS_REGISTRY: ModelProfile[] = [
    // Recommended Group
    {
        id: 'auto',
        name: 'Auto',
        provider: 'kleava',
        group: 'Recommended',
        description: 'Dynamic capability-based routing to the optimal model',
        capabilities: ['speed', 'reasoning'],
        badge: 'Smart',
        isAvailable: true,
        isAutoRoutable: true,
    },

    // Kleava Native Group
    {
        id: 'kleava-0.7',
        name: 'Kleava 0.7',
        provider: 'kleava',
        group: 'Kleava',
        description: 'Balanced flagship model for natural writing, code & reasoning',
        capabilities: ['speed', 'reasoning', 'coding', 'vision'],
        badge: 'Default',
        isDefault: true,
        isAvailable: true,
        contextWindow: 128000,
    },
    {
        id: 'kleava-light',
        name: 'Kleava Light',
        provider: 'kleava',
        group: 'Kleava',
        description: 'Ultra-fast lightweight model for quick daily tasks',
        capabilities: ['speed'],
        isAvailable: true,
        contextWindow: 64000,
    },

    // Future External Providers (Extensible Structure)
    {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        group: 'External Providers',
        description: 'Anthropic high-reasoning coding and analytical model',
        capabilities: ['reasoning', 'coding', 'vision'],
        isAvailable: false,
        requiresApiKey: true,
    },
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        group: 'External Providers',
        description: 'OpenAI versatile multimodal flagship model',
        capabilities: ['speed', 'reasoning', 'vision'],
        isAvailable: false,
        requiresApiKey: true,
    },
];

export const DEFAULT_MODEL_ID = 'kleava-0.7';

/**
 * Helper to get a model profile by ID
 */
export function getModelById(id: string): ModelProfile {
    const found = MODELS_REGISTRY.find((m) => m.id === id);
    return found || MODELS_REGISTRY.find((m) => m.id === DEFAULT_MODEL_ID) || MODELS_REGISTRY[0];
}