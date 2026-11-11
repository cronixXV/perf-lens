import type { TAnalysisErrorCode } from '@shared/contracts/analysis-error';

export const getAnalysisErrorStatus = (code: TAnalysisErrorCode): number => {
  switch (code) {
    case 'INVALID_URL':
    case 'SSRF_BLOCKED':
      return 400;

    case 'RESOURCE_LIMIT_EXCEEDED':
      return 413;

    case 'CONCURRENCY_LIMIT_EXCEEDED':
      return 429;

    case 'TIMEOUT':
      return 504;

    case 'NAVIGATION_ERROR':
    case 'CLOUDFLARE_BLOCKED':
      return 502;

    case 'SSL_ERROR':
      return 502;

    case 'BROWSER_CRASH':
    case 'UNKNOWN_ERROR':
      return 500;

    default:
      return 500;
  }
};
