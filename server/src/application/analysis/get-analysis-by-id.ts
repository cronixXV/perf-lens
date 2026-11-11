import type { AnalysisRepository } from '@domain/analysis/analysis-repository';
import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';

export class GetAnalysisById {
  constructor(private readonly analysisRepository: AnalysisRepository) {}

  execute(id: string): Promise<ISavedAnalysis | null> {
    return this.analysisRepository.findById(id);
  }
}
