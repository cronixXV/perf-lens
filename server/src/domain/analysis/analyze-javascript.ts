import type { IJavaScriptSummary, IResource } from '@shared/contracts/analysis';

const LARGEST_SCRIPTS_LIMIT = 5;

export const analyzeJavaScript = (resources: IResource[]): IJavaScriptSummary => {
  const scripts = resources
    .filter((resource) => resource.type === 'script')
    .sort((a, b) => b.size - a.size);

  return {
    totalSize: scripts.reduce((total, script) => total + script.size, 0),
    count: scripts.length,
    largestScripts: scripts.slice(0, LARGEST_SCRIPTS_LIMIT)
  };
};
