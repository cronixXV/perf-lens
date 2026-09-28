import { Button, ButtonGroup } from '@chakra-ui/react';

import type { TResourceType } from '@shared/contracts/analysis';

type TResourceFilterValue = TResourceType | 'all';

interface IResourceFilterProps {
  value: TResourceFilterValue;
  onChange: (value: TResourceFilterValue) => void;
}

const filters: Array<{
  label: string;
  value: TResourceFilterValue;
}> = [
  { label: 'All', value: 'all' },
  { label: 'Document', value: 'document' },
  { label: 'JS', value: 'script' },
  { label: 'CSS', value: 'stylesheet' },
  { label: 'Images', value: 'image' },
  { label: 'Fonts', value: 'font' }
];

export const ResourceFilter = ({ value, onChange }: IResourceFilterProps) => {
  return (
    <ButtonGroup attached size="sm">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={value === filter.value ? 'solid' : 'outline'}
          colorPalette={value === filter.value ? 'blue' : 'gray'}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};
