import { VITAL_THRESHOLDS } from '../model/config';
import type { TVitalMetric, TVitalStatus } from '../model/types';

export const getVitalStatus = (metric: TVitalMetric, value: number | null): TVitalStatus => {
  if (value === null) return 'unavailable';

  const { good, poor } = VITAL_THRESHOLDS[metric];

  if (value < good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
};
