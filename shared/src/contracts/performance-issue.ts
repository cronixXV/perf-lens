export type TIssueSeverity = 'critical' | 'warning' | 'info';

export type TIssueCategory = 'web-vitals' | 'image' | 'javascript' | 'stylesheet' | 'network';

export interface IPerformanceIssue {
  id: string;
  severity: TIssueSeverity;
  category: TIssueCategory;
  title: string;
  description: string;
  recommendation: string;
  resourceUrl: string | null;
  resourceSize: number | null;
  metricValue: number | null;
}
