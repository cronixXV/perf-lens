import { Box, Button, Heading, NativeSelect, Stack, Text } from '@chakra-ui/react';

import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';

interface IAnalysisComparisonSelectorProps {
  analyses: ISavedAnalysis[];
  beforeId: string;
  afterId: string;
  onBeforeChange: (id: string) => void;
  onAfterChange: (id: string) => void;
  onCompare: () => void;
  isLoading?: boolean;
}

export const AnalysisComparisonSelector = ({
  analyses,
  beforeId,
  afterId,
  onBeforeChange,
  onAfterChange,
  onCompare,
  isLoading = false
}: IAnalysisComparisonSelectorProps) => {
  const isValid = beforeId !== '' && afterId !== '' && beforeId !== afterId;

  const formatDate = (date: string) => new Date(date).toLocaleString();

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Compare analyses
      </Heading>

      <Stack gap={4}>
        <Box>
          <Text mb={2} fontWeight="medium">
            Before
          </Text>

          <NativeSelect.Root>
            <NativeSelect.Field
              value={beforeId}
              onChange={(event) => onBeforeChange(event.target.value)}
            >
              <option value="">Select initial analysis</option>

              {analyses.map((analysis) => (
                <option key={analysis.id} value={analysis.id}>
                  {analysis.analysis.url} — {formatDate(analysis.createdAt)}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">
            After
          </Text>

          <NativeSelect.Root>
            <NativeSelect.Field
              value={afterId}
              onChange={(event) => onAfterChange(event.target.value)}
            >
              <option value="">Select updated analysis</option>

              {analyses.map((analysis) => (
                <option key={analysis.id} value={analysis.id}>
                  {analysis.analysis.url} — {formatDate(analysis.createdAt)}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        <Button
          colorPalette="blue"
          disabled={!isValid || isLoading}
          loading={isLoading}
          onClick={onCompare}
        >
          Compare
        </Button>
      </Stack>
    </Box>
  );
};
