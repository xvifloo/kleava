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
      'Server configuration error: Gemini API key is missing. Please check server environment.'
    );
  }

  const modelId = process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent?alt=sse`;

  const contents: GeminiContent[] = [];

  for (const item of history) {
    if (!item.content || item.content.trim() === '') continue;
    contents.push({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    });
  }

  const currentPrompt = contextEnvelope ? `${contextEnvelope}\n\n${message}` : message;
  contents.push({
    role: 'user',
    parts: [{ text: currentPrompt }],
  });

  const payload: Record<string, unknown> = {
    contents,
    systemInstruction: {
      parts: [{ text: modelConfig.systemInstruction }],
    },
    generationConfig: {
      temperature: modelConfig.temperature,
      topP: modelConfig.topP,
      ...(modelConfig.thinkingBudget > 0
        ? {
            thinkingConfig: {
              thinkingBudget: modelConfig.thinkingBudget,
            },
          }
        : {
            thinkingConfig: {
              thinkingBudget: 0,
            },
          }),
    },
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
    throw normalizeUpstreamError(response.status);
  }

  if (!response.body) {
    throw new NormalizedError('INVALID_PROVIDER_RESPONSE', 502, 'Upstream service returned an empty stream.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let lineBuffer = '';

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
          const candidates = parsed?.candidates;
          if (Array.isArray(candidates) && candidates.length > 0) {
            const parts = candidates[0]?.content?.parts;
            if (Array.isArray(parts)) {
              for (const part of parts) {
                if (part.text && !part.thought) {
                  yield part.text;
                }
              }
            }
          }
        } catch {
          // Ignore malformed line and continue
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}