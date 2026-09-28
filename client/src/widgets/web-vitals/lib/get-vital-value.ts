import type { IWebVitals } from '@shared/contracts/analysis';
import type { TVitalMetric } from '../model/types/web-vitals.type';

export const getVitalValue = (vitals: IWebVitals, metric: TVitalMetric): number | null => {
  switch (metric) {
    case 'lcp':
      return vitals.lcp?.value ?? null;

    case 'inp':
      return vitals.inp;

    case 'cls':
      return vitals.cls;

    case 'fcp':
      return vitals.fcp;

    case 'ttfb':
      return vitals.ttfb;
  }
};
