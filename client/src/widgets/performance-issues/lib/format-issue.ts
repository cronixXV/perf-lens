import type { TIssueCategory, TIssueSeverity } from '@shared/contracts/performance-issue';

export const severityLabels: Record<TIssueSeverity, string> = {
  critical: 'Критическая',
  warning: 'Предупреждение',
  info: 'Информация'
};

export const severityColors: Record<TIssueSeverity, string> = {
  critical: 'red',
  warning: 'orange',
  info: 'blue'
};

export const categoryLabels: Record<TIssueCategory, string> = {
  'web-vitals': 'Web Vitals',
  image: 'Изображения',
  javascript: 'JavaScript',
  stylesheet: 'CSS',
  network: 'Сеть'
};
