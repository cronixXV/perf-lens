const getPositiveInteger = (name: string, fallback: number): number => {
  const value = Number(process.env[name]);

  return Number.isSafeInteger(value) && value > 0 ? value : fallback;
};

export const analysisLimits = {
  maxAnalysisDurationMs: getPositiveInteger('MAX_ANALYSIS_DURATION_MS', 30_000),
  maxPageSizeBytes: getPositiveInteger('MAX_PAGE_SIZE_BYTES', 15 * 1024 * 1024),
  maxRedirects: getPositiveInteger('MAX_REDIRECTS', 10),
  maxConcurrentAnalyses: getPositiveInteger('MAX_CONCURRENT_ANALYSES', 2)
} as const;
