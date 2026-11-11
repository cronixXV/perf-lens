import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import type { IAnalysisComparison } from '@shared/contracts/analysis-comparison';
import { METRIC_CONFIG, VITAL_METRICS } from '@/entities/performance-metric';

interface IAnalysisComparisonChartProps {
  comparison: IAnalysisComparison;
}

export const AnalysisComparisonChart = ({ comparison }: IAnalysisComparisonChartProps) => {
  const data = VITAL_METRICS.filter((key) => key !== 'cls')
    .map((key) => {
      const metric = comparison.metrics[key];

      return {
        metric: METRIC_CONFIG[key].label,
        Before: metric.before,
        After: metric.after
      };
    })
    .filter((item) => item.Before !== null && item.After !== null);

  if (data.length === 0) {
    return null;
  }

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Before" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="After" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
