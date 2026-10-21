import type { IPerformanceIssue } from './performance-issue';

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

export interface IRawLongTask {
  startTime: number;
  duration: number;
  scriptUrl: string | null;
}

export interface ILongTask extends IRawLongTask {
  blockingTime: number;
}

export interface ILongTaskSummary {
  count: number;
  totalBlockingTime: number;
  tasks: ILongTask[];
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

export interface IJavaScriptSummary {
  totalSize: number;
  count: number;
  largestScripts: IResource[];
}

export type TDependencyNodeType = 'document' | 'script' | 'stylesheet' | 'image' | 'font' | 'other';

export interface IDependencyNode {
  id: string;
  label: string;
  url: string;
  type: TDependencyNodeType;
  size: number;
}

export interface IDependencyEdge {
  source: string;
  target: string;
}

export interface IDependencyGraph {
  nodes: IDependencyNode[];
  edges: IDependencyEdge[];
}

export interface IAnalysis {
  url: string;
  analysisDuration: number;
  resources: IResource[];
  webVitals: IWebVitals;
  longTasks: ILongTaskSummary;
  javascript: IJavaScriptSummary;
  dependencyGraph: IDependencyGraph;
  issues: IPerformanceIssue[];
}

export type TAnalysisInput = Omit<IAnalysis, 'issues'>;
