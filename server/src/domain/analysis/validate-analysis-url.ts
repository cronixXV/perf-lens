import { AnalysisError } from './errors/analysis-error';

const SUPPORTED_PROTOCOLS = new Set(['http:', 'https:']);

const invalidUrl = (): AnalysisError =>
  new AnalysisError({
    code: 'INVALID_URL',
    message: 'Enter a valid HTTP or HTTPS website URL',
    retryable: false
  });

export const validateAnalysisUrl = (value: string): string => {
  if (!value.trim()) {
    throw invalidUrl();
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw invalidUrl();
  }

  if (!SUPPORTED_PROTOCOLS.has(url.protocol) || !url.hostname || url.username || url.password) {
    throw invalidUrl();
  }

  return url.toString();
};
