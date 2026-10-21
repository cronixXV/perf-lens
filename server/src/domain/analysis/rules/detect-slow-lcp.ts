import type { TAnalysisInput } from '@shared/contracts/analysis';
import type { IPerformanceIssue } from '@shared/contracts/performance-issue';

const LCP_THRESHOLD_MS = 2500;

export const detectSlowLcp = (analysis: TAnalysisInput): IPerformanceIssue[] => {
  const lcp = analysis.webVitals.lcp;

  if (!lcp || lcp.value <= LCP_THRESHOLD_MS) {
    return [];
  }

  return [
    {
      id: 'slow-lcp',
      severity: 'warning',
      category: 'web-vitals',
      title: 'LCP is above 2.5 seconds',
      description: `Largest Contentful Paint took ${(lcp.value / 1000).toFixed(2)} seconds.`,
      recommendation:
        'Identify the LCP element, reduce its loading delay, and optimize the resource if it is an image.',
      resourceUrl: lcp.resourceUrl,
      resourceSize: null,
      metricValue: lcp.value
    }
  ];
};
