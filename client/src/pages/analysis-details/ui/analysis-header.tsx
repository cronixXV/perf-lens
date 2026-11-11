import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router';

import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';
import { formatDateTime } from '@/shared/lib/format';

interface IAnalysisHeaderProps {
  analysis: ISavedAnalysis;
}

export const AnalysisHeader = ({ analysis }: IAnalysisHeaderProps) => (
  <Box>
    <Button asChild variant="ghost" size="sm" mb={3} ms={-2}>
      <RouterLink to="/history">← Back to history</RouterLink>
    </Button>

    <Heading size="2xl" letterSpacing="-0.02em" wordBreak="break-all">
      {analysis.analysis.url}
    </Heading>

    <Text mt={2} fontSize="sm" color="fg.muted">
      {formatDateTime(analysis.createdAt)} · ID: {analysis.id}
    </Text>
  </Box>
);
