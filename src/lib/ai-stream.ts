import { ComposerAttachment } from '@/types';

export interface StreamCallbacks {
  onChunk: (accumulatedText: string, chunk: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

export interface StreamController {
  cancel: () => void;
}

export interface AiStreamPayload {
  modelId: string;
  prompt: string;
  attachments?: ComposerAttachment[];
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  memories?: Array<{ type?: string; scope?: string; content: string }>;
  personalization?: Record<string, string>;
}

export function startAiStream(
  payload: AiStreamPayload,
  callbacks: StreamCallbacks
): StreamController {
  const abortController = new AbortController();
  let accumulated = '';

  const runStream = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: payload.modelId,
          message: payload.prompt,
          history: payload.history || [],
          memories: payload.memories || [],
          personalization: payload.personalization || {},
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        let errorMsg = 'Failed to generate response.';
        try {
          const errData = await response.json();
          if (errData?.error?.message) {
            errorMsg = errData.error.message;
          }
        } catch {
          // Fallback to default message
        }
        callbacks.onError(new Error(errorMsg));
        return;
      }

      if (!response.body) {
        callbacks.onError(new Error('No response body returned from server.'));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let lineBuffer = '';

      while (true) {
        if (abortController.signal.aborted) {
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
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            if (event.type === 'chunk' && typeof event.text === 'string') {
              accumulated += event.text;
              callbacks.onChunk(accumulated, event.text);
            } else if (event.type === 'done') {
              callbacks.onComplete(accumulated);
              return;
            } else if (event.type === 'error') {
              callbacks.onError(new Error(event.message || 'Error occurred during generation.'));
              return;
            }
          } catch {
            // Ignore partial/malformed JSON in stream and continue
          }
        }
      }

      callbacks.onComplete(accumulated);
    } catch (err: unknown) {
      if (abortController.signal.aborted) {
        return;
      }
      const message = err instanceof Error ? err.message : 'Network error occurred.';
      callbacks.onError(new Error(message));
    }
  };

  runStream();

  return {
    cancel: () => {
      abortController.abort();
    },
  };
}