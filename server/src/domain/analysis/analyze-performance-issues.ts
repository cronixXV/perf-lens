import type { IAnalysis } from '@shared/contracts/analysis';
import { detectSlowLcp } from './rules/detect-slow-lcp';
import { detectLargeLcpResource } from './rules/detect-large-lcp-resource';
import { detectLongTasks } from './rules/detect-long-tasks';
import { detectLargeJavaScript } from './rules/detect-large-javascript';
import { detectRenderBlockingStyles } from './rules/detect-render-blocking-styles';
import { IPerformanceIssue } from '@shared/contracts/performance-issue';

export type TAnalysisInput = Omit<IAnalysis, 'issues'>;

export const analyzePerformanceIssues = (
  analysis: TAnalysisInput,
  renderBlockingStyles: Set<string>
): IPerformanceIssue[] => {
  return [
    ...detectSlowLcp(analysis),
    ...detectLargeLcpResource(analysis),
    ...detectLongTasks(analysis),
    ...detectLargeJavaScript(analysis),
    ...detectRenderBlockingStyles(analysis.resources, renderBlockingStyles)
  ];
};
