import { chromium } from 'playwright';

import type { IAnalysis, IResource } from '@domain/analysis/analysis';
import { getResourceType } from '@domain/analysis/get-resource-type';

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

      const resources = await page.evaluate(() => {
        const resourceEntries = performance.getEntriesByType('resource').map((entry) => {
          const resource = entry as PerformanceResourceTiming;

          return {
            url: resource.name,
            initiatorType: resource.initiatorType,
            size: resource.encodedBodySize,
            duration: resource.duration,
            startTime: resource.startTime,
            responseEnd: resource.responseEnd,
            transferSize: resource.transferSize
          };
        });

        const navigationEntry = performance.getEntriesByType('navigation')[0];

        if (!navigationEntry) {
          return resourceEntries;
        }

        const navigation = navigationEntry as PerformanceNavigationTiming;

        return [
          {
            url: navigation.name,
            initiatorType: 'document',
            size: navigation.encodedBodySize,
            duration: navigation.duration,
            startTime: navigation.startTime,
            responseEnd: navigation.responseEnd,
            transferSize: navigation.transferSize
          },
          ...resourceEntries
        ];
      });

      const normalizedResources: IResource[] = resources.flatMap((resource) => {
        const type = getResourceType(resource.url, resource.initiatorType);

        if (!type) {
          return [];
        }

        return [
          {
            url: resource.url,
            type,
            size: resource.size,
            duration: resource.duration,
            startTime: resource.startTime,
            responseEnd: resource.responseEnd,
            transferSize: resource.transferSize
          }
        ];
      });

      return {
        url,
        duration,
        resources: normalizedResources,
        webVitals: {}
      };
    } finally {
      await browser.close();
    }
  }
}
