import type { TVitalMetric } from '../model/types/web-vitals.type';

export const getVitalLabel = (metric: TVitalMetric): string => {
  switch (metric) {
    case 'lcp':
      return 'LCP';

    case 'inp':
      return 'INP';

    case 'cls':
      return 'CLS';

    case 'fcp':
      return 'FCP';

    case 'ttfb':
      return 'TTFB';
  }
};
