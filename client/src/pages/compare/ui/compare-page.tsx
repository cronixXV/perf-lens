import { Heading, Spinner, Stack, Text } from '@chakra-ui/react';

import { useAnalysisHistory } from '@/entities/analysis';
import { AnalysisComparison } from '@/widgets/analysis-comparison';

export const ComparePage = () => {
  const { data: analyses, isPending, isError } = useAnalysisHistory();

  if (isPending) return <Spinner />;
  if (isError) return <Text color="fg.error">Failed to load analyses.</Text>;

  return (
    <Stack gap={6}>
      <Heading size="2xl" letterSpacing="-0.02em">
        Compare analyses
      </Heading>

      {analyses.length < 2 ? (
        <Text color="fg.muted">Run at least two analyses to compare them.</Text>
      ) : (
        <AnalysisComparison analyses={analyses} />
      )}
    </Stack>
  );
};
