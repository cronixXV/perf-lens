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

import type {
  IAnalysisComparison,
  TComparisonMetricKey
} from '@shared/contracts/analysis-comparison';
import { METRIC_CONFIG } from '@/entities/performance-metric';

interface IMetricChartProps {
  title: string;
  metricKeys: TComparisonMetricKey[];
  comparison: IAnalysisComparison;
  formatValue?: (value: number) => string;
}

const MetricChart = ({ title, metricKeys, comparison, formatValue }: IMetricChartProps) => {
  const data = metricKeys
    .map((key) => {
      const metric = comparison.metrics[key];

      return {
        metric: METRIC_CONFIG[key].label,
        Before: metric.before,
        After: metric.after
      };
    })
    .filter((item) => item.Before !== null && item.After !== null);

  if (data.length === 0) return null;

  return (
    <div>
      <h3>{title}</h3>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis tickFormatter={formatValue} />
            <Tooltip
              formatter={(value) =>
                typeof value === 'number' && formatValue ? formatValue(value) : value
              }
            />
            <Legend />
            <Bar dataKey="Before" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="After" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface IAnalysisTechnicalComparisonChartProps {
  comparison: IAnalysisComparison;
}

export const AnalysisTechnicalComparisonChart = ({
  comparison
}: IAnalysisTechnicalComparisonChartProps) => {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <MetricChart
        title="JavaScript size"
        metricKeys={['javascriptSize']}
        comparison={comparison}
        formatValue={(value) => `${(value / 1024).toFixed(0)} KB`}
      />

      <MetricChart
        title="Resource and long task count"
        metricKeys={['resourceCount', 'longTaskCount']}
        comparison={comparison}
      />

      <MetricChart
        title="Total Blocking Time"
        metricKeys={['totalBlockingTime']}
        comparison={comparison}
        formatValue={(value) => `${value.toFixed(0)} ms`}
      />
    </div>
  );
};
