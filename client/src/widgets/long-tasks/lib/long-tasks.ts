import type { ILongTask, ILongTaskSummary, IResource } from '@shared/contracts/analysis';

export const getLongTaskScript = (task: ILongTask, resources: IResource[]): IResource | null => {
  if (!task.scriptUrl) {
    return null;
  }

  return resources.find((resource) => resource.url === task.scriptUrl) ?? null;
};

export const getMaxLongTaskTime = (summary: ILongTaskSummary): number => {
  return summary.tasks.reduce((max, task) => Math.max(max, task.startTime + task.duration), 0);
};

export const formatLongTaskDuration = (duration: number): string => {
  return `${Math.round(duration)} ms`;
};
