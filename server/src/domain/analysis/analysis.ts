export interface IAnalysis {
  url: string;
  duration: number;
  resources: unknown[];
  webVitals: Record<string, unknown>;
}
