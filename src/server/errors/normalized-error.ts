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

export function normalizeUpstreamError(status: number, _message?: string): NormalizedError {
  if (status === 400) {
    return new NormalizedError(
      'INVALID_REQUEST',
      400,
      'The request was invalid. Please check your message and try again.'
    );
  }
  if (status === 401 || status === 403) {
    return new NormalizedError(
      'INVALID_API_KEY',
      500,
      'AI engine authentication failed. Please check server configuration.'
    );
  }
  if (status === 429) {
    return new NormalizedError(
      'RATE_LIMIT',
      429,
      'Service is currently busy. Please wait a moment and retry.'
    );
  }
  if (status === 503 || status === 502) {
    return new NormalizedError(
      'PROVIDER_UNAVAILABLE',
      503,
      'AI service is temporarily unavailable. Please try again shortly.'
    );
  }
  if (status === 504) {
    return new NormalizedError(
      'PROVIDER_TIMEOUT',
      504,
      'Response timed out. Please try again.'
    );
  }
  return new NormalizedError(
    'INTERNAL_ERROR',
    500,
    'An unexpected error occurred while generating the response.'
  );
}