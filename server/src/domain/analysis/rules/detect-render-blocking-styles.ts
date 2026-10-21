import type { IResource } from '@shared/contracts/analysis';
import type { IPerformanceIssue } from '@shared/contracts/performance-issue';

export const detectRenderBlockingStyles = (
  resources: IResource[],
  renderBlockingStyles: Set<string>
): IPerformanceIssue[] => {
  return resources
    .filter((resource) => resource.type === 'stylesheet' && renderBlockingStyles.has(resource.url))
    .map((resource) => ({
      id: `render-blocking-stylesheet-${resource.url}`,
      severity: 'warning',
      category: 'stylesheet',
      title: 'Render-blocking stylesheet detected',
      description: 'This stylesheet is identified by Chromium as render-blocking.',
      recommendation:
        'Review critical CSS, remove unused styles, and consider inlining critical styles or deferring non-critical CSS.',
      resourceUrl: resource.url,
      resourceSize: resource.size,
      metricValue: resource.duration
    }));
};
