import type { IAnalysisComparison } from '@shared/contracts/analysis-comparison';

import type { AnalysisRepository } from '@domain/analysis/analysis-repository';
import { compareAnalyses } from '@domain/analysis/compare-analyses';

export class CompareAnalyses {
  constructor(private readonly repository: AnalysisRepository) {}

  async execute(beforeId: string, afterId: string): Promise<IAnalysisComparison | null> {
    const [before, after] = await Promise.all([
      this.repository.findById(beforeId),
      this.repository.findById(afterId)
    ]);

    if (!before || !after) {
      return null;
    }

    return {
      before: {
        id: before.id,
        createdAt: before.createdAt,
        url: before.analysis.url
      },
      after: {
        id: after.id,
        createdAt: after.createdAt,
        url: after.analysis.url
      },
      metrics: compareAnalyses(before.analysis, after.analysis)
    };
  }
}
