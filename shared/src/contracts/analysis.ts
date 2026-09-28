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

export interface ILcpDetails {
  value: number;
  element: string | null;
  resourceUrl: string | null;
}

export interface IWebVitals {
  lcp: ILcpDetails | null;
  inp: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
}

export interface IAnalysis {
  url: string;
  analysisDuration: number;
  resources: IResource[];
  webVitals: IWebVitals;
}
