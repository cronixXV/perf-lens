import { useMutation, useQueryClient } from '@tanstack/react-query';

import { analysisKeys } from '@/entities/analysis';
import { createAnalysis } from '@/shared/api/analysis';

export const useAnalyzeWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (url: string) => createAnalysis(url.trim()),
    onSuccess: (saved) => {
      queryClient.setQueryData(analysisKeys.byId(saved.id), saved);
      return queryClient.invalidateQueries({ queryKey: analysisKeys.history });
    }
  });
};
