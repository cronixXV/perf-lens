import type { TAnalysisErrorCode } from '@shared/contracts/analysis-error';

export const getAnalysisErrorStatus = (code: TAnalysisErrorCode): number => {
  switch (code) {
    case 'INVALID_URL':
      return 400;

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
