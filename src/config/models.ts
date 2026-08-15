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
        description: 'Deterministic reasoning for coding and analytical tasks',
        config: {
            temperature: 0.2,
            responseLength: 'detailed',
            reasoningMode: true,
        },
    },
    creative: {
        label: 'Creative',
        description: 'High-temperature exploratory and expressive writing',
        config: {
            temperature: 0.95,
            responseLength: 'maximum',
            reasoningMode: false,
        },
    },
};

/**
 * Built-in Core Models Registry with Availability & Capability flags
 */
export const BUILTIN_MODELS: ModelProfile[] = [
    // 1. Recommended Auto Model
    {
        id: 'auto',
        name: 'Auto',
        provider: 'kleava',
        group: 'Recommended',
        type: 'builtin',
        description: 'Dynamic task-adaptive routing based on vision, code, and complexity',
        capabilities: ['text', 'vision', 'reasoning', 'coding', 'speed', 'tools'],
        badge: 'Smart',
        isAvailable: true,
        availability: 'available',
        supportsStreaming: true,
        supportsVision: true,
        supportsReasoning: true,
        isAutoRoutable: true,
    },

    // 2. Kleava Flagship Native
    {
        id: 'kleava-0.7',
        name: 'Kleava 0.7',
        provider: 'kleava',
        group: 'Built-in',
        type: 'builtin',
        description: 'Flagship balanced model for writing, reasoning, code, and multimodal tasks',
        capabilities: ['text', 'vision', 'reasoning', 'coding', 'speed', 'tools'],
        badge: 'Default',
        isDefault: true,
        isAvailable: true,
        availability: 'available',
        supportsStreaming: true,
        supportsVision: true,
        supportsReasoning: true,
        contextWindow: 128000,
    },

    // 3. Kleava Fast Lightweight
    {
        id: 'kleava-light',
        name: 'Kleava Light',
        provider: 'kleava',
        group: 'Built-in',
        type: 'builtin',
        description: 'Ultra-fast lightweight model optimized for quick daily queries and iterations',
        capabilities: ['text', 'coding', 'speed'],
        isAvailable: true,
        availability: 'available',
        supportsStreaming: true,
        supportsVision: false,
        supportsReasoning: false,
        contextWindow: 64000,
    },

    // 4. External Provider Models (Configuration Required)
    {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        group: 'External Providers',
        type: 'builtin',
        description: 'Anthropic high-reasoning multimodal model for advanced coding and analysis',
        capabilities: ['text', 'vision', 'reasoning', 'coding', 'tools'],
        isAvailable: false,
        availability: 'config_required',
        requiresApiKey: true,
        supportsStreaming: true,
        supportsVision: true,
        supportsReasoning: true,
        contextWindow: 200000,
    },
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        group: 'External Providers',
        type: 'builtin',
        description: 'OpenAI flagship multimodal model with vision, speech, and tool capabilities',
        capabilities: ['text', 'vision', 'reasoning', 'coding', 'speed', 'tools'],
        isAvailable: false,
        availability: 'config_required',
        requiresApiKey: true,
        supportsStreaming: true,
        supportsVision: true,
        supportsReasoning: true,
        contextWindow: 128000,
    },
    {
        id: 'gemini-1-5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        group: 'External Providers',
        type: 'builtin',
        description: 'Google multimodal model featuring massive 2M token context window',
        capabilities: ['text', 'vision', 'reasoning', 'coding', 'tools'],
        isAvailable: false,
        availability: 'config_required',
        requiresApiKey: true,
        supportsStreaming: true,
        supportsVision: true,
        supportsReasoning: true,
        contextWindow: 2000000,
    },
];