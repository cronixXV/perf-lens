import type { IAnalysis } from '@domain/analysis/analysis';
import type { PlaywrightAnalyzer } from '@infrastructure/browser/playwright-analyzer';

export class CreateAnalysis {
  constructor(private readonly analyzer: PlaywrightAnalyzer) {}

  execute(url: string): Promise<IAnalysis> {
    return this.analyzer.analyze(url);
  }
}
