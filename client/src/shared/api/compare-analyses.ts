import type { IAnalysisComparison } from '@shared/contracts/analysis-comparison';

import { apiClient } from './client';

interface ICompareAnalysesParams {
  beforeId: string;
  afterId: string;
}

export const compareAnalyses = async (
  params: ICompareAnalysesParams,
  signal?: AbortSignal
): Promise<IAnalysisComparison> => {
  const { data } = await apiClient.get<IAnalysisComparison>('/analyses/compare', {
    params,
    signal
  });

  return data;
};
