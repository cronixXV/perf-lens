export type { TVitalMetric, TVitalStatus, TMetricUnit } from './model/types';
export { METRIC_CONFIG, TREND_CONFIG, VITAL_METRICS, VITAL_STATUS_CONFIG } from './model/config';
export {
  formatMetricValue,
  formatMetricDifference,
  formatChangePercent,
  formatVitalValue
} from './lib/format';
export { getVitalStatus } from './lib/get-vital-status';
