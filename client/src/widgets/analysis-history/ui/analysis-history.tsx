import { useState } from 'react';
import { Badge, Box, Button, Heading, HStack, Stack, Text } from '@chakra-ui/react';

import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';

interface IAnalysisHistoryProps {
  analyses: ISavedAnalysis[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const VISIBLE_COUNT = 5;

export const AnalysisHistory = ({ analyses, selectedId, onSelect }: IAnalysisHistoryProps) => {
  const [showAll, setShowAll] = useState(false);

  const visibleAnalyses = showAll ? analyses : analyses.slice(0, VISIBLE_COUNT);

  return (
    <Stack gap={3}>
      <HStack justify="space-between">
        <Heading size="md">Analysis history</Heading>

        <Text fontSize="sm" color="fg.muted">
          {analyses.length} analyses
        </Text>
      </HStack>

      {analyses.length === 0 ? (
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Text color="fg.muted" fontSize="sm">
            No analyses yet
          </Text>
        </Box>
      ) : (
        <>
          <Stack
            gap={2}
            maxH={showAll ? '420px' : undefined}
            overflowY={showAll ? 'auto' : undefined}
          >
            {visibleAnalyses.map((item) => {
              const isSelected = selectedId === item.id;
              const lcp = item.analysis.webVitals.lcp?.value;

              return (
                <HStack
                  key={item.id}
                  justify="space-between"
                  gap={3}
                  p={3}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={isSelected ? 'blue.400' : 'border'}
                  bg={isSelected ? 'blue.subtle' : 'transparent'}
                  minW={0}
                >
                  <Stack gap={1} minW={0} flex="1">
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      title={item.analysis.url}
                    >
                      {item.analysis.url}
                    </Text>

                    <HStack gap={2} wrap="wrap">
                      <Text fontSize="xs" color="fg.muted">
                        {new Date(item.createdAt).toLocaleString()}
                      </Text>

                      <Badge size="sm" colorPalette={lcp == null ? 'gray' : 'blue'}>
                        LCP: {lcp == null ? 'N/A' : `${(lcp / 1000).toFixed(2)} s`}
                      </Badge>
                    </HStack>
                  </Stack>

                  <Button
                    size="xs"
                    variant={isSelected ? 'solid' : 'outline'}
                    flexShrink={0}
                    onClick={() => onSelect(item.id)}
                  >
                    {isSelected ? 'Selected' : 'Open'}
                  </Button>
                </HStack>
              );
            })}
          </Stack>

          {analyses.length > VISIBLE_COUNT && (
            <Button
              size="sm"
              variant="ghost"
              alignSelf="center"
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll ? 'Show less' : `Show all (${analyses.length})`}
            </Button>
          )}
        </>
      )}
    </Stack>
  );
};
