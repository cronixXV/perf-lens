// pages/analysis-details/ui/analysis-details-page.tsx
import { Badge, Spinner, Stack, Tabs, Text } from '@chakra-ui/react';
import { useParams } from 'react-router';

import { useAnalysisById } from '@/entities/analysis';
import { DependencyGraph } from '@/widgets/dependency-graph';
import { JavaScriptAnalysis } from '@/widgets/javascript-analysis';
import { LongTasks } from '@/widgets/long-tasks';
import { PerformanceIssues } from '@/widgets/performance-issues';
import { ResourceWaterfall } from '@/widgets/resource-waterfall';
import { WebVitals } from '@/widgets/web-vitals';

import { AnalysisHeader } from './analysis-header';

export const AnalysisDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError } = useAnalysisById(id);

  if (isPending) return <Spinner />;
  if (isError || !data) return <Text color="fg.error">Analysis not found.</Text>;

  const { analysis } = data;

  return (
    <Stack gap={8}>
      <AnalysisHeader analysis={data} />

      <Tabs.Root defaultValue="overview" lazyMount unmountOnExit>
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="javascript">JavaScript</Tabs.Trigger>
          <Tabs.Trigger value="dependencies">Dependencies</Tabs.Trigger>
          <Tabs.Trigger value="network">Network</Tabs.Trigger>
          <Tabs.Trigger value="issues">
            Issues
            <Badge ms={2}>{analysis.issues.length}</Badge>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <Stack gap={8}>
            <WebVitals vitals={analysis.webVitals} resources={analysis.resources} />
            <LongTasks summary={analysis.longTasks} resources={analysis.resources} />
          </Stack>
        </Tabs.Content>

        <Tabs.Content value="javascript">
          <JavaScriptAnalysis summary={analysis.javascript} />
        </Tabs.Content>

        <Tabs.Content value="dependencies">
          <DependencyGraph graph={analysis.dependencyGraph} />
        </Tabs.Content>

        <Tabs.Content value="network">
          <ResourceWaterfall resources={analysis.resources} />
        </Tabs.Content>

        <Tabs.Content value="issues">
          <PerformanceIssues issues={analysis.issues} />
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
};
