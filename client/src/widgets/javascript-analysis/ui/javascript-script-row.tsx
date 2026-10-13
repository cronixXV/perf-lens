import { Box, Flex, Text } from '@chakra-ui/react';
import type { IResource } from '@shared/contracts/analysis';
import { getScriptName } from '../lib/get-script-name';
import { formatBytes } from '@/shared/lib/format';

interface IJavaScriptScriptRowProps {
  resource: IResource;
}

export const JavaScriptScriptRow = ({ resource }: IJavaScriptScriptRowProps) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap={4}
      py={3}
      borderBottomWidth="1px"
      borderColor="border"
    >
      <Box minWidth={0} flex="1">
        <Text fontSize="sm" fontWeight="medium" truncate>
          {getScriptName(resource)}
        </Text>
        <Text fontSize="xs" color="textMuted" truncate>
          {resource.url}
        </Text>
      </Box>

      <Text fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
        {formatBytes(resource.size)}
      </Text>
    </Flex>
  );
};
