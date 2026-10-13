import { Box, Stack, Text } from '@chakra-ui/react';

import type { ILongTaskSummary } from '@shared/contracts/analysis';
import { formatLongTaskDuration, getMaxLongTaskTime } from '../lib/long-tasks';

interface ILongTaskTimelineProps {
  summary: ILongTaskSummary;
  onSelect: (index: number) => void;
  selectedIndex: number | null;
}

const TIMELINE_WIDTH = 1000;

export const LongTaskTimeline = ({ summary, onSelect, selectedIndex }: ILongTaskTimelineProps) => {
  const maxTime = Math.max(getMaxLongTaskTime(summary), 1000);

  const getPosition = (time: number) => {
    return (time / maxTime) * TIMELINE_WIDTH;
  };

  const getWidth = (duration: number) => {
    return Math.max((duration / maxTime) * TIMELINE_WIDTH, 2);
  };

  return (
    <Box overflowX="auto">
      <Box position="relative" width={`${TIMELINE_WIDTH}px`} minHeight="220px">
        <Stack
          direction="row"
          justify="space-between"
          position="absolute"
          top={0}
          left={0}
          right={0}
          color="textMuted"
          fontSize="xs"
        >
          <Text>0 ms</Text>
          <Text>{Math.round(maxTime / 2)} ms</Text>
          <Text>{Math.round(maxTime)} ms</Text>
        </Stack>

        <Box position="absolute" top="28px" left={0} right={0} height="1px" bg="border" />

        <Stack gap={3} position="absolute" top="52px" left={0} right={0}>
          {summary.tasks.map((task, index) => {
            const isSelected = selectedIndex === index;

            return (
              <Box
                key={`${task.startTime}-${task.duration}-${index}`}
                position="relative"
                height="32px"
                cursor="pointer"
                onClick={() => onSelect(index)}
              >
                <Box
                  position="absolute"
                  left={`${getPosition(task.startTime)}px`}
                  top="4px"
                  width={`${getWidth(task.duration)}px`}
                  height="24px"
                  borderRadius="sm"
                  bg={isSelected ? 'brand.600' : 'brand.400'}
                  opacity={isSelected ? 1 : 0.8}
                />

                <Text
                  position="absolute"
                  left={`${getPosition(task.startTime) + getWidth(task.duration) + 8}px`}
                  top="4px"
                  fontSize="xs"
                  whiteSpace="nowrap"
                >
                  {formatLongTaskDuration(task.duration)}
                </Text>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};
