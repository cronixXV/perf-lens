import { Badge, Box, Table, Text } from '@chakra-ui/react';

import type {
  IAnalysisComparison,
  IMetricComparison,
  TComparisonMetricKey
} from '@shared/contracts/analysis-comparison';

import {
  METRIC_CONFIG,
  TREND_CONFIG,
  formatChangePercent,
  formatMetricDifference,
  formatMetricValue
} from '@/entities/performance-metric';

interface IAnalysisComparisonTableProps {
  comparison: IAnalysisComparison;
}

export const AnalysisComparisonTable = ({ comparison }: IAnalysisComparisonTableProps) => {
  const metrics = Object.entries(comparison.metrics) as [TComparisonMetricKey, IMetricComparison][];

  return (
    <Box overflowX="auto">
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Metric</Table.ColumnHeader>
            <Table.ColumnHeader>Before</Table.ColumnHeader>
            <Table.ColumnHeader>After</Table.ColumnHeader>
            <Table.ColumnHeader>Difference</Table.ColumnHeader>
            <Table.ColumnHeader>Change</Table.ColumnHeader>
            <Table.ColumnHeader>Trend</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {metrics.map(([key, metric]) => {
            const trend = TREND_CONFIG[metric.trend];

            return (
              <Table.Row key={key}>
                <Table.Cell fontWeight="medium">{METRIC_CONFIG[key].label}</Table.Cell>
                <Table.Cell>{formatMetricValue(key, metric.before)}</Table.Cell>
                <Table.Cell>{formatMetricValue(key, metric.after)}</Table.Cell>
                <Table.Cell>{formatMetricDifference(key, metric.difference)}</Table.Cell>
                <Table.Cell>{formatChangePercent(metric.changePercent)}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={trend.color}>{trend.label}</Badge>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      <Text mt={2} fontSize="xs" color="fg.muted">
        Negative values indicate a decrease; positive values indicate an increase.
      </Text>
    </Box>
  );
};
