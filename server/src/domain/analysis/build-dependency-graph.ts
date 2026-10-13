import type { IDependencyGraph, IDependencyNode, IResource } from '@shared/contracts/analysis';

type TResourceDependency = {
  sourceUrl: string;
  targetUrl: string;
};

const getLabel = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('/').pop() || url;
  } catch {
    return url;
  }
};

const getNodeType = (resource: IResource): IDependencyNode['type'] => {
  switch (resource.type) {
    case 'document':
    case 'script':
    case 'stylesheet':
    case 'image':
    case 'font':
      return resource.type;
    default:
      return 'other';
  }
};

export const buildDependencyGraph = (
  resources: IResource[],
  dependencies: TResourceDependency[]
): IDependencyGraph => {
  const nodes: IDependencyNode[] = resources.map((resource) => ({
    id: resource.url,
    label: getLabel(resource.url),
    url: resource.url,
    type: getNodeType(resource),
    size: resource.size
  }));

  const nodeIds = new Set(nodes.map((node) => node.id));
  const edgeKeys = new Set<string>();

  const edges = dependencies.flatMap(({ sourceUrl, targetUrl }) => {
    if (sourceUrl === targetUrl || !nodeIds.has(sourceUrl) || !nodeIds.has(targetUrl)) {
      return [];
    }

    const key = `${sourceUrl}\u0000${targetUrl}`;

    if (edgeKeys.has(key)) {
      return [];
    }

    edgeKeys.add(key);

    return [{ source: sourceUrl, target: targetUrl }];
  });

  return { nodes, edges };
};
