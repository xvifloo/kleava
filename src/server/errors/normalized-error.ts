export type ErrorCode =
  | 'INVALID_REQUEST'
  | 'MISSING_API_KEY'
  | 'INVALID_API_KEY'
  | 'RATE_LIMIT'
  | 'QUOTA_EXCEEDED'
  | 'PROVIDER_UNAVAILABLE'
  | 'PROVIDER_TIMEOUT'
  | 'INVALID_PROVIDER_RESPONSE'
  | 'STREAM_INTERRUPTED'
  | 'INTERNAL_ERROR';

export class NormalizedError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly userMessage: string;

  constructor(code: ErrorCode, statusCode: number, userMessage: string) {
    super(userMessage);
    this.name = 'NormalizedError';
    this.code = code;
    this.statusCode = statusCode;
    this.userMessage = userMessage;
  }
}

export function normalizeUpstreamError(status: number, rawBody?: string): NormalizedError {
  let parsedMessage = '';
  if (rawBody) {
    try {
      const parsed = JSON.parse(rawBody);
      parsedMessage = parsed?.error?.message || '';
    } catch {
      parsedMessage = rawBody.slice(0, 200);
    }
  }

  if (status === 400) {
    if (parsedMessage.toLowerCase().includes('api key')) {
      return new NormalizedError('INVALID_API_KEY', 401, 'Invalid Gemini API key. Please check your server configuration.');
    }
    return new NormalizedError(
      'INVALID_REQUEST',
      400,
      parsedMessage || 'The request was invalid. Please check your message and try again.'
    );
  }
  if (status === 401 || status === 403) {
    return new NormalizedError(
      'INVALID_API_KEY',
      401,
      'Gemini API authentication failed. Please verify your GEMINI_API_KEY in .env.local.'
    );
  }
  if (status === 404) {
    return new NormalizedError(
      'INVALID_REQUEST',
      404,
      `Requested model not found. (${parsedMessage || 'Please verify GEMINI_MODEL_ID'})`
    );
  }
  if (status === 429) {
    return new NormalizedError(
      'RATE_LIMIT',
      429,
      'Gemini API quota or rate limit exceeded. Please wait a moment and try again.'
    );
  }
  if (status === 503 || status === 502) {
    return new NormalizedError(
      'PROVIDER_UNAVAILABLE',
      503,
      'Gemini service is temporarily unavailable. Please try again shortly.'
    );
  }
  if (status === 504) {
    return new NormalizedError(
      'PROVIDER_TIMEOUT',
      504,
      'Gemini request timed out. Please try again.'
    );
  }
  return new NormalizedError(
    'INTERNAL_ERROR',
    500,
    parsedMessage || 'An unexpected error occurred while communicating with the AI service.'
  );
}