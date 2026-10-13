import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import type { IDependencyGraph, IDependencyNode } from '@shared/contracts/analysis';
import { formatBytes } from '@/shared/lib/format';
import { getAffectedChunks } from '../lib/dependency-graph';

interface IDependencyDetailsProps {
  graph: IDependencyGraph;
  selectedNode: IDependencyNode | null;
}

const TYPE_COLORS: Record<IDependencyNode['type'], string> = {
  document: '#7C3AED',
  script: '#3B82F6',
  stylesheet: '#0D9488',
  image: '#D97706',
  font: '#DB2777',
  other: '#64748B'
};

interface IResourceListProps {
  title: string;
  nodes: IDependencyNode[];
  emptyMessage: string;
}

const ResourceList = ({ title, nodes, emptyMessage }: IResourceListProps) => (
  <Box>
    <HStack justify="space-between" mb={2} gap={2}>
      <Text fontSize="sm" fontWeight="semibold">
        {title}
      </Text>
      <Text fontSize="xs" color="textMuted" flexShrink={0}>
        {nodes.length}
      </Text>
    </HStack>

    {nodes.length === 0 ? (
      <Text fontSize="sm" color="textMuted">
        {emptyMessage}
      </Text>
    ) : (
      <Stack gap={1} maxHeight="220px" overflowY="auto" pr={1}>
        {nodes.map((node) => (
          <HStack
            key={node.id}
            gap={2}
            p={2}
            borderRadius="md"
            _hover={{ bg: 'surfaceSubtle.bg' }}
            align="center"
            minWidth={0}
          >
            <Box flexShrink={0} boxSize="8px" borderRadius="full" bg={TYPE_COLORS[node.type]} />

            <Box flex="1" minWidth={0}>
              <Text
                fontSize="sm"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                title={node.label}
              >
                {node.label}
              </Text>
              <Text fontSize="xs" color="textMuted">
                {node.type}
              </Text>
            </Box>

            <Text fontSize="xs" color="textMuted" flexShrink={0}>
              {formatBytes(node.size)}
            </Text>
          </HStack>
        ))}
      </Stack>
    )}
  </Box>
);

export const DependencyDetails = ({ graph, selectedNode }: IDependencyDetailsProps) => {
  if (!selectedNode) {
    return (
      <Box p={4} borderWidth="1px" borderColor="border" borderRadius="xl">
        <Text color="textMuted">Select a node to inspect its dependencies.</Text>
      </Box>
    );
  }

  const dependencies = graph.edges
    .filter((edge) => edge.source === selectedNode.id)
    .map((edge) => graph.nodes.find((node) => node.id === edge.target))
    .filter((node): node is IDependencyNode => node !== undefined);

  const affectedResources = getAffectedChunks(graph, selectedNode.id);

  return (
    <Box p={4} borderWidth="1px" borderColor="border" borderRadius="xl" minWidth={0}>
      <Stack gap={4}>
        <Box minWidth={0}>
          <HStack gap={2} mb={2}>
            <Box
              boxSize="10px"
              borderRadius="full"
              bg={TYPE_COLORS[selectedNode.type]}
              flexShrink={0}
            />
            <Text fontSize="xs" color="textMuted" textTransform="uppercase">
              {selectedNode.type}
            </Text>
          </HStack>

          <Text fontSize="lg" fontWeight="semibold" overflowWrap="anywhere">
            {selectedNode.label}
          </Text>

          <Text
            fontSize="xs"
            color="textMuted"
            overflowWrap="anywhere"
            mt={1}
            title={selectedNode.url}
          >
            {selectedNode.url}
          </Text>
        </Box>

        <Box p={3} borderRadius="lg" bg="surfaceSubtle.bg">
          <Text fontSize="xs" color="textMuted" mb={1}>
            Resource size
          </Text>
          <Text fontSize="2xl" fontWeight="semibold">
            {formatBytes(selectedNode.size)}
          </Text>
        </Box>

        <ResourceList
          title="Direct dependencies"
          nodes={dependencies}
          emptyMessage="No outgoing dependencies detected."
        />

        <Box borderTopWidth="1px" borderColor="border" />

        <ResourceList
          title="Affected resources"
          nodes={affectedResources}
          emptyMessage="No downstream resources detected."
        />
      </Stack>
    </Box>
  );
};
