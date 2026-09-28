import { Badge, Card, Heading, Stack, Text } from '@chakra-ui/react';

import type { TVitalMetric, TVitalStatus } from '../model/types/web-vitals.type';
import { getVitalLabel } from '../lib/get-vital-label';
import { getVitalStatusLabel } from '../lib/get-vital-status-label';
import { formatVitalValue } from '../lib/format-vital-value';
import { getStatusColorPalette } from '../lib/get-status-color-palette';

interface IWebVitalCardProps {
  metric: TVitalMetric;
  value: number | null;
  status: TVitalStatus;
}

export const WebVitalCard = ({ metric, value, status }: IWebVitalCardProps) => {
  return (
    <Card.Root variant="outline" bg="surface.bg" borderColor="border" borderRadius="xl">
      <Card.Body>
        <Stack gap={4}>
          <Stack direction="row" align="center" justify="space-between">
            <Heading size="sm">{getVitalLabel(metric)}</Heading>

            <Badge colorPalette={getStatusColorPalette(status)} variant="subtle">
              {getVitalStatusLabel(status)}
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
