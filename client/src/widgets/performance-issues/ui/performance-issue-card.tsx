import { Badge, Card, HStack, Link, Text, VStack } from '@chakra-ui/react';
import { categoryLabels, severityColors, severityLabels } from '../lib/format-issue';

import type { IPerformanceIssue } from '@shared/contracts/performance-issue';
import { formatBytes } from '@/shared/lib/format';

interface IPerformanceIssueCardProps {
  issue: IPerformanceIssue;
}

export const PerformanceIssueCard = ({ issue }: IPerformanceIssueCardProps) => {
  return (
    <Card.Root variant="outline" width="100%">
      <Card.Body gap={3}>
        <HStack justify="space-between" align="start" flexWrap="wrap">
          <VStack align="start" gap={1}>
            <Text fontWeight="semibold">{issue.title}</Text>
            <Text fontSize="sm" color="fg.muted">
              {categoryLabels[issue.category]}
            </Text>
          </VStack>

          <Badge colorPalette={severityColors[issue.severity]}>
            {severityLabels[issue.severity]}
          </Badge>
        </HStack>

        <Text fontSize="sm">{issue.description}</Text>

        <VStack align="start" gap={1}>
          <Text fontWeight="medium" fontSize="sm">
            Рекомендация
          </Text>
          <Text fontSize="sm" color="fg.muted">
            {issue.recommendation}
          </Text>
        </VStack>

        {issue.resourceSize !== null && (
          <Text fontSize="sm" color="fg.muted">
            Размер ресурса: {formatBytes(issue.resourceSize)}
          </Text>
        )}

        {issue.metricValue !== null && (
          <Text fontSize="sm" color="fg.muted">
            Значение метрики: {issue.metricValue.toLocaleString('ru-RU')}
          </Text>
        )}

        {issue.resourceUrl && (
          <Link
            href={issue.resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="blue.500"
            fontSize="sm"
            overflowWrap="anywhere"
          >
            Открыть связанный ресурс
          </Link>
        )}
      </Card.Body>
    </Card.Root>
  );
};
