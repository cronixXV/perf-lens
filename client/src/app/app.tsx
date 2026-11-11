import { RouterProvider } from 'react-router';
import { AppProviders } from './providers/app-providers';
import { router } from './routers/router';

export const App = () => (
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);
