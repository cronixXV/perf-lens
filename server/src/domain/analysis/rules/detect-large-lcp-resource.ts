import type { TAnalysisInput } from '@shared/contracts/analysis';
import { IPerformanceIssue } from '@shared/contracts/performance-issue';

const LARGE_RESOURCE_THRESHOLD = 500 * 1024;

export const detectLargeLcpResource = (analysis: TAnalysisInput): IPerformanceIssue[] => {
  const resourceUrl = analysis.webVitals.lcp?.resourceUrl;

  if (!resourceUrl) {
    return [];
  }

  const resource = analysis.resources.find((item) => item.url === resourceUrl);

  if (!resource || resource.size < LARGE_RESOURCE_THRESHOLD) {
    return [];
  }

  return [
    {
      id: `large-lcp-resource:${resource.url}`,
      severity: 'warning',
      category: 'image',
      title: 'Large LCP resource',
      description: `The resource associated with LCP is ${(resource.size / (1024 * 1024)).toFixed(
        2
      )} MB.`,
      recommendation:
        'Compress the image, consider WebP or AVIF, and serve responsive image sizes. Preload only if this is the critical LCP resource.',
      resourceUrl: resource.url,
      resourceSize: resource.size,
      metricValue: null
    }
  ];
};
