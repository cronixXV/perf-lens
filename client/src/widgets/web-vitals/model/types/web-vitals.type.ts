import type { IWebVitals } from '@shared/contracts/analysis';

export type TVitalMetric = keyof IWebVitals;

export type TVitalStatus = 'good' | 'needs-improvement' | 'poor' | 'unavailable';
