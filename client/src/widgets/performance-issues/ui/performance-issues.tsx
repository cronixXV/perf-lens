import { useState } from 'react';
import { Badge, Box, Button, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import type { IPerformanceIssue, TIssueSeverity } from '@shared/contracts/performance-issue';
import { PerformanceIssueCard } from './performance-issue-card';

type TIssueFilter = 'all' | TIssueSeverity;

const filters: { value: TIssueFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'critical', label: 'Критические' },
  { value: 'warning', label: 'Предупреждения' },
  { value: 'info', label: 'Информация' }
];

interface IPerformanceIssuesProps {
  issues: IPerformanceIssue[];
}

export const PerformanceIssues = ({ issues }: IPerformanceIssuesProps) => {
  const [filter, setFilter] = useState<TIssueFilter>('all');

  const filteredIssues =
    filter === 'all' ? issues : issues.filter((issue) => issue.severity === filter);

  const criticalCount = issues.filter((issue) => issue.severity === 'critical').length;

  const warningCount = issues.filter((issue) => issue.severity === 'warning').length;

  if (issues.length === 0) {
    return (
      <Box borderWidth="1px" borderRadius="lg" p={5}>
        <Text fontWeight="semibold">Проблем не обнаружено</Text>
        <Text color="fg.muted" fontSize="sm" mt={1}>
          По текущим правилам анализа проблем не найдено.
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap={4} width="100%">
      <Box>
        <Text fontSize="xl" fontWeight="bold">
          Проблемы производительности
        </Text>
        <Text color="fg.muted" fontSize="sm" mt={1}>
          Всего найдено: {issues.length}
        </Text>
      </Box>

      <Box display="flex" gap={2} flexWrap="wrap">
        <Badge colorPalette="red">Критические: {criticalCount}</Badge>
        <Badge colorPalette="orange">Предупреждения: {warningCount}</Badge>
      </Box>

      <Box display="flex" gap={2} flexWrap="wrap">
        {filters.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={filter === item.value ? 'solid' : 'outline'}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      {filteredIssues.length === 0 ? (
        <Box borderWidth="1px" borderRadius="lg" p={4}>
          <Text color="fg.muted" fontSize="sm">
            Проблем с выбранным уровнем серьёзности нет.
          </Text>
        </Box>
      ) : (
        <>
          <Text color="fg.muted" fontSize="sm">
            Показано: {filteredIssues.length}
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {filteredIssues.map((issue) => (
              <PerformanceIssueCard key={issue.id} issue={issue} />
            ))}
          </SimpleGrid>
        </>
      )}
    </VStack>
  );
};
