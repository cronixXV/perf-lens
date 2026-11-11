import { AnalysisError } from '@domain/analysis/errors/analysis-error';

export type TPlaywrightErrorStage = 'launch' | 'navigation' | 'analysis';

const ERROR_PATTERNS = {
  timeout: ['Timeout', 'timed out', 'ERR_TIMED_OUT'],
  ssl: ['ERR_CERT_', 'ERR_SSL_', 'SSL_ERROR'],
  browserCrash: [
    'Target crashed',
    'Browser closed',
    'Target closed',
    'Page crashed',
    'browser has been closed',
    'browser.newPage: Target closed'
  ]
};

const includesPattern = (message: string, patterns: string[]) =>
  patterns.some((pattern) => message.toLowerCase().includes(pattern.toLowerCase()));

export const classifyPlaywrightError = (
  error: unknown,
  stage: TPlaywrightErrorStage
): AnalysisError => {
  const message = error instanceof Error ? error.message : String(error);

  if (includesPattern(message, ERROR_PATTERNS.timeout)) {
    return new AnalysisError({
      code: 'TIMEOUT',
      message: 'Website analysis timed out',
      retryable: true,
      cause: error
    });
  }

  if (includesPattern(message, ERROR_PATTERNS.ssl)) {
    return new AnalysisError({
      code: 'SSL_ERROR',
      message: 'Website has an SSL certificate or connection error',
      retryable: false,
      cause: error
    });
  }

  if (includesPattern(message, ERROR_PATTERNS.browserCrash)) {
    return new AnalysisError({
      code: 'BROWSER_CRASH',
      message: 'Browser process terminated unexpectedly',
      retryable: true,
      cause: error
    });
  }

  if (stage === 'launch') {
    return new AnalysisError({
      code: 'UNKNOWN_ERROR',
      message: 'Unable to start the browser',
      retryable: true,
      cause: error
    });
  }

  if (stage === 'navigation') {
    return new AnalysisError({
      code: 'NAVIGATION_ERROR',
      message: 'Unable to navigate to the requested website',
      retryable: true,
      cause: error
    });
  }

  return new AnalysisError({
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred during website analysis',
    retryable: false,
    cause: error
  });
};
