import { Badge, Card, Heading, Stack, Text } from '@chakra-ui/react';

import {
  METRIC_CONFIG,
  VITAL_STATUS_CONFIG,
  formatVitalValue,
  type TVitalMetric,
  type TVitalStatus
} from '@/entities/performance-metric';

interface IWebVitalCardProps {
  metric: TVitalMetric;
  value: number | null;
  status: TVitalStatus;
}

export const WebVitalCard = ({ metric, value, status }: IWebVitalCardProps) => {
  const { label, color } = VITAL_STATUS_CONFIG[status];

  return (
    <Card.Root variant="outline" bg="surface.bg" borderColor="border" borderRadius="xl">
      <Card.Body>
        <Stack gap={4}>
          <Stack direction="row" align="center" justify="space-between">
            <Heading size="sm">{METRIC_CONFIG[metric].label}</Heading>

            <Badge colorPalette={color} variant="subtle">
              {label}
            </Badge>
          </Stack>

          <Text fontSize="3xl" fontWeight="bold" letterSpacing="-0.03em">
            {formatVitalValue(metric, value)}
          </Text>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
