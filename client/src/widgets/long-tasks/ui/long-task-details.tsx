import { Box, Card, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';

import type { ILongTask, IResource } from '@shared/contracts/analysis';

import { formatSize } from '@/shared/lib/format';
import { formatLongTaskDuration } from '../lib/long-tasks';

interface ILongTaskDetailsProps {
  task: ILongTask;
  script: IResource | null;
}

export const LongTaskDetails = ({ task, script }: ILongTaskDetailsProps) => {
  return (
    <Card.Root variant="outline" bg="surface.bg" borderColor="border" borderRadius="xl">
      <Card.Header pb={3}>
        <Stack gap={2}>
          <Heading size="sm">Long task details</Heading>

          <Text fontSize="sm" color="textMuted">
            JavaScript execution that blocked the main thread
          </Text>
        </Stack>
      </Card.Header>

      <Card.Body pt={2}>
        <Stack gap={5}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <Box>
              <Text fontSize="xs" color="textMuted" mb={1}>
                Start
              </Text>

              <Text fontSize="sm" fontWeight="semibold">
                {formatLongTaskDuration(task.startTime)}
              </Text>
            </Box>

            <Box>
              <Text fontSize="xs" color="textMuted" mb={1}>
                Duration
              </Text>

              <Text fontSize="sm" fontWeight="semibold">
                {formatLongTaskDuration(task.duration)}
              </Text>
            </Box>

            <Box>
              <Text fontSize="xs" color="textMuted" mb={1}>
                Blocking time
              </Text>

              <Text fontSize="sm" fontWeight="semibold">
                {formatLongTaskDuration(task.blockingTime)}
              </Text>
            </Box>
          </SimpleGrid>

          <Box>
            <Text fontSize="xs" color="textMuted" mb={1}>
              Script
            </Text>

            {script ? (
              <Stack gap={2}>
                <Box
                  px={3}
                  py={2}
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="md"
                  bg="surfaceSubtle.bg"
                >
                  <Text fontSize="sm" fontFamily="mono" wordBreak="break-all">
                    {script.url}
                  </Text>
                </Box>

                <Text fontSize="xs" color="textMuted">
                  {formatSize(script.size)} · {script.type}
                </Text>
              </Stack>
            ) : (
              <Text fontSize="sm" color="textMuted">
                No associated script was identified
              </Text>
            )}
          </Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
