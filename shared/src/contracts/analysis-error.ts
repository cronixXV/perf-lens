export type TAnalysisErrorCode =
  | 'INVALID_URL'
  | 'SSRF_BLOCKED'
  | 'RESOURCE_LIMIT_EXCEEDED'
  | 'CONCURRENCY_LIMIT_EXCEEDED'
  | 'TIMEOUT'
  | 'NAVIGATION_ERROR'
  | 'CLOUDFLARE_BLOCKED'
  | 'SSL_ERROR'
  | 'BROWSER_CRASH'
  | 'UNKNOWN_ERROR'
  | 'NETWORK_ERROR';

export interface IAnalysisError {
  code: TAnalysisErrorCode;
  message: string;
  retryable: boolean;
}
