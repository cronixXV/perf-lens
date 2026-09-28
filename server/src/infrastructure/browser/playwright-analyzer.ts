import { chromium } from 'playwright';

import type { IAnalysis, IResource } from '@shared/contracts/analysis';
import { getResourceType } from '@domain/analysis/get-resource-type';

export class PlaywrightAnalyzer {
  async analyze(url: string): Promise<IAnalysis> {
    const browser = await chromium.launch({
      headless: true
    });

    const page = await browser.newPage();
    const startedAt = Date.now();

    await page.addInitScript(() => {
      const vitals = {
        lcp: null as {
          value: number;
          element: string | null;
          resourceUrl: string | null;
        } | null,

        cls: 0,

        inp: null as number | null
      };

      let clsValue = 0;
      let inpValue = 0;

      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        const lastEntry = entries[entries.length - 1] as PerformanceEntry | undefined;

        if (!lastEntry) {
          return;
        }

        const lcpEntry = lastEntry as PerformanceEntry & {
          startTime: number;
          element?: Element;
          url?: string;
        };

        vitals.lcp = {
          value: lcpEntry.startTime,
          element: lcpEntry.element?.tagName.toLowerCase() ?? null,
          resourceUrl: lcpEntry.url ?? null
        };
      });

      lcpObserver.observe({
        type: 'largest-contentful-paint',
        buffered: true
      });

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            value?: number;
            hadRecentInput?: boolean;
          };

          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value ?? 0;
          }
        }

        vitals.cls = clsValue;
      });

      clsObserver.observe({
        type: 'layout-shift',
        buffered: true
      });

      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const eventEntry = entry as PerformanceEntry & {
            interactionId?: number;
          };

          if (eventEntry.interactionId) {
            inpValue = Math.max(inpValue, eventEntry.duration);
            vitals.inp = inpValue;
          }
        }
      });

      try {
        inpObserver.observe({
          type: 'event',
          buffered: true
        });
      } catch {
        // INP is not supported in this browser context.
      }

      Object.assign(window, {
        __perfLensVitals: vitals
      });
    });

    try {
      await page.goto(url, {
        waitUntil: 'load',
        timeout: 30_000
      });

      await page.waitForTimeout(1000);

      const analysisDuration = Date.now() - startedAt;

      const result = await page.evaluate(() => {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as
          PerformanceNavigationTiming | undefined;

        const paintEntries = performance.getEntriesByType('paint');

        const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');

        const vitals = (
          window as Window & {
            __perfLensVitals?: {
              lcp: {
                value: number;
                element: string | null;
                resourceUrl: string | null;
              } | null;

              cls: number;

              inp: number | null;
            };
          }
        ).__perfLensVitals;

        return {
          webVitals: {
            lcp: vitals?.lcp ?? null,
            inp: vitals?.inp ?? null,
            cls: vitals?.cls ?? 0,
            fcp: fcpEntry?.startTime ?? null,
            ttfb: navigationEntry
              ? navigationEntry.responseStart - navigationEntry.requestStart
              : null
          },

          resources: performance.getEntriesByType('resource').map((entry) => {
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
          }),

          navigation: navigationEntry
            ? {
                url: navigationEntry.name,
                initiatorType: 'document',
                size: navigationEntry.encodedBodySize,
                duration: navigationEntry.duration,
                startTime: navigationEntry.startTime,
                responseEnd: navigationEntry.responseEnd,
                transferSize: navigationEntry.transferSize
              }
            : null
        };
      });

      const rawResources = result.navigation
        ? [result.navigation, ...result.resources]
        : result.resources;

      const normalizedResources: IResource[] = rawResources.flatMap((resource) => {
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
        analysisDuration,
        resources: normalizedResources,
        webVitals: result.webVitals
      };
    } finally {
      await browser.close();
    }
  }
}
