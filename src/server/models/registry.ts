import { KLEAVA_SYSTEM_PROMPT } from './kleava.prompt';
import { KLEAVA_PRO_SYSTEM_PROMPT } from './kleava-pro.prompt';

export type PublicModelId = 'kleava' | 'kleava-pro';

export interface ModelConfig {
  id: PublicModelId;
  name: string;
  tagline: string;
  systemInstruction: string;
  temperature: number;
  topP: number;
  thinkingBudget: number;
}

export const MODEL_REGISTRY: Record<PublicModelId, ModelConfig> = {
  kleava: {
    id: 'kleava',
    name: 'Kleava',
    tagline: 'General-purpose AI companion. Direct, calm & concise.',
    systemInstruction: KLEAVA_SYSTEM_PROMPT,
    temperature: 0.7,
    topP: 0.95,
    thinkingBudget: 0,
  },
  'kleava-pro': {
    id: 'kleava-pro',
    name: 'Kleava Pro',
    tagline: 'Deep reasoning & systems architect. High-signal & structured.',
    systemInstruction: KLEAVA_PRO_SYSTEM_PROMPT,
    temperature: 0.2,
    topP: 0.85,
    thinkingBudget: 2048,
  },
};

export function resolveModelConfig(modelId?: string): ModelConfig {
  if (modelId === 'kleava-pro') {
    return MODEL_REGISTRY['kleava-pro'];
  }
  return MODEL_REGISTRY.kleava;
}