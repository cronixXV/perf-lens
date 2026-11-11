import { AnalysisError } from '@domain/analysis/errors/analysis-error';

export class AnalysisLimiter {
  private activeAnalyses = 0;

  constructor(private readonly maxConcurrentAnalyses: number) {}

  async run<T>(operation: () => Promise<T>): Promise<T> {
    if (this.activeAnalyses >= this.maxConcurrentAnalyses) {
      throw new AnalysisError({
        code: 'CONCURRENCY_LIMIT_EXCEEDED',
        message: 'Too many analyses are already running. Please try again shortly.',
        retryable: true
      });
    }

    this.activeAnalyses += 1;

    try {
      return await operation();
    } finally {
      this.activeAnalyses -= 1;
    }
  }
}
