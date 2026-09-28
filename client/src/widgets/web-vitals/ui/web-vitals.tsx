import { SimpleGrid, Stack } from '@chakra-ui/react';

import type { IWebVitals, IResource } from '@shared/contracts/analysis';

import { WebVitalCard } from './web-vital-card';
import { WebVitalCause } from './web-vital-cause';
import type { TVitalMetric } from '../model/types/web-vitals.type';
import { findLcpResource } from '../lib/web-vital-cause';
import { getVitalValue } from '../lib/get-vital-value';
import { getVitalStatus } from '../lib/get-vital-status';

interface IWebVitalsProps {
  vitals: IWebVitals;
  resources: IResource[];
}

const metrics: TVitalMetric[] = ['lcp', 'inp', 'cls', 'fcp', 'ttfb'];

export const WebVitals = ({ vitals, resources }: IWebVitalsProps) => {
  const lcpResource = findLcpResource(vitals.lcp?.resourceUrl ?? null, resources);

  return (
    <Stack gap={6}>
      <SimpleGrid
        columns={{
          base: 1,
          sm: 2,
          lg: 3,
          xl: 5
        }}
        gap={4}
      >
        {metrics.map((metric) => {
          const value = getVitalValue(vitals, metric);
          const status = getVitalStatus(metric, value);

          return <WebVitalCard key={metric} metric={metric} value={value} status={status} />;
        })}
      </SimpleGrid>

      <WebVitalCause resource={lcpResource} element={vitals.lcp?.element ?? null} />
    </Stack>
  );
};
