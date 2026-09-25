import { ModelConfig } from '@/server/models/registry';
import { NormalizedError, normalizeUpstreamError } from '@/server/errors/normalized-error';

export interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamGeminiOptions {
  modelConfig: ModelConfig;
  message: string;
  history?: HistoryMessage[];
  contextEnvelope?: string;
  signal?: AbortSignal;
}

interface GeminiPart {
  text?: string;
  thought?: boolean;
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

export async function* streamGeminiResponse({
  modelConfig,
  message,
  history = [],
  contextEnvelope = '',
  signal,
}: StreamGeminiOptions): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new NormalizedError(
      'MISSING_API_KEY',
      500,
      'Server configuration error: GEMINI_API_KEY is missing in server environment.'
    );
  }

  const modelId = process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash';
  // Secure Header-only authentication - no API key in URL query string
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelId)}:streamGenerateContent?alt=sse`;

  const contents: GeminiContent[] = [];

  // Map conversation history
  for (const item of history) {
    if (!item.content || item.content.trim() === '') continue;
    contents.push({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    });
  }

  // Append user message with isolated context envelope
  const currentPrompt = contextEnvelope ? `${contextEnvelope}\n\n${message}` : message;
  contents.push({
    role: 'user',
    parts: [{ text: currentPrompt }],
  });

  // Construct generationConfig - omit thinkingConfig if budget <= 0
  const generationConfig: Record<string, unknown> = {
    temperature: modelConfig.temperature,
    topP: modelConfig.topP,
  };

  if (modelConfig.thinkingBudget > 0) {
    generationConfig.thinkingConfig = {
      thinkingBudget: modelConfig.thinkingBudget,
    };
  }

  const payload: Record<string, unknown> = {
    contents,
    systemInstruction: {
      parts: [{ text: modelConfig.systemInstruction }],
    },
    generationConfig,
  };

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (_err: unknown) {
    if (signal?.aborted) {
      throw new NormalizedError('STREAM_INTERRUPTED', 499, 'Request was aborted by the client.');
    }
    throw new NormalizedError('PROVIDER_UNAVAILABLE', 503, 'Failed to connect to the upstream AI service.');
  }

  if (!response.ok) {
    let errBody = '';
    try {
      errBody = await response.text();
    } catch {
      errBody = 'Unable to read upstream response body';
    }

    // Secure server log without leaking API credentials
    console.error('[Gemini Upstream Error]', {
      status: response.status,
      statusText: response.statusText,
      model: modelId,
      body: errBody,
    });

    throw normalizeUpstreamError(response.status, errBody);
  }

  if (!response.body) {
    throw new NormalizedError('INVALID_PROVIDER_RESPONSE', 502, 'Upstream service returned an empty stream body.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let lineBuffer = '';
  let yieldedAnyText = false;

  try {
    while (true) {
      if (signal?.aborted) {
        await reader.cancel();
        break;
      }

      const { done, value } = await reader.read();
      if (done) break;

      lineBuffer += decoder.decode(value, { stream: true });
      const lines = lineBuffer.split('\n');
      lineBuffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const jsonStr = trimmed.replace(/^data:\s*/, '');
        if (!jsonStr || jsonStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(jsonStr);

          // Handle prompt blocking (e.g. safety blocks)
          if (parsed?.promptFeedback?.blockReason) {
            throw new NormalizedError(
              'INVALID_REQUEST',
              400,
              `Prompt was blocked by safety policy: ${parsed.promptFeedback.blockReason}`
            );
          }

          const candidates = parsed?.candidates;
          if (Array.isArray(candidates)) {
            for (const candidate of candidates) {
              const parts = candidate?.content?.parts;
              if (Array.isArray(parts)) {
                for (const part of parts) {
                  // Only yield normal output text, skip thought/hidden parts
                  if (part.text && !part.thought) {
                    yield part.text;
                    yieldedAnyText = true;
                  }
                }
              }

              // Check if candidate finished due to safety
              if (candidate?.finishReason === 'SAFETY') {
                throw new NormalizedError(
                  'INVALID_REQUEST',
                  400,
                  'Response generation stopped due to content safety policy.'
                );
              }
            }
          }
        } catch (e) {
          if (e instanceof NormalizedError) {
            throw e;
          }
          // Continue on minor chunk parsing errors
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (!yieldedAnyText && !signal?.aborted) {
    throw new NormalizedError(
      'INVALID_PROVIDER_RESPONSE',
      502,
      'No text content was generated by the upstream model.'
    );
  }
}