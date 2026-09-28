import { Button, ButtonGroup, Text } from '@chakra-ui/react';

interface IResourceZoomProps {
  value: number;
  onChange: (value: number) => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;

export const ResourceZoom = ({ value, onChange }: IResourceZoomProps) => {
  const handleZoomOut = () => {
    onChange(Math.max(MIN_ZOOM, value - ZOOM_STEP));
  };

  const handleZoomIn = () => {
    onChange(Math.min(MAX_ZOOM, value + ZOOM_STEP));
  };

  return (
    <ButtonGroup attached size="sm">
      <Button onClick={handleZoomOut} disabled={value === MIN_ZOOM}>
        −
      </Button>

      <Button onClick={() => onChange(1)}>
        <Text minWidth="44px">{Math.round(value * 100)}%</Text>
      </Button>

      <Button onClick={handleZoomIn} disabled={value === MAX_ZOOM}>
        +
      </Button>
    </ButtonGroup>
  );
};
