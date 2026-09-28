import type { IResource } from '@shared/contracts/analysis';

export interface IAnalysis {
  url: string;
  duration: number;
  resources: IResource[];
  webVitals: Record<string, unknown>;
}
