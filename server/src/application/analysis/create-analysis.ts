import { randomUUID } from 'node:crypto';

import type { AnalysisRepository } from '@domain/analysis/analysis-repository';
import type { PlaywrightAnalyzer } from '@infrastructure/browser/playwright-analyzer';
import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';

export class CreateAnalysis {
  constructor(
    private readonly analyzer: PlaywrightAnalyzer,
    private readonly analysisRepository: AnalysisRepository
  ) {}

  async execute(url: string): Promise<ISavedAnalysis> {
    const analysis = await this.analyzer.analyze(url);

    const savedAnalysis: ISavedAnalysis = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      analysis
    };

    return this.analysisRepository.save(savedAnalysis);
  }
}
