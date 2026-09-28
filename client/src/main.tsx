import React from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraUIProvider } from '@/app/providers/chakra-provider';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraUIProvider>
      <App />
    </ChakraUIProvider>
  </React.StrictMode>
);
