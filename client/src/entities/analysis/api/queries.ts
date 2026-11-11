import { useQuery } from '@tanstack/react-query';

import { getAnalysisById, getAnalysisHistory } from '@/shared/api/analysis-history';

export const analysisKeys = {
  history: ['analyses'] as const,
  byId: (id: string) => ['analyses', id] as const
};

export const useAnalysisHistory = () =>
  useQuery({
    queryKey: analysisKeys.history,
    queryFn: ({ signal }) => getAnalysisHistory(signal)
  });

export const useAnalysisById = (id: string | undefined) =>
  useQuery({
    queryKey: analysisKeys.byId(id ?? ''),
    queryFn: ({ signal }) => getAnalysisById(id!, signal),
    enabled: Boolean(id)
  });
