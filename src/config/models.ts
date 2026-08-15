import { ModelProfile, ModelGenerationConfig } from '@/types';

export const DEFAULT_MODEL_ID = 'kleava-0.7';

export const DEFAULT_GENERATION_CONFIG: ModelGenerationConfig = {
    temperature: 0.7,
    responseLength: 'balanced',
    streaming: true,
    reasoningMode: true,
    visionEnabled: true,
};

/**
 * Built-in Core Models Catalogue
 */
export const BUILTIN_MODELS: ModelProfile[] = [
    {
        id: 'auto',
        name: 'Auto',
        provider: 'kleava',
        group: 'Recommended',
        description: 'Dynamic capability-based routing to optimal model',
        capabilities: ['speed', 'reasoning'],
        badge: 'Smart',
        isAvailable: true,
        isAutoRoutable: true,
    },
    {
        id: 'kleava-0.7',
        name: 'Kleava 0.7',
        provider: 'kleava',
        group: 'Kleava',
        description: 'Flagship balanced model for writing, reasoning and code',
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
        description: 'Fast lightweight model optimized for quick everyday queries',
        capabilities: ['speed'],
        isAvailable: true,
        contextWindow: 64000,
    },
];