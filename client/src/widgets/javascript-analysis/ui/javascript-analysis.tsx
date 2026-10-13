import { Box, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import type { IJavaScriptSummary } from '@shared/contracts/analysis';
import { JavaScriptScriptRow } from './javascript-script-row';
import { formatBytes } from '@/shared/lib/format';

interface IJavaScriptAnalysisProps {
  summary: IJavaScriptSummary;
}

export const JavaScriptAnalysis = ({ summary }: IJavaScriptAnalysisProps) => {
  return (
    <Stack gap={6}>
      <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }} gap={4}>
        <Box p={5} borderWidth="1px" borderColor="border" borderRadius="lg" bg="surface.bg">
          <Text fontSize="sm" color="textMuted">
            Total JS
          </Text>
          <Heading size="xl" mt={2}>
            {formatBytes(summary.totalSize)}
          </Heading>
          <Text fontSize="xs" color="textMuted" mt={2}>
            Combined size of JavaScript resources
          </Text>
        </Box>

        <Box p={5} borderWidth="1px" borderColor="border" borderRadius="lg" bg="surface.bg">
          <Text fontSize="sm" color="textMuted">
            Scripts
          </Text>
          <Heading size="xl" mt={2}>
            {summary.count}
          </Heading>
          <Text fontSize="xs" color="textMuted" mt={2}>
            JavaScript resources found
          </Text>
        </Box>
      </Grid>

      <Box p={5} borderWidth="1px" borderColor="border" borderRadius="lg" bg="surface.bg">
        <Heading size="md" mb={2}>
          Largest scripts
        </Heading>
        <Text fontSize="sm" color="textMuted" mb={3}>
          Largest JavaScript resources by size
        </Text>

        {summary.largestScripts.length > 0 ? (
          <Stack gap={0}>
            {summary.largestScripts.map((resource) => (
              <JavaScriptScriptRow
                key={`${resource.url}-${resource.startTime}`}
                resource={resource}
              />
            ))}
          </Stack>
        ) : (
          <Text fontSize="sm" color="textMuted">
            No JavaScript resources found.
          </Text>
        )}
      </Box>
    </Stack>
  );
};
