import { useState, type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { ChakraUIProvider } from './chakra-provider';
import { createQueryClient } from './query-client';

export const AppProviders = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(createQueryClient);

  return (
    <ChakraUIProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ChakraUIProvider>
  );
};
