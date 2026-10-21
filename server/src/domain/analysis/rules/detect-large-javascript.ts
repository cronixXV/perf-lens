import type { TAnalysisInput } from '@shared/contracts/analysis';
import { IPerformanceIssue } from '@shared/contracts/performance-issue';

const LARGE_JAVASCRIPT_THRESHOLD = 1024 * 1024;

export const detectLargeJavaScript = (analysis: TAnalysisInput): IPerformanceIssue[] => {
  const { totalSize, count } = analysis.javascript;

  if (totalSize < LARGE_JAVASCRIPT_THRESHOLD) {
    return [];
  }

  return [
    {
      id: 'large-javascript',
      severity: 'warning',
      category: 'javascript',
      title: 'Large JavaScript payload',
      description: `${count} scripts account for ${(totalSize / (1024 * 1024)).toFixed(2)} MB.`,
      recommendation:
        'Inspect the largest scripts, remove unused dependencies, split code by route or feature, and defer non-critical code.',
      resourceUrl: null,
      resourceSize: totalSize,
      metricValue: null
    }
  ];
};
