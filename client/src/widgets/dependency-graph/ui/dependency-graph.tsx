import { useMemo, useState } from 'react';
import { Box, Grid, HStack, Stack, Text } from '@chakra-ui/react';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY
} from 'd3';
import type { IDependencyGraph, IDependencyNode } from '@shared/contracts/analysis';
import { DependencyDetails } from './dependency-details';
import { getRelatedNodeIds } from '../lib/dependency-graph';

interface IDependencyGraphProps {
  graph: IDependencyGraph;
}

interface IPositionedNode extends IDependencyNode {
  x: number;
  y: number;
}

const WIDTH = 1200;
const HEIGHT = 720;

const NODE_COLORS: Record<IDependencyNode['type'], string> = {
  document: '#7C3AED',
  script: '#3B82F6',
  stylesheet: '#0D9488',
  image: '#D97706',
  font: '#DB2777',
  other: '#64748B'
};

const getNodeLabel = (label: string): string => {
  if (label.length <= 20) {
    return label;
  }

  return `${label.slice(0, 17)}...`;
};

const getNodeRadius = (node: IPositionedNode): number => {
  return node.type === 'document' ? 10 : 7;
};

export const DependencyGraph = ({ graph }: IDependencyGraphProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(graph.nodes[0]?.id ?? null);

  const positions = useMemo(() => {
    const nodes: IPositionedNode[] = graph.nodes.map((node) => ({
      ...node,
      x: WIDTH / 2,
      y: HEIGHT / 2
    }));

    const links = graph.edges.map((edge) => ({ ...edge }));

    const simulation = forceSimulation(nodes)
      .force(
        'link',
        forceLink(links)
          .id((node) => (node as IPositionedNode).id)
          .distance(190)
          .strength(0.45)
      )
      .force('charge', forceManyBody().strength(-750))
      .force(
        'collide',
        forceCollide<IPositionedNode>().radius((node) => getNodeRadius(node) + 65)
      )
      .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
      .force('x', forceX(WIDTH / 2).strength(0.02))
      .force('y', forceY(HEIGHT / 2).strength(0.02))
      .stop();

    for (let i = 0; i < 300; i += 1) {
      simulation.tick();
    }

    const result: IPositionedNode[] = nodes.map((node) => ({
      ...node,
      x: Math.max(55, Math.min(WIDTH - 55, node.x)),
      y: Math.max(35, Math.min(HEIGHT - 35, node.y))
    }));

    simulation.stop();

    return result;
  }, [graph.nodes, graph.edges]);

  const selectedNode = useMemo(
    () => graph.nodes.find((node) => node.id === selectedId) ?? graph.nodes[0] ?? null,
    [graph.nodes, selectedId]
  );

  const activeSelectedId = selectedNode?.id ?? null;

  const relatedIds = useMemo(
    () => (activeSelectedId ? getRelatedNodeIds(graph, activeSelectedId) : new Set<string>()),
    [graph, activeSelectedId]
  );

  const positionById = useMemo(
    () => new Map(positions.map((node) => [node.id, node])),
    [positions]
  );

  if (graph.nodes.length === 0) {
    return (
      <Box p={5} borderWidth="1px" borderColor="border" borderRadius="xl">
        <Text color="textMuted">No dependency data was collected for this page.</Text>
      </Box>
    );
  }

  return (
    <Grid
      templateColumns={{
        base: 'minmax(0, 1fr)',
        xl: 'minmax(0, 1.8fr) minmax(320px, 1fr)'
      }}
      alignItems="start"
      gap={4}
    >
      <Stack gap={3} minWidth={0}>
        <Box
          borderWidth="1px"
          borderColor="border"
          borderRadius="xl"
          overflow="hidden"
          minWidth={0}
        >
          <HStack
            px={4}
            py={3}
            justify="space-between"
            borderBottomWidth="1px"
            borderColor="border"
            align="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Text fontWeight="semibold">Resource map</Text>
              <Text fontSize="xs" color="textMuted">
                {graph.nodes.length} resources · {graph.edges.length} connections
              </Text>
            </Box>

            <Text fontSize="xs" color="textMuted">
              Select a node to inspect it
            </Text>
          </HStack>

          <Box overflowX="auto" bg="surfaceSubtle.bg">
            <Box minWidth="620px">
              <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                width="100%"
                role="img"
                aria-label="Resource dependency graph"
                style={{ display: 'block' }}
              >
                {graph.edges.map((edge, index) => {
                  const source = positionById.get(edge.source);
                  const target = positionById.get(edge.target);

                  if (!source || !target) {
                    return null;
                  }

                  const dx = target.x - source.x;
                  const dy = target.y - source.y;
                  const distance = Math.hypot(dx, dy) || 1;

                  const sourceRadius = source.id === activeSelectedId ? 16 : 13;
                  const targetRadius = target.id === activeSelectedId ? 16 : 13;

                  const x1 = source.x + (dx / distance) * sourceRadius;
                  const y1 = source.y + (dy / distance) * sourceRadius;
                  const x2 = target.x - (dx / distance) * targetRadius;
                  const y2 = target.y - (dy / distance) * targetRadius;

                  const isRelated = relatedIds.has(edge.source) && relatedIds.has(edge.target);

                  return (
                    <line
                      key={`${edge.source}-${edge.target}-${index}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isRelated ? '#3B82F6' : '#94A3B8'}
                      strokeOpacity={isRelated ? 0.9 : 0.2}
                      strokeWidth={isRelated ? 2 : 1}
                    />
                  );
                })}

                {positions.map((node) => {
                  const isSelected = node.id === activeSelectedId;
                  const isRelated = relatedIds.has(node.id);
                  const color = NODE_COLORS[node.type];
                  const labelOnLeft = node.x > WIDTH / 2;
                  const labelX = labelOnLeft ? -17 : 17;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${node.label}`}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedId(node.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedId(node.id);
                        }
                      }}
                      style={{ cursor: 'pointer', outline: 'none' }}
                    >
                      <circle
                        r={isSelected ? 15 : 12}
                        fill={color}
                        opacity={isRelated ? 1 : 0.3}
                        stroke={isSelected ? '#1D4ED8' : 'white'}
                        strokeWidth={isSelected ? 3 : 1.5}
                      />

                      {isSelected && (
                        <circle
                          r={21}
                          fill="none"
                          stroke={color}
                          strokeOpacity={0.45}
                          strokeWidth={2}
                        />
                      )}

                      <text
                        x={labelX}
                        textAnchor={labelOnLeft ? 'end' : 'start'}
                        y={4}
                        fontSize={12}
                        fontWeight={isSelected ? 600 : 400}
                        fill="currentColor"
                        opacity={isRelated ? 1 : 0.45}
                        pointerEvents="none"
                      >
                        {getNodeLabel(node.label)}
                      </text>

                      <title>{`${node.label}\n${node.url}`}</title>
                    </g>
                  );
                })}
              </svg>
            </Box>
          </Box>

          <HStack px={4} py={3} gap={4} borderTopWidth="1px" borderColor="border" flexWrap="wrap">
            {(Object.entries(NODE_COLORS) as [IDependencyNode['type'], string][]).map(
              ([type, color]) => (
                <HStack key={type} gap={1.5}>
                  <Box boxSize="8px" borderRadius="full" bg={color} />
                  <Text fontSize="xs" color="textMuted">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </HStack>
              )
            )}
          </HStack>
        </Box>
      </Stack>

      <Stack gap={3} minWidth={0}>
        <DependencyDetails graph={graph} selectedNode={selectedNode} />

        <Text fontSize="xs" color="textMuted">
          Connections represent detected request initiators, not necessarily imports between modules
          inside a bundled file.
        </Text>
      </Stack>
    </Grid>
  );
};
