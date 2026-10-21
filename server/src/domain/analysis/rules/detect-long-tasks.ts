import type { TAnalysisInput } from '@shared/contracts/analysis';
import { IPerformanceIssue } from '@shared/contracts/performance-issue';

const LONG_TASK_THRESHOLD = 200;

export const detectLongTasks = (analysis: TAnalysisInput): IPerformanceIssue[] => {
  return analysis.longTasks.tasks
    .filter((task) => task.duration > LONG_TASK_THRESHOLD)
    .map((task) => ({
      id: `long-task:${task.startTime}:${task.scriptUrl ?? 'unknown'}`,
      severity: 'warning' as const,
      category: 'javascript' as const,
      title: 'Long JavaScript task',
      description: `A main-thread task blocked the browser for ${Math.round(task.duration)} ms.`,
      recommendation:
        'Profile the script, reduce expensive synchronous work, and split long operations into smaller tasks.',
      resourceUrl: task.scriptUrl,
      resourceSize: null,
      metricValue: task.duration
    }));
};
