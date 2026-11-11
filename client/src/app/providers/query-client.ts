import { QueryClient } from '@tanstack/react-query';

import { AnalysisApiError } from '@/shared/api/analysis-error';

const MAX_RETRIES = 2;

const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (failureCount >= MAX_RETRIES) return false;

  return error instanceof AnalysisApiError ? error.retryable : true;
};

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: shouldRetry
      },
      mutations: {
        retry: false
      }
    }
  });
