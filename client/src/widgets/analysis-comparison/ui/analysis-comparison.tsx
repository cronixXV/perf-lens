import { useState } from 'react';
import { Box, Heading, Spinner, Stack, Text } from '@chakra-ui/react';

import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';
import type { IAnalysisComparison } from '@shared/contracts/analysis-comparison';

import { compareAnalyses } from '@/shared/api/compare-analyses';

import { AnalysisComparisonSelector } from './analysis-comparison-selector';
import { AnalysisComparisonTable } from './analysis-comparison-table';
import { AnalysisComparisonChart } from './analysis-comparison-chart';
import { AnalysisTechnicalComparisonChart } from './analysis-technical-comparison-chart';
import { AnalysisComparisonSummary } from './analysis-comparison-summary';
import { AnalysisComparisonHeader } from './analysis-comparison-header';

interface IAnalysisComparisonProps {
  analyses: ISavedAnalysis[];
}

export const AnalysisComparison = ({ analyses }: IAnalysisComparisonProps) => {
  const [beforeId, setBeforeId] = useState('');
  const [afterId, setAfterId] = useState('');

  const [comparison, setComparison] = useState<IAnalysisComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    setIsLoading(true);
    setError(null);
    setComparison(null);

    try {
      const result = await compareAnalyses({ beforeId, afterId });
      setComparison(result);
    } catch {
      setError('Failed to compare analyses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBeforeChange = (id: string) => {
    setBeforeId(id);
    setComparison(null);
    setError(null);
  };

  const handleAfterChange = (id: string) => {
    setAfterId(id);
    setComparison(null);
    setError(null);
  };

  return (
    <Stack gap={6}>
      <Box>
        <Heading size="xl" mb={2}>
          Analysis comparison
        </Heading>

        <Text color="fg.muted">Compare performance metrics between two saved analyses.</Text>
      </Box>

      <AnalysisComparisonSelector
        analyses={analyses}
        beforeId={beforeId}
        afterId={afterId}
        onBeforeChange={handleBeforeChange}
        onAfterChange={handleAfterChange}
        onCompare={handleCompare}
        isLoading={isLoading}
      />

      {isLoading && (
        <Box display="flex" justifyContent="center" py={8}>
          <Spinner size="lg" />
        </Box>
      )}

      {error && <Text color="red.500">{error}</Text>}

      {comparison && (
        <>
          <AnalysisComparisonHeader comparison={comparison} />
          <AnalysisComparisonSummary comparison={comparison} />
          <AnalysisComparisonChart comparison={comparison} />
          <AnalysisTechnicalComparisonChart comparison={comparison} />
          <AnalysisComparisonTable comparison={comparison} />
        </>
      )}
    </Stack>
  );
};
