export interface IAnalysis {
  url: string;
  duration: number;
  resources: IResource[];
  webVitals: Record<string, unknown>;
}

export type TResourceType =
  'document' | 'script' | 'stylesheet' | 'image' | 'font' | 'fetch' | 'xhr';

export interface IResource {
  url: string;
  type: TResourceType;
  size: number;
  duration: number;
  startTime: number;
  responseEnd: number;
  transferSize: number;
}
