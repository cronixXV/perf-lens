import { AnalysisApiError } from '@/shared/api/analysis-error';

import type { IAnalysisError } from '@shared/contracts/analysis-error';

const FALLBACK_MESSAGE = 'An unexpected error occurred. Please try again.';

const ERROR_MESSAGES: Record<IAnalysisError['code'], string> = {
  INVALID_URL: 'Please enter a valid website URL.',
  SSRF_BLOCKED: 'This address cannot be analyzed for security reasons.',
  RESOURCE_LIMIT_EXCEEDED: 'This page exceeds the analysis resource limits.',
  CONCURRENCY_LIMIT_EXCEEDED: 'Too many analyses are running. Please try again shortly.',
  TIMEOUT: 'Website analysis timed out. Please try again.',
  NAVIGATION_ERROR: 'Unable to open the website.',
  CLOUDFLARE_BLOCKED: 'The website blocked automated analysis.',
  SSL_ERROR: 'The website has an SSL certificate or connection error.',
  BROWSER_CRASH: 'The browser encountered an error during analysis.',
  NETWORK_ERROR: 'Network error. Check your connection and try again.',
  UNKNOWN_ERROR: FALLBACK_MESSAGE
};

export const getAnalysisErrorMessage = (error: unknown): string =>
  error instanceof AnalysisApiError
    ? (ERROR_MESSAGES[error.code] ?? FALLBACK_MESSAGE)
    : FALLBACK_MESSAGE;

export const isRetryableError = (error: unknown): boolean =>
  error instanceof AnalysisApiError && error.retryable;
