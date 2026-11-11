import { PlaywrightAnalyzer } from '@infrastructure/browser/playwright-analyzer';
import { analysisLimits } from '@infrastructure/config/analysis-limits';
import { SqliteAnalysisRepository } from '@infrastructure/persistence/sqlite/sqlite-analysis-repository';

import { AnalysisLimiter } from '@application/analysis/analysis-limiter';
import { CreateAnalysis } from '@application/analysis/create-analysis';
import { GetAnalysisHistory } from '@application/analysis/get-analysis-history';
import { GetAnalysisById } from '@application/analysis/get-analysis-by-id';
import { AnalysisController } from '@presentation/http/controllers/analysis-controller';
import { CompareAnalyses } from '@application/analysis/compare-analyses';

const playwrightAnalyzer = new PlaywrightAnalyzer();
const analysisRepository = new SqliteAnalysisRepository();
const analysisLimiter = new AnalysisLimiter(analysisLimits.maxConcurrentAnalyses);

const createAnalysis = new CreateAnalysis(playwrightAnalyzer, analysisRepository, analysisLimiter);

const getAnalysisHistory = new GetAnalysisHistory(analysisRepository);
const getAnalysisById = new GetAnalysisById(analysisRepository);

export const compareAnalyses = new CompareAnalyses(analysisRepository);

export const analysisController = new AnalysisController(
  createAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  compareAnalyses
);
