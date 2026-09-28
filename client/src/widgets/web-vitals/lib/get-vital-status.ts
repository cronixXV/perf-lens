import type { TVitalMetric, TVitalStatus } from '../model/types/web-vitals.type';

export const getVitalStatus = (metric: TVitalMetric, value: number | null): TVitalStatus => {
  if (value === null) {
    return 'unavailable';
  }

  switch (metric) {
    case 'lcp':
      if (value < 2500) return 'good';
      if (value <= 4000) return 'needs-improvement';
      return 'poor';

    case 'inp':
      if (value < 200) return 'good';
      if (value <= 500) return 'needs-improvement';
      return 'poor';

    case 'cls':
      if (value < 0.1) return 'good';
      if (value <= 0.25) return 'needs-improvement';
      return 'poor';

    case 'fcp':
      if (value < 1800) return 'good';
      if (value <= 3000) return 'needs-improvement';
      return 'poor';

    case 'ttfb':
      if (value < 800) return 'good';
      if (value <= 1800) return 'needs-improvement';
      return 'poor';
  }
};
