import type { IResource } from '@shared/contracts/analysis';

export interface IWaterfallResource extends IResource {
  endTime: number;
}

export type TResourceSort = 'startTime' | 'duration' | 'size' | 'transferSize';
