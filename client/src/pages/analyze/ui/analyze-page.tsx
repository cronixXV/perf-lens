import { Box, Button, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router';

import { useAnalysisHistory } from '@/entities/analysis';
import { AnalyzeWebsiteForm } from '@/features/analyze-website';
import { AnalysisHistory } from '@/widgets/analysis-history';

const RECENT_LIMIT = 3;

export const AnalyzePage = () => {
  const navigate = useNavigate();
  const { data: analyses = [], isPending } = useAnalysisHistory();

  return (
    <Stack gap={10}>
      <Stack gap={4}>
        <Box>
          <Heading size="3xl" letterSpacing="-0.02em">
            Analyze a website
          </Heading>
          <Text mt={2} color="textMuted">
            Measure Web Vitals, JavaScript weight, long tasks and the network waterfall.
          </Text>
        </Box>

        <AnalyzeWebsiteForm
          initialUrl={analyses[0]?.analysis.url}
          onSuccess={(saved) => navigate(`/analyses/${saved.id}`)}
        />
      </Stack>

      {isPending ? (
        <Spinner />
      ) : analyses.length === 0 ? (
        <Text color="fg.muted">Run your first analysis to see performance metrics.</Text>
      ) : (
        <Stack gap={4}>
          <AnalysisHistory
            analyses={analyses.slice(0, RECENT_LIMIT)}
            selectedId={null}
            onSelect={(id) => navigate(`/analyses/${id}`)}
          />

          {analyses.length > RECENT_LIMIT && (
            <Button asChild variant="ghost" alignSelf="flex-start">
              <RouterLink to="/history">View all {analyses.length} analyses</RouterLink>
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
};
