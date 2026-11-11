import { Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router';

import { useAnalysisHistory } from '@/entities/analysis';
import { AnalysisHistory } from '@/widgets/analysis-history';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const { data: analyses, isPending, isError } = useAnalysisHistory();

  if (isPending) return <Spinner />;
  if (isError) return <Text color="fg.error">Failed to load analysis history.</Text>;

  return (
    <Stack gap={6}>
      <Heading size="2xl" letterSpacing="-0.02em">
        History
      </Heading>

      {analyses.length === 0 ? (
        <Text color="fg.muted">No analyses yet.</Text>
      ) : (
        <AnalysisHistory
          analyses={analyses}
          selectedId={null}
          onSelect={(id) => navigate(`/analyses/${id}`)}
        />
      )}
    </Stack>
  );
};
