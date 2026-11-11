import type { IAnalysisError } from '@shared/contracts/analysis-error';

export class AnalysisApiError extends Error {
  readonly code: IAnalysisError['code'];
  readonly retryable: boolean;
  readonly status: number;

  constructor(error: IAnalysisError, status: number) {
    super(error.message);

    this.name = 'AnalysisApiError';
    this.code = error.code;
    this.retryable = error.retryable;
    this.status = status;
  }
}
