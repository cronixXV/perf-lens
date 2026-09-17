import { PlaywrightAnalyzer } from '@infrastructure/browser/playwright-analyzer';
import { CreateAnalysis } from '@application/analysis/create-analysis';
import { AnalysisController } from '@presentation/http/controllers/analysis-controller';

const playwrightAnalyzer = new PlaywrightAnalyzer();

const createAnalysis = new CreateAnalysis(playwrightAnalyzer);

export const analysisController = new AnalysisController(createAnalysis);
