import { randomUUID } from 'node:crypto';

import type { AnalysisLimiter } from '@application/analysis/analysis-limiter';
import type { AnalysisRepository } from '@domain/analysis/analysis-repository';
import { validateAnalysisUrl } from '@domain/analysis/validate-analysis-url';
import type { PlaywrightAnalyzer } from '@infrastructure/browser/playwright-analyzer';
import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';

export class CreateAnalysis {
  constructor(
    private readonly analyzer: PlaywrightAnalyzer,
    private readonly analysisRepository: AnalysisRepository,
    private readonly analysisLimiter: AnalysisLimiter
  ) {}

  async execute(url: string): Promise<ISavedAnalysis> {
    const validatedUrl = validateAnalysisUrl(url);
    const analysis = await this.analysisLimiter.run(() => this.analyzer.analyze(validatedUrl));

    const savedAnalysis: ISavedAnalysis = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      analysis
    };

    return this.analysisRepository.save(savedAnalysis);
  }
}
