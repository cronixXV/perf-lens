// app/router.tsx
import { createBrowserRouter, Navigate } from 'react-router';

import { AnalysisDetailsPage } from '@/pages/analysis-details';
import { AnalyzePage } from '@/pages/analyze';
import { ComparePage } from '@/pages/compare';
import { HistoryPage } from '@/pages/history';
import { AppShell } from '../layouts/app-shell';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <AnalyzePage /> },
      { path: '/analyses/:id', element: <AnalysisDetailsPage /> },
      { path: '/history', element: <HistoryPage /> },
      { path: '/compare', element: <ComparePage /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);
