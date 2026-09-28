import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface IAppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: IAppShellProps) => {
  return (
    <Box minHeight="100vh" bg="app.bg">
      <Box as="header" borderBottomWidth="1px" borderColor="border" bg="surface.bg">
        <Container maxW="1400px">
          <Flex height="64px" align="center" justify="space-between">
            <Flex align="center" gap={3}>
              <Box
                width="32px"
                height="32px"
                borderRadius="md"
                bg="brand.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="sm"
                fontWeight="bold"
              >
                P
              </Box>

              <Heading size="md">PerfLens</Heading>
            </Flex>

            <Text fontSize="sm" color="textMuted">
              Web performance analyzer
            </Text>
          </Flex>
        </Container>
      </Box>

      <Box as="main">
        <Container maxW="1400px" py={{ base: 6, md: 10 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};
