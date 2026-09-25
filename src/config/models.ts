import { ModelProfile, ModelGenerationConfig } from '@/types';

export const DEFAULT_MODEL_ID = 'kleava';

export const DEFAULT_GENERATION_CONFIG: ModelGenerationConfig = {
  temperature: 0.7,
  responseLength: 'balanced',
  streaming: true,
  reasoningMode: true,
  visionEnabled: false,
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
      reasoningMode: false,
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
    description: 'Exploratory and expressive writing',
    config: {
      temperature: 0.9,
      responseLength: 'maximum',
      reasoningMode: false,
    },
  },
};

export const BUILTIN_MODELS: ModelProfile[] = [
  {
    id: 'kleava',
    name: 'Kleava',
    provider: 'kleava',
    group: 'Recommended',
    type: 'builtin',
    description: 'General-purpose AI companion. Direct, calm & concise.',
    capabilities: ['text', 'coding', 'speed'],
    badge: 'Default',
    isDefault: true,
    isAvailable: true,
    availability: 'available',
    supportsStreaming: true,
    supportsVision: false,
    supportsReasoning: false,
  },
  {
    id: 'kleava-pro',
    name: 'Kleava Pro',
    provider: 'kleava',
    group: 'Recommended',
    type: 'builtin',
    description: 'Deep reasoning & systems architect. High-signal & structured.',
    capabilities: ['text', 'reasoning', 'coding'],
    badge: 'Pro',
    isAvailable: true,
    availability: 'available',
    supportsStreaming: true,
    supportsVision: false,
    supportsReasoning: true,
  },
];