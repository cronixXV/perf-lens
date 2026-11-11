import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';

import { apiClient } from './client';

export const getAnalysisHistory = async (signal?: AbortSignal): Promise<ISavedAnalysis[]> => {
  const { data } = await apiClient.get<ISavedAnalysis[]>('/analyses', { signal });

  return data;
};

export const getAnalysisById = async (
  id: string,
  signal?: AbortSignal
): Promise<ISavedAnalysis> => {
  const { data } = await apiClient.get<ISavedAnalysis>(`/analyses/${id}`, { signal });

  return data;
};
