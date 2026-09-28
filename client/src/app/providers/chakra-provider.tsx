import type { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { system } from '@/app/theme/chakra-theme';

interface IChakraUIProviderProps {
  children: ReactNode;
}

export const ChakraUIProvider = ({ children }: IChakraUIProviderProps) => {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
};
