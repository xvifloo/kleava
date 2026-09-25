import { ModelConfig } from '@/server/models/registry';
import { streamGeminiResponse, HistoryMessage } from '@/server/adapters/gemini.adapter';
import { streamGroqResponse } from '@/server/adapters/groq.adapter';
import { NormalizedError } from '@/server/errors/normalized-error';

export interface StreamChatRouterOptions {
  modelConfig: ModelConfig;
  message: string;
  history?: HistoryMessage[];
  contextEnvelope?: string;
  signal?: AbortSignal;
}

/**
 * Determines whether the upstream error allows falling back to secondary provider.
 * Retryable: 429, 500, 502, 503, 504, temporary network/provider errors.
 * Non-retryable: 400 (Bad request), 401/403 (Invalid key/unauthorized), user client aborts.
 */
function isRetryableProviderError(err: unknown): boolean {
  if (err instanceof NormalizedError) {
    if (
      err.code === 'RATE_LIMIT' ||
      err.code === 'QUOTA_EXCEEDED' ||
      err.code === 'PROVIDER_UNAVAILABLE' ||
      err.code === 'PROVIDER_TIMEOUT' ||
      err.code === 'INVALID_PROVIDER_RESPONSE' ||
      (err.code === 'INTERNAL_ERROR' && err.statusCode >= 500)
    ) {
      return true;
    }
    return false;
  }

  if (err && typeof err === 'object' && 'statusCode' in err) {
    const status = Number((err as { statusCode: unknown }).statusCode);
    return status === 429 || status >= 500;
  }

  return true;
}

export async function* streamChatWithFallback(
  options: StreamChatRouterOptions
): AsyncGenerator<string, void, unknown> {
  const primaryModel = process.env.GEMINI_MODEL_ID || 'gemini-3.8-flash';
  const fallbackModel =
    options.modelConfig.id === 'kleava-pro'
      ? process.env.GROQ_KLEAVA_PRO_MODEL || options.modelConfig.groqModel || 'openai/gpt-oss-120b'
      : process.env.GROQ_KLEAVA_MODEL || options.modelConfig.groqModel || 'openai/gpt-oss-20b';

  console.log(`[AI Provider] primary=gemini model=${primaryModel} publicId=${options.modelConfig.id}`);

  let primaryFailed = false;
  let primaryError: unknown = null;

  try {
    const geminiGenerator = streamGeminiResponse(options);
    for await (const chunk of geminiGenerator) {
      if (options.signal?.aborted) return;
      yield chunk;
    }
    return;
  } catch (err: unknown) {
    if (options.signal?.aborted) throw err;
    primaryFailed = true;
    primaryError = err;

    const status =
      err instanceof NormalizedError
        ? err.statusCode
        : (err as { statusCode?: number })?.statusCode || 500;

    console.warn(`[AI Provider] primary failed status=${status}. Evaluating fallback eligibility...`);

    if (!isRetryableProviderError(err)) {
      console.warn(`[AI Provider] error is not retryable/fallback eligible (${status}). Aborting fallback.`);
      throw err;
    }
  }

  // Fallback to Groq
  if (primaryFailed) {
    const hasGroqKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '');

    if (!hasGroqKey) {
      console.error('[AI Provider] Groq fallback failed: GROQ_API_KEY is not configured.');
      throw primaryError;
    }

    console.log(`[AI Provider] fallback=groq model=${fallbackModel} publicId=${options.modelConfig.id}`);

    try {
      const groqGenerator = streamGroqResponse(options);
      for await (const chunk of groqGenerator) {
        if (options.signal?.aborted) return;
        yield chunk;
      }
    } catch (groqErr: unknown) {
      if (options.signal?.aborted) throw groqErr;
      console.error('[AI Provider] fallback groq also failed.');
      throw new NormalizedError(
        'PROVIDER_UNAVAILABLE',
        503,
        'Both AI providers are temporarily unavailable. Please try again shortly.'
      );
    }
  }
}