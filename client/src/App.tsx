import { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Stack, Text } from '@chakra-ui/react';

import { ResourceWaterfall } from '@/widgets/resource-waterfall';
import { WebVitals } from '@/widgets/web-vitals';

import type { IAnalysis } from '@shared/contracts/analysis';
import { createAnalysis } from './shared/api/analysis';
import { AppShell } from './app/layouts/app-shell';
import { LongTasks } from './widgets/long-tasks';
import { JavaScriptAnalysis } from './widgets/javascript-analysis';
import { DependencyGraph } from './widgets/dependency-graph';

const App = () => {
  const [analysis, setAnalysis] = useState<IAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createAnalysis('https://chatgpt.com/')
      .then(setAnalysis)
      .catch(() => {
        setError('Failed to analyze website');
      });
  }, []);

  if (error) {
    return (
      <AppShell>
        <Text color="red.500">{error}</Text>
      </AppShell>
    );
  }

  if (!analysis) {
    return (
      <AppShell>
        <Spinner />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Stack gap={8}>
        <Box>
          <Heading size="2xl" letterSpacing="-0.02em">
            Performance analysis
          </Heading>

          <Text mt={2} color="textMuted" fontSize="lg">
            {analysis.url}
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Web Vitals
          </Heading>
          <WebVitals vitals={analysis.webVitals} resources={analysis.resources} />
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Long Tasks
          </Heading>
          <LongTasks summary={analysis.longTasks} resources={analysis.resources} />
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            JavaScript Analysis
          </Heading>
          <JavaScriptAnalysis summary={analysis.javascript} />
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Dependency Graph
          </Heading>

          <DependencyGraph graph={analysis.dependencyGraph} />
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Network waterfall
          </Heading>
          <ResourceWaterfall resources={analysis.resources} />
        </Box>
      </Stack>
    </AppShell>
  );
};

export default App;
