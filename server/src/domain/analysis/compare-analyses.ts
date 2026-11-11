import type { IAnalysis } from '@shared/contracts/analysis';
import type {
  IMetricComparison,
  TComparisonMetricKey
} from '@shared/contracts/analysis-comparison';

const compareMetric = (before: number | null, after: number | null): IMetricComparison => {
  if (before === null || after === null) {
    return {
      before,
      after,
      difference: null,
      changePercent: null,
      trend: 'unavailable'
    };
  }

  const difference = after - before;

  if (difference === 0) {
    return {
      before,
      after,
      difference: 0,
      changePercent: 0,
      trend: 'unchanged'
    };
  }

  return {
    before,
    after,
    difference,
    changePercent: before === 0 ? null : (difference / before) * 100,
    trend: difference < 0 ? 'improved' : 'regressed'
  };
};

export const compareAnalyses = (
  before: IAnalysis,
  after: IAnalysis
): Record<TComparisonMetricKey, IMetricComparison> => {
  return {
    lcp: compareMetric(before.webVitals.lcp?.value ?? null, after.webVitals.lcp?.value ?? null),
    inp: compareMetric(before.webVitals.inp, after.webVitals.inp),
    cls: compareMetric(before.webVitals.cls, after.webVitals.cls),
    fcp: compareMetric(before.webVitals.fcp, after.webVitals.fcp),
    ttfb: compareMetric(before.webVitals.ttfb, after.webVitals.ttfb),
    javascriptSize: compareMetric(before.javascript.totalSize, after.javascript.totalSize),
    resourceCount: compareMetric(before.resources.length, after.resources.length),
    longTaskCount: compareMetric(before.longTasks.count, after.longTasks.count),
    totalBlockingTime: compareMetric(
      before.longTasks.totalBlockingTime,
      after.longTasks.totalBlockingTime
    )
  };
};
