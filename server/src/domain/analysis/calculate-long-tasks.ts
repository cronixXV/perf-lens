import type { ILongTask, ILongTaskSummary, IRawLongTask } from '@shared/contracts/analysis';

const LONG_TASK_THRESHOLD = 50;

export const calculateLongTasks = (longTasks: IRawLongTask[]): ILongTaskSummary => {
  const tasks: ILongTask[] = longTasks.map((task) => ({
    ...task,
    blockingTime: Math.max(0, task.duration - LONG_TASK_THRESHOLD)
  }));

  const totalBlockingTime = tasks.reduce((total, task) => total + task.blockingTime, 0);

  return {
    count: tasks.length,
    totalBlockingTime,
    tasks
  };
};
