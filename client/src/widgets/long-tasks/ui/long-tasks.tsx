import { Badge, Card, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';

import type { IResource, ILongTaskSummary } from '@shared/contracts/analysis';

import { LongTaskDetails } from './long-task-details';
import { LongTaskTimeline } from './long-task-timeline';
import { getLongTaskScript } from '../lib/long-tasks';

interface ILongTasksProps {
  summary: ILongTaskSummary;
  resources: IResource[];
}

export const LongTasks = ({ summary, resources }: ILongTasksProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    summary.tasks.length > 0 ? 0 : null
  );

  const selectedTask = selectedIndex !== null ? (summary.tasks[selectedIndex] ?? null) : null;

  const selectedScript = selectedTask ? getLongTaskScript(selectedTask, resources) : null;

  return (
    <Stack gap={6}>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
        <Card.Root variant="outline" bg="surface.bg" borderColor="border" borderRadius="xl">
          <Card.Body>
            <Stack gap={2}>
              <Text fontSize="sm" color="textMuted">
                Long tasks
              </Text>

              <Heading size="2xl">{summary.count}</Heading>

              <Badge
                width="fit-content"
                colorPalette={summary.count > 0 ? 'orange' : 'green'}
                variant="subtle"
              >
                {summary.count > 0 ? 'Main thread activity detected' : 'No long tasks detected'}
              </Badge>
            </Stack>
          </Card.Body>
        </Card.Root>

        <Card.Root variant="outline" bg="surface.bg" borderColor="border" borderRadius="xl">
          <Card.Body>
            <Stack gap={2}>
              <Text fontSize="sm" color="textMuted">
                Total blocking time
              </Text>

              <Heading size="2xl">{Math.round(summary.totalBlockingTime)} ms</Heading>

              <Text fontSize="sm" color="textMuted">
                Time above the 50 ms long-task threshold
              </Text>
            </Stack>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>

      <Card.Root variant="outline" bg="surface.bg" borderColor="border" borderRadius="xl">
        <Card.Header pb={3}>
          <Stack gap={1}>
            <Heading size="md">Main thread activity</Heading>

            <Text fontSize="sm" color="textMuted">
              Long tasks during page execution
            </Text>
          </Stack>
        </Card.Header>

        <Card.Body pt={2}>
          {summary.tasks.length > 0 ? (
            <LongTaskTimeline
              summary={summary}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          ) : (
            <Text fontSize="sm" color="textMuted">
              No long tasks were detected during the analysis.
            </Text>
          )}
        </Card.Body>
      </Card.Root>

      {selectedTask && <LongTaskDetails task={selectedTask} script={selectedScript} />}
    </Stack>
  );
};
