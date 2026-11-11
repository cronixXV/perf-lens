import { Box, Container, Flex, Heading, HStack, Link, Text } from '@chakra-ui/react';
import { NavLink, Outlet } from 'react-router';

const NAV_ITEMS = [
  { to: '/', label: 'Analyze' },
  { to: '/history', label: 'History' },
  { to: '/compare', label: 'Compare' }
] as const;

export const AppShell = () => {
  return (
    <Box minHeight="100vh" bg="app.bg">
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex="sticky"
        borderBottomWidth="1px"
        borderColor="border"
        bg="surface.bg"
      >
        <Container maxW="1400px">
          <Flex height="64px" align="center" justify="space-between" gap={4}>
            <HStack gap={{ base: 4, md: 8 }}>
              <Link asChild _hover={{ textDecoration: 'none' }}>
                <NavLink to="/" aria-label="PerfLens home">
                  <Flex align="center" gap={3}>
                    <Flex
                      boxSize="32px"
                      borderRadius="md"
                      bg="brand.500"
                      align="center"
                      justify="center"
                      color="white"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      P
                    </Flex>

                    <Heading size="md">PerfLens</Heading>
                  </Flex>
                </NavLink>
              </Link>

              <HStack as="nav" gap={1} aria-label="Main navigation">
                {NAV_ITEMS.map(({ to, label }) => (
                  <Link
                    asChild
                    key={to}
                    px={3}
                    py={1.5}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="medium"
                    color="textMuted"
                    _hover={{ bg: 'bg.muted', textDecoration: 'none' }}
                    _currentPage={{ bg: 'bg.muted', color: 'fg' }}
                  >
                    <NavLink to={to} end={to === '/'}>
                      {label}
                    </NavLink>
                  </Link>
                ))}
              </HStack>
            </HStack>

            <Text display={{ base: 'none', lg: 'block' }} fontSize="sm" color="textMuted">
              Web performance analyzer
            </Text>
          </Flex>
        </Container>
      </Box>

      <Box as="main">
        <Container maxW="1400px" py={{ base: 6, md: 10 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
