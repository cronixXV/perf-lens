import { chromium } from 'playwright';
import type { IAnalysis } from '@domain/analysis/analysis';

export class PlaywrightAnalyzer {
  async analyze(url: string): Promise<IAnalysis> {
    const browser = await chromium.launch({
      headless: true
    });

    const page = await browser.newPage();

    const startedAt = Date.now();

    try {
      await page.goto(url, {
        waitUntil: 'load',
        timeout: 30_000
      });

      const duration = Date.now() - startedAt;

      return {
        url,
        duration,
        resources: [],
        webVitals: {}
      };
    } finally {
      await browser.close();
    }
  }
}
