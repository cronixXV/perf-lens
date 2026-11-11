import { Badge, Card, Heading, SimpleGrid, Stat, Text } from '@chakra-ui/react';

import type { IAnalysisComparison } from '@shared/contracts/analysis-comparison';

interface IAnalysisComparisonSummaryProps {
  comparison: IAnalysisComparison;
}

export const AnalysisComparisonSummary = ({ comparison }: IAnalysisComparisonSummaryProps) => {
  const metrics = Object.values(comparison.metrics);

  const improved = metrics.filter((metric) => metric.trend === 'improved').length;
  const regressed = metrics.filter((metric) => metric.trend === 'regressed').length;
  const unchanged = metrics.filter((metric) => metric.trend === 'unchanged').length;
  const unavailable = metrics.filter((metric) => metric.trend === 'unavailable').length;

  const result =
    improved > regressed
      ? 'Performance improved'
      : regressed > improved
        ? 'Performance regressed'
        : 'No significant change';

  return (
    <Card.Root>
      <Card.Body gap={4}>
        <Heading size="md">Comparison summary</Heading>

        <Badge
          colorPalette={improved > regressed ? 'green' : regressed > improved ? 'red' : 'gray'}
          width="fit-content"
        >
          {result}
        </Badge>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
          <Stat.Root>
            <Stat.Label>Improved</Stat.Label>
            <Stat.ValueText color="green.500">{improved}</Stat.ValueText>
          </Stat.Root>

          <Stat.Root>
            <Stat.Label>Regressed</Stat.Label>
            <Stat.ValueText color="red.500">{regressed}</Stat.ValueText>
          </Stat.Root>

          <Stat.Root>
            <Stat.Label>Unchanged</Stat.Label>
            <Stat.ValueText>{unchanged}</Stat.ValueText>
          </Stat.Root>

          <Stat.Root>
            <Stat.Label>Unavailable</Stat.Label>
            <Stat.ValueText>{unavailable}</Stat.ValueText>
          </Stat.Root>
        </SimpleGrid>

        <Text color="fg.muted" fontSize="sm">
          Results are based on the comparison of {metrics.length} performance metrics.
        </Text>
      </Card.Body>
    </Card.Root>
  );
};
