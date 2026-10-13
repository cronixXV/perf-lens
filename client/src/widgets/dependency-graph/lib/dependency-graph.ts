import type { IDependencyGraph, IDependencyNode } from '@shared/contracts/analysis';

export const getRelatedNodeIds = (graph: IDependencyGraph, selectedId: string): Set<string> => {
  const related = new Set<string>([selectedId]);

  for (const edge of graph.edges) {
    if (edge.source === selectedId) {
      related.add(edge.target);
    }

    if (edge.target === selectedId) {
      related.add(edge.source);
    }
  }

  return related;
};

export const getAffectedChunks = (
  graph: IDependencyGraph,
  selectedId: string
): IDependencyNode[] => {
  const affected = new Set<string>();
  const queue = [selectedId];

  while (queue.length > 0) {
    const currentId = queue.shift();

    if (!currentId || affected.has(currentId)) {
      continue;
    }

    affected.add(currentId);

    for (const edge of graph.edges) {
      if (edge.source === currentId && !affected.has(edge.target)) {
        queue.push(edge.target);
      }
    }
  }

  return graph.nodes.filter((node) => node.id !== selectedId && affected.has(node.id));
};
