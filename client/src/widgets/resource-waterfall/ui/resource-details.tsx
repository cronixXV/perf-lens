import { Badge, Box, Card, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';

import { formatSize, formatTime } from '@/shared/lib/format';

import type { IResource } from '@shared/contracts/analysis';

interface IResourceDetailsProps {
  resource: IResource | null;
}

const metricItems = [
  {
    label: 'Size',
    key: 'size'
  },
  {
    label: 'Transfer',
    key: 'transferSize'
  }
] as const;

export const ResourceDetails = ({ resource }: IResourceDetailsProps) => {
  if (!resource) {
    return (
      <Card.Root variant="outline" bg="surface.bg" borderColor="border">
        <Card.Body py={10}>
          <Stack align="center" gap={2}>
            <Text fontSize="sm" fontWeight="medium">
              No resource selected
            </Text>

            <Text fontSize="sm" color="textMuted">
              Select a resource in the waterfall to inspect its details
            </Text>
          </Stack>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root variant="outline" bg="surface.bg" borderColor="border">
      <Card.Header pb={4}>
        <Stack gap={3}>
          <Stack direction="row" align="center" justify="space-between">
            <Heading size="md">Resource details</Heading>

            <Badge colorPalette="blue" variant="subtle">
              {resource.type}
            </Badge>
          </Stack>

          <Box
            px={3}
            py={2}
            borderRadius="md"
            bg="surfaceSubtle.bg"
            borderWidth="1px"
            borderColor="border"
          >
            <Text fontSize="sm" color="textMuted" wordBreak="break-all" fontFamily="mono">
              {resource.url}
            </Text>
          </Box>
        </Stack>
      </Card.Header>

      <Card.Body pt={2}>
        <Stack gap={6}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
            {metricItems.map((item) => {
              const value =
                item.key === 'size' ? formatSize(resource.size) : formatSize(resource.transferSize);

              return (
                <Box
                  key={item.key}
                  px={4}
                  py={3}
                  borderRadius="md"
                  bg="surfaceSubtle.bg"
                  borderWidth="1px"
                  borderColor="border"
                >
                  <Text fontSize="xs" color="textMuted" mb={1}>
                    {item.label}
                  </Text>

                  <Text fontSize="lg" fontWeight="semibold">
                    {value}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>

          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={3}>
              Timing
            </Text>

            <Box borderWidth="1px" borderColor="border" borderRadius="md" overflow="hidden">
              <Stack gap={0}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  px={4}
                  py={3}
                  borderBottomWidth="1px"
                  borderColor="border"
                >
                  <Text fontSize="sm" color="textMuted">
                    Start
                  </Text>

                  <Text fontSize="sm" fontWeight="medium">
                    {formatTime(resource.startTime)}
                  </Text>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  px={4}
                  py={3}
                  borderBottomWidth="1px"
                  borderColor="border"
                >
                  <Text fontSize="sm" color="textMuted">
                    Duration
                  </Text>

                  <Text fontSize="sm" fontWeight="medium">
                    {formatTime(resource.duration)}
                  </Text>
                </Box>

                <Box display="flex" justifyContent="space-between" px={4} py={3}>
                  <Text fontSize="sm" color="textMuted">
                    End
                  </Text>

                  <Text fontSize="sm" fontWeight="medium">
                    {formatTime(resource.responseEnd)}
                  </Text>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
