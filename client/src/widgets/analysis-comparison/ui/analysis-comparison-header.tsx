import { formatDateTime } from '@/shared/lib/format';
import { Card, Heading, HStack, Text, VStack } from '@chakra-ui/react';

import type { IAnalysisComparison } from '@shared/contracts/analysis-comparison';

interface IAnalysisComparisonHeaderProps {
  comparison: IAnalysisComparison;
}

export const AnalysisComparisonHeader = ({ comparison }: IAnalysisComparisonHeaderProps) => {
  return (
    <Card.Root>
      <Card.Body gap={4}>
        <Heading size="md">Analysis comparison</Heading>

        <HStack align="stretch" gap={4}>
          <VStack align="start" flex="1" gap={1}>
            <Text color="fg.muted" fontSize="sm">
              Before
            </Text>
            <Text fontWeight="medium" wordBreak="break-all">
              {comparison.before.url}
            </Text>
            <Text color="fg.muted" fontSize="xs">
              {formatDateTime(comparison.before.createdAt)}
            </Text>
          </VStack>

          <Text alignSelf="center" color="fg.muted">
            →
          </Text>

          <VStack align="start" flex="1" gap={1}>
            <Text color="fg.muted" fontSize="sm">
              After
            </Text>
            <Text fontWeight="medium" wordBreak="break-all">
              {comparison.after.url}
            </Text>
            <Text color="fg.muted" fontSize="xs">
              {formatDateTime(comparison.after.createdAt)}
            </Text>
          </VStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
