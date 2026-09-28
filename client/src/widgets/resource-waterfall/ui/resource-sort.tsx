import { NativeSelect } from '@chakra-ui/react';

import type { TResourceSort } from '../model/types/resource-waterfall.types';

interface IResourceSortProps {
  value: TResourceSort;
  onChange: (value: TResourceSort) => void;
}

export const ResourceSort = ({ value, onChange }: IResourceSortProps) => {
  return (
    <NativeSelect.Root size="sm" width="180px">
      <NativeSelect.Field
        value={value}
        onChange={(event) => onChange(event.target.value as TResourceSort)}
      >
        <option value="startTime">Start time</option>
        <option value="duration">Duration</option>
        <option value="size">Size</option>
        <option value="transferSize">Transfer size</option>
      </NativeSelect.Field>
    </NativeSelect.Root>
  );
};
