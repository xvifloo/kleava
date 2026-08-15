import { ModelProfile, ModelGenerationConfig } from '@/types';

export const DEFAULT_MODEL_ID = 'kleava-0.7';

export const DEFAULT_GENERATION_CONFIG: ModelGenerationConfig = {
    temperature: 0.7,
    responseLength: 'balanced',
    streaming: true,
    reasoningMode: true,
    visionEnabled: true,
    autoModelSelection: false,
};

export type GenerationPreset = 'balanced' | 'precise' | 'creative';

export const GENERATION_PRESETS: Record<
    GenerationPreset,
    { label: string; description: string; config: Partial<ModelGenerationConfig> }
> = {
    balanced: {
        label: 'Balanced',
        description: 'Standard balanced creativity and accuracy',
        config: {
            temperature: 0.7,
            responseLength: 'balanced',
            reasoningMode: true,
        },
    },
    precise: {
        label: 'Precise / Code',
        description: 'Deterministic, low-temperature reasoning for coding and technical tasks',
        config: {
            temperature: 0.2,
            responseLength: 'long',
            reasoningMode: true,
        },
    },
    creative: {
        label: 'Creative',
        description: 'High-temperature exploratory and expressive writing',
        config: {
            temperature: 0.95,
            responseLength: 'long',
            reasoningMode: false,
        },
    },
};

/**
 * Built-in Core Models Registry (Immutable system defaults)
 */
export const BUILTIN_MODELS: ModelProfile[] = [
    {
        id: 'auto',
        name: 'Auto',
        provider: 'kleava',
        group: 'Recommended',
        type: 'builtin',
        description: 'Dynamic capability-based routing to optimal model',
        capabilities: ['text', 'vision', 'reasoning', 'coding', 'speed'],
        badge: 'Smart',
        isAvailable: true,
        isAutoRoutable: true,
    },
    {
        id: 'kleava-0.7',
        name: 'Kleava 0.7',
        provider: 'kleava',
        group: 'Built-in',
        type: 'builtin',
        description: 'Flagship balanced model for writing, reasoning, and code',
        capabilities: ['text', 'vision', 'reasoning', 'coding', 'speed'],
        badge: 'Default',
        isDefault: true,
        isAvailable: true,
        contextWindow: 128000,
    },
    {
        id: 'kleava-light',
        name: 'Kleava Light',
        provider: 'kleava',
        group: 'Built-in',
        type: 'builtin',
        description: 'Fast lightweight model optimized for quick everyday queries',
        capabilities: ['text', 'coding', 'speed'],
        isAvailable: true,
        contextWindow: 64000,
    },
];