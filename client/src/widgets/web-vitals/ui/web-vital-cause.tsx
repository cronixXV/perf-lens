import { Badge, Box, Card, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';

import type { IResource } from '@shared/contracts/analysis';

import { formatSize, formatTime } from '@/shared/lib/format';

interface IWebVitalCauseProps {
  resource: IResource | null;
  element: string | null;
}

export const WebVitalCause = ({ resource, element }: IWebVitalCauseProps) => {
  if (!resource) {
    return (
      <Card.Root variant="outline" bg="surface.bg" borderColor="border" borderRadius="xl">
        <Card.Body>
          <Stack gap={2}>
            <Heading size="sm">Likely cause</Heading>

            <Text fontSize="sm" color="textMuted">
              {element
                ? `Largest contentful element: <${element}>`
                : 'No associated resource was found'}
            </Text>
          </Stack>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root variant="outline" bg="surface.bg" borderColor="border" borderRadius="xl">
      <Card.Header pb={3}>
        <Stack gap={2}>
          <Stack direction="row" align="center" justify="space-between">
            <Heading size="sm">Likely cause</Heading>

            <Badge colorPalette="blue" variant="subtle">
              {resource.type}
            </Badge>
          </Stack>

          <Text fontSize="sm" color="textMuted">
            Resource associated with the LCP element
          </Text>
        </Stack>
      </Card.Header>

      <Card.Body pt={2}>
        <Stack gap={4}>
          <Box
            px={3}
            py={2}
            borderWidth="1px"
            borderColor="border"
            borderRadius="md"
            bg="surfaceSubtle.bg"
          >
            <Text fontSize="sm" fontFamily="mono" wordBreak="break-all">
              {resource.url}
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
            <Box>
              <Text fontSize="xs" color="textMuted" mb={1}>
                Size
              </Text>

              <Text fontSize="sm" fontWeight="semibold">
                {formatSize(resource.size)}
              </Text>
            </Box>

            <Box>
              <Text fontSize="xs" color="textMuted" mb={1}>
                Started
              </Text>

              <Text fontSize="sm" fontWeight="semibold">
                {formatTime(resource.startTime)}
              </Text>
            </Box>

            <Box>
              <Text fontSize="xs" color="textMuted" mb={1}>
                Duration
              </Text>

              <Text fontSize="sm" fontWeight="semibold">
                {formatTime(resource.duration)}
              </Text>
            </Box>
          </SimpleGrid>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
