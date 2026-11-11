import type { ISavedAnalysis } from './saved-analysis';

export type TComparisonMetricKey =
  | 'lcp'
  | 'inp'
  | 'cls'
  | 'fcp'
  | 'ttfb'
  | 'javascriptSize'
  | 'resourceCount'
  | 'longTaskCount'
  | 'totalBlockingTime';

export type TComparisonTrend = 'improved' | 'regressed' | 'unchanged' | 'unavailable';

export interface IMetricComparison {
  before: number | null;
  after: number | null;
  difference: number | null;
  changePercent: number | null;
  trend: TComparisonTrend;
}

export interface IAnalysisComparison {
  before: Pick<ISavedAnalysis, 'id' | 'createdAt'> & { url: string };
  after: Pick<ISavedAnalysis, 'id' | 'createdAt'> & { url: string };
  metrics: Record<TComparisonMetricKey, IMetricComparison>;
}
