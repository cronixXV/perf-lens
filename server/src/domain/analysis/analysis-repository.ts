import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';

export interface AnalysisRepository {
  save(analysis: ISavedAnalysis): Promise<ISavedAnalysis>;
  findById(id: string): Promise<ISavedAnalysis | null>;
  findAll(): Promise<ISavedAnalysis[]>;
  findByUrl(url: string): Promise<ISavedAnalysis[]>;
}
