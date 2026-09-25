import { ModelGenerationConfig, ModelProfile, ResponseLengthMode } from '@/types';

/**
 * Maps human-readable response length modes to internal target token thresholds.
 */
export function mapResponseLengthToTokens(mode: ResponseLengthMode): number {
    switch (mode) {
        case 'short':
            return 512;
        case 'balanced':
            return 2048;
        case 'detailed':
            return 4096;
        case 'maximum':
            return 8192;
        default:
            return 2048;
    }
}

/**
 * Resolves generation parameters against active model capabilities.
 * If a capability (like vision or reasoning) is unsupported by the model,
 * it is safely omitted from request execution without destroying user settings.
 */
export function resolveEffectiveGenerationConfig({
    globalConfig,
    model,
}: {
    globalConfig: ModelGenerationConfig;
    model?: ModelProfile;
}): ModelGenerationConfig & {
    maxTokens: number;
    supportsVision: boolean;
    supportsReasoning: boolean;
    supportsStreaming: boolean;
    effectiveTemperature: number;
} {
    const supportsVision = Boolean(
        model?.capabilities.includes('vision') || model?.id === 'auto'
    );
    const supportsReasoning = Boolean(
        model?.capabilities.includes('reasoning') || model?.id === 'auto'
    );
    const supportsStreaming = model?.supportsStreaming !== false;

    const clampedTemp = Math.min(Math.max(globalConfig.temperature, 0.0), 1.0);

    return {
        ...globalConfig,
        temperature: clampedTemp,
        effectiveTemperature: clampedTemp,
        maxTokens: mapResponseLengthToTokens(globalConfig.responseLength),
        streaming: supportsStreaming && globalConfig.streaming,
        reasoningMode: supportsReasoning && globalConfig.reasoningMode,
        visionEnabled: supportsVision && globalConfig.visionEnabled,
        supportsVision,
        supportsReasoning,
        supportsStreaming,
    };
}

/**
 * Compiles a safe, provider-agnostic request parameters payload (excluding API keys).
 */
export function compileModelPayload({
    prompt,
    config,
    model,
}: {
    prompt: string;
    config: ModelGenerationConfig;
    model: ModelProfile;
}) {
    const resolved = resolveEffectiveGenerationConfig({ globalConfig: config, model });

    return {
        modelId: model.id,
        provider: model.provider,
        prompt,
        temperature: resolved.effectiveTemperature,
        maxTokens: resolved.maxTokens,
        stream: resolved.streaming,
        reasoning: resolved.reasoningMode,
        vision: resolved.visionEnabled,
    };
}