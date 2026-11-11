import type {
  IMetricComparison,
  TComparisonMetricKey
} from '@shared/contracts/analysis-comparison';

import type { TMetricUnit, TVitalMetric, TVitalStatus } from './types';

export const METRIC_CONFIG = {
  lcp: { label: 'LCP', unit: 'ms' },
  inp: { label: 'INP', unit: 'ms' },
  cls: { label: 'CLS', unit: 'score' },
  fcp: { label: 'FCP', unit: 'ms' },
  ttfb: { label: 'TTFB', unit: 'ms' },
  totalBlockingTime: { label: 'Total Blocking Time', unit: 'ms' },
  javascriptSize: { label: 'JavaScript Size', unit: 'kb' },
  resourceCount: { label: 'Resource Count', unit: 'count' },
  longTaskCount: { label: 'Long Tasks', unit: 'count' }
} as const satisfies Record<TComparisonMetricKey, { label: string; unit: TMetricUnit }>;

export const UNIT_FORMATTERS: Record<TMetricUnit, (value: number) => string> = {
  ms: (v) => `${v.toFixed(2)} ms`,
  kb: (v) => `${(v / 1024).toFixed(2)} KB`,
  score: (v) => v.toFixed(3),
  count: (v) => String(v)
};

export const TREND_CONFIG: Record<IMetricComparison['trend'], { label: string; color: string }> = {
  improved: { label: 'Improved', color: 'green' },
  regressed: { label: 'Regressed', color: 'red' },
  unchanged: { label: 'Unchanged', color: 'gray' },
  unavailable: { label: 'Unavailable', color: 'yellow' }
};

export const VITAL_METRICS: readonly TVitalMetric[] = ['lcp', 'inp', 'cls', 'fcp', 'ttfb'];

export const VITAL_STATUS_CONFIG: Record<TVitalStatus, { label: string; color: string }> = {
  good: { label: 'Good', color: 'green' },
  'needs-improvement': { label: 'Needs improvement', color: 'orange' },
  poor: { label: 'Poor', color: 'red' },
  unavailable: { label: 'Unavailable', color: 'gray' }
};

export const VITAL_THRESHOLDS: Record<TVitalMetric, { good: number; poor: number }> = {
  lcp: { good: 2500, poor: 4000 },
  inp: { good: 200, poor: 500 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1800, poor: 3000 },
  ttfb: { good: 800, poor: 1800 }
};
