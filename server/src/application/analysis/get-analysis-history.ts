import type { AnalysisRepository } from '@domain/analysis/analysis-repository';
import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';

export class GetAnalysisHistory {
  constructor(private readonly analysisRepository: AnalysisRepository) {}

  execute(): Promise<ISavedAnalysis[]> {
    return this.analysisRepository.findAll();
  }
}
