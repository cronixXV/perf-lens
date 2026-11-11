import axios from 'axios';

import type { IAnalysisError } from '@shared/contracts/analysis-error';

import { AnalysisApiError } from './analysis-error';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

const isAnalysisError = (data: unknown): data is IAnalysisError =>
  typeof data === 'object' &&
  data !== null &&
  typeof (data as IAnalysisError).code === 'string' &&
  typeof (data as IAnalysisError).message === 'string' &&
  typeof (data as IAnalysisError).retryable === 'boolean';

const createApiError = (
  code: IAnalysisError['code'],
  message: string,
  retryable: boolean,
  status = 0
) =>
  new AnalysisApiError(
    {
      code,
      message,
      retryable
    },
    status
  );

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error) || axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status ?? 0;
    const data: unknown = error.response?.data;

    if (isAnalysisError(data)) {
      return Promise.reject(new AnalysisApiError(data, status));
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return Promise.reject(
        createApiError('TIMEOUT', 'The request timed out. Please try again.', true, status)
      );
    }

    if (!error.response) {
      return Promise.reject(
        createApiError('NETWORK_ERROR', 'Network error. Check your connection and try again.', true)
      );
    }

    return Promise.reject(
      createApiError('UNKNOWN_ERROR', 'An unexpected server error occurred.', status >= 500, status)
    );
  }
);
