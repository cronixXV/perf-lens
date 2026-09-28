import type { TVitalMetric } from '../model/types/web-vitals.type';

export const formatVitalValue = (metric: TVitalMetric, value: number | null): string => {
  if (value === null) {
    return '—';
  }

  switch (metric) {
    case 'lcp':
    case 'inp':
    case 'fcp':
    case 'ttfb':
      return `${(value / 1000).toFixed(2)} s`;

    case 'cls':
      return value.toFixed(3);
  }
};
