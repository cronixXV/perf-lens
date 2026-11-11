import type { TAnalysisErrorCode } from '@shared/contracts/analysis-error';

interface IAnalysisErrorOptions {
  code: TAnalysisErrorCode;
  message: string;
  retryable?: boolean;
  cause?: unknown;
}

export class AnalysisError extends Error {
  readonly code: TAnalysisErrorCode;
  readonly retryable: boolean;

  constructor({ code, message, retryable = false, cause }: IAnalysisErrorOptions) {
    super(message, { cause });

    this.name = 'AnalysisError';
    this.code = code;
    this.retryable = retryable;
  }
}
