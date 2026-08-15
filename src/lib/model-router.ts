import { ModelProfile } from '@/types';
import { DEFAULT_MODEL_ID } from '@/config/models';

export interface ResolveModelOptions {
    modelId: string;
    hasAttachments?: boolean;
    models: ModelProfile[];
}

/**
 * Resolves the effective model profile based on user selection or Auto routing rules.
 * Pure deterministic strategy boundary ready for future capability router.
 */
export function resolveEffectiveModel({
    modelId,
    hasAttachments = false,
    models,
}: ResolveModelOptions): ModelProfile {
    const fallbackModel =
        models.find((m) => m.id === DEFAULT_MODEL_ID) || models[0];

    // 1. If explicit model chosen
    if (modelId !== 'auto') {
        const matched = models.find((m) => m.id === modelId && m.isAvailable);
        return matched || fallbackModel;
    }

    // 2. Auto Mode Strategy Routing
    if (hasAttachments) {
        const visionModel = models.find(
            (m) => m.isAvailable && m.capabilities.includes('vision') && m.id !== 'auto'
        );
        if (visionModel) return visionModel;
    }

    return fallbackModel;
}