import type { IAnalysis } from '@shared/contracts/analysis';

const API_URL = import.meta.env.VITE_API_URL;

export const createAnalysis = async (url: string): Promise<IAnalysis> => {
  const response = await fetch(`${API_URL}/analyses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze website');
  }

  return response.json();
};
