import { Box, Flex } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { scaleLinear } from 'd3-scale';

import type { IResource, TResourceType } from '@shared/contracts/analysis';
import type { TResourceSort } from '../model/types/resource-waterfall.types';

import { ResourceDetails } from './resource-details';
import { ResourceFilter } from './resource-filter';
import { ResourceSort } from './resource-sort';
import { ResourceZoom } from './resource-zoom';

interface IResourceWaterfallProps {
  resources: IResource[];
}

const ROW_HEIGHT = 32;
const LABEL_WIDTH = 220;
const TIMELINE_WIDTH = 1000;
const PADDING = 20;

export const ResourceWaterfall = ({ resources }: IResourceWaterfallProps) => {
  const [selectedResourceKey, setSelectedResourceKey] = useState<string | null>(null);
  const [resourceType, setResourceType] = useState<TResourceType | 'all'>('all');
  const [sort, setSort] = useState<TResourceSort>('startTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [zoom, setZoom] = useState(1);

  const filteredResources = useMemo(() => {
    if (resourceType === 'all') {
      return resources;
    }

    return resources.filter((resource) => resource.type === resourceType);
  }, [resources, resourceType]);

  const visibleResources = useMemo(() => {
    return [...filteredResources].sort((a, b) => {
      const difference = a[sort] - b[sort];

      return sortDirection === 'asc' ? difference : -difference;
    });
  }, [filteredResources, sort, sortDirection]);

  const selectedResource = useMemo(
    () =>
      filteredResources.find(
        (resource) => `${resource.url}-${resource.startTime}` === selectedResourceKey
      ) ?? null,
    [filteredResources, selectedResourceKey]
  );

  const maxTime = useMemo(
    () => Math.max(...resources.map((resource) => resource.responseEnd), 0),
    [resources]
  );

  const timelineWidth = TIMELINE_WIDTH * zoom;

  const scale = useMemo(
    () => scaleLinear().domain([0, maxTime]).range([0, timelineWidth]),
    [maxTime, timelineWidth]
  );

  const height = visibleResources.length * ROW_HEIGHT;

  const handleResourceTypeChange = (type: TResourceType | 'all') => {
    setResourceType(type);

    if (
      selectedResourceKey &&
      type !== 'all' &&
      !resources.some(
        (resource) =>
          resource.type === type && `${resource.url}-${resource.startTime}` === selectedResourceKey
      )
    ) {
      setSelectedResourceKey(null);
    }
  };

  const handleSortChange = (value: TResourceSort) => {
    setSort(value);
    setSortDirection(value === 'startTime' ? 'asc' : 'desc');
  };

  return (
    <Flex direction="column" gap={4}>
      <Flex align="center" justify="space-between" gap={4} wrap="wrap">
        <Flex align="center" gap={2} wrap="wrap">
          <ResourceFilter value={resourceType} onChange={handleResourceTypeChange} />

          <ResourceSort value={sort} onChange={handleSortChange} />
        </Flex>

        <ResourceZoom value={zoom} onChange={setZoom} />
      </Flex>

      <Box
        overflowX="auto"
        borderWidth="1px"
        borderColor="border"
        borderRadius="lg"
        bg="surface.bg"
      >
        <svg width={LABEL_WIDTH + timelineWidth + PADDING * 2} height={height + 40}>
          {[0, 25, 50, 75, 100].map((percent) => {
            const time = maxTime * (percent / 100);
            const x = LABEL_WIDTH + PADDING + scale(time);

            return (
              <g key={percent}>
                <line
                  x1={x}
                  x2={x}
                  y1={20}
                  y2={height + 30}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />

                <text
                  x={x}
                  y={15}
                  fontSize={11}
                  textAnchor="middle"
                  fill="currentColor"
                  opacity={0.5}
                >
                  {Math.round(time)} ms
                </text>
              </g>
            );
          })}

          {visibleResources.map((resource, index) => {
            const resourceKey = `${resource.url}-${resource.startTime}`;
            const isSelected = selectedResourceKey === resourceKey;

            const x = LABEL_WIDTH + PADDING + scale(resource.startTime);

            const width = scale(resource.responseEnd) - scale(resource.startTime);

            const y = index * ROW_HEIGHT + 30;

            return (
              <g key={resourceKey}>
                <text x={PADDING} y={y + 20} fontSize={12} fill="currentColor" opacity={0.75}>
                  {resource.url}
                </text>

                <rect
                  x={x}
                  y={y + 6}
                  width={Math.max(width, 2)}
                  height={20}
                  rx={4}
                  fill="currentColor"
                  opacity={isSelected ? 1 : 0.35}
                  stroke={isSelected ? 'currentColor' : 'none'}
                  strokeWidth={isSelected ? 2 : 0}
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    setSelectedResourceKey((currentKey) =>
                      currentKey === resourceKey ? null : resourceKey
                    )
                  }
                />
              </g>
            );
          })}
        </svg>
      </Box>

      <ResourceDetails resource={selectedResource} />
    </Flex>
  );
};
