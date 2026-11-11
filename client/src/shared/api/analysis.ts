import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';

import { apiClient } from './client';

export const createAnalysis = async (url: string): Promise<ISavedAnalysis> => {
  const { data } = await apiClient.post<ISavedAnalysis>('/analyses', { url }, { timeout: 120_000 });

  return data;
};
