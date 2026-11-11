import type { TComparisonMetricKey } from '@shared/contracts/analysis-comparison';

import { METRIC_CONFIG, UNIT_FORMATTERS } from '../model/config';
import type { TVitalMetric } from '../model/types';

const withSign = (value: number, formatted: string) => (value > 0 ? `+${formatted}` : formatted);

export const formatMetricValue = (key: TComparisonMetricKey, value: number | null): string =>
  value === null ? 'N/A' : UNIT_FORMATTERS[METRIC_CONFIG[key].unit](value);

export const formatMetricDifference = (
  key: TComparisonMetricKey,
  difference: number | null
): string =>
  difference === null
    ? 'N/A'
    : withSign(difference, UNIT_FORMATTERS[METRIC_CONFIG[key].unit](difference));

export const formatChangePercent = (percent: number | null): string =>
  percent === null ? 'N/A' : withSign(percent, `${percent.toFixed(2)}%`);

export const formatVitalValue = (metric: TVitalMetric, value: number | null): string => {
  if (value === null) return '—';

  return metric === 'cls' ? value.toFixed(3) : `${(value / 1000).toFixed(2)} s`;
};
