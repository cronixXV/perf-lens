import { SimpleGrid, Stack } from '@chakra-ui/react';

import type { IWebVitals, IResource } from '@shared/contracts/analysis';

import { VITAL_METRICS, getVitalStatus } from '@/entities/performance-metric';

import { WebVitalCard } from './web-vital-card';
import { WebVitalCause } from './web-vital-cause';
import { findLcpResource } from '../lib/web-vital-cause';
import { getVitalValue } from '../lib/get-vital-value';

interface IWebVitalsProps {
  vitals: IWebVitals;
  resources: IResource[];
}

export const WebVitals = ({ vitals, resources }: IWebVitalsProps) => {
  const lcpResource = findLcpResource(vitals.lcp?.resourceUrl ?? null, resources);

  return (
    <Stack gap={6}>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 5 }} gap={4}>
        {VITAL_METRICS.map((metric) => {
          const value = getVitalValue(vitals, metric);

          return (
            <WebVitalCard
              key={metric}
              metric={metric}
              value={value}
              status={getVitalStatus(metric, value)}
            />
          );
        })}
      </SimpleGrid>

      <WebVitalCause resource={lcpResource} element={vitals.lcp?.element ?? null} />
    </Stack>
  );
};
