import { chromium } from 'playwright';
import type { Browser, BrowserContext, CDPSession } from 'playwright';

import type { IAnalysis, IResource } from '@shared/contracts/analysis';

import { classifyPlaywrightError, TPlaywrightErrorStage } from './classify-playwright-error';
import { detectCloudflareBlock } from './detect-cloudflare-block';

import { browserIsolation } from '@infrastructure/config/browser-isolation';
import { analysisLimits } from '@infrastructure/config/analysis-limits';
import { assertSafeHttpUrl } from '@infrastructure/security/ssrf-protection';
import { getResourceType } from '@domain/analysis/get-resource-type';
import { calculateLongTasks } from '@domain/analysis/calculate-long-tasks';
import { analyzeJavaScript } from '@domain/analysis/analyze-javascript';
import { buildDependencyGraph } from '@domain/analysis/build-dependency-graph';
import { analyzePerformanceIssues } from '@domain/analysis/analyze-performance-issues';
import { AnalysisError } from '@domain/analysis/errors/analysis-error';

export class PlaywrightAnalyzer {
  async analyze(url: string): Promise<IAnalysis> {
    let browser: Browser | null = null;
    let browserContext: BrowserContext | null = null;
    let cdpSession: CDPSession | null = null;
    let stage: TPlaywrightErrorStage = 'launch';
    let ssrfBlock: AnalysisError | null = null;
    let resourceLimitError: AnalysisError | null = null;

    try {
      browser = await chromium.launch({
        headless: true,
        chromiumSandbox: browserIsolation.chromiumSandbox,
        args: [
          '--disable-background-networking',
          '--disable-component-update',
          '--disable-default-apps',
          '--disable-extensions',
          '--disable-sync'
        ]
      });

      stage = 'navigation';

      browserContext = await browser.newContext({
        acceptDownloads: false,
        ignoreHTTPSErrors: false,
        permissions: [],
        serviceWorkers: 'block',
        viewport: {
          width: 1440,
          height: 900
        }
      });

      const page = await browserContext.newPage();

      page.on('popup', (popup) => {
        void popup.close().catch(() => undefined);
      });

      page.on('dialog', (dialog) => {
        void dialog.dismiss().catch(() => undefined);
      });

      const exceedResourceLimit = (message: string) => {
        resourceLimitError ??= new AnalysisError({
          code: 'RESOURCE_LIMIT_EXCEEDED',
          message,
          retryable: false
        });
      };

      await assertSafeHttpUrl(url);

      await browserContext.route('**/*', async (route) => {
        try {
          if (resourceLimitError) {
            await route.abort('blockedbyclient').catch(() => undefined);
            return;
          }

          let redirectCount = 0;
          let redirectSource = route.request().redirectedFrom();

          while (redirectSource) {
            redirectCount += 1;
            redirectSource = redirectSource.redirectedFrom();
          }

          if (redirectCount > analysisLimits.maxRedirects) {
            exceedResourceLimit(
              `Website exceeded the redirect limit of ${analysisLimits.maxRedirects}`
            );
            await route.abort('blockedbyclient').catch(() => undefined);
            return;
          }

          await assertSafeHttpUrl(route.request().url());
          await route.continue();
        } catch (error) {
          if (error instanceof AnalysisError) {
            ssrfBlock ??= error;
            await route.abort('blockedbyclient').catch(() => undefined);
            return;
          }

          // Do not let the browser navigate to a host whose DNS result could
          // not be checked. The navigation will be reported as a normal error.
          await route.abort('blockedbyclient').catch(() => undefined);
        }
      });

      cdpSession = await browserContext.newCDPSession(page);

      await cdpSession.send('Network.enable');

      let transferredBytes = 0;
      let declaredResponseBytes = 0;

      cdpSession.on('Network.responseReceived', (event) => {
        const contentLength = Object.entries(event.response.headers).find(
          ([header]) => header.toLowerCase() === 'content-length'
        )?.[1];
        const bytes = Number(contentLength);

        if (!Number.isSafeInteger(bytes) || bytes < 0) {
          return;
        }

        declaredResponseBytes += bytes;

        if (declaredResponseBytes > analysisLimits.maxPageSizeBytes) {
          exceedResourceLimit(
            `Website exceeded the page-size limit of ${analysisLimits.maxPageSizeBytes} bytes`
          );
          void page.close().catch(() => undefined);
        }
      });

      cdpSession.on('Network.loadingFinished', (event) => {
        transferredBytes += event.encodedDataLength;

        if (transferredBytes > analysisLimits.maxPageSizeBytes) {
          exceedResourceLimit(
            `Website exceeded the page-size limit of ${analysisLimits.maxPageSizeBytes} bytes`
          );
          void page.close().catch(() => undefined);
        }
      });

      const renderBlockingStyles = new Set<string>();

      cdpSession.on('Network.requestWillBeSent', (event) => {
        const behavior = event.renderBlockingBehavior?.toLowerCase();

        if (event.type === 'Stylesheet' && behavior === 'blocking') {
          renderBlockingStyles.add(event.request.url);
        }
      });

      const dependencies: {
        sourceUrl: string;
        targetUrl: string;
      }[] = [];

      cdpSession.on('Network.requestWillBeSent', (event) => {
        const stackFrames = event.initiator.stack?.callFrames ?? [];

        const sourceUrl = stackFrames.find((frame) => frame.url)?.url ?? event.initiator.url;

        if (sourceUrl && sourceUrl !== event.request.url) {
          dependencies.push({
            sourceUrl,
            targetUrl: event.request.url
          });
        }
      });

      const startedAt = Date.now();

      const getRemainingAnalysisTime = () => {
        const remaining = analysisLimits.maxAnalysisDurationMs - (Date.now() - startedAt);

        if (remaining <= 0) {
          throw new AnalysisError({
            code: 'TIMEOUT',
            message: 'Website analysis timed out',
            retryable: true
          });
        }

        return remaining;
      };

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

        const longTasks: {
          startTime: number;
          duration: number;
          scriptUrl: string | null;
        }[] = [];

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

        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const longTaskEntry = entry as PerformanceEntry & {
              startTime: number;
              duration: number;
              attribution?: Array<{
                name?: string;
              }>;
            };

            const attribution = longTaskEntry.attribution?.[0];

            longTasks.push({
              startTime: longTaskEntry.startTime,
              duration: longTaskEntry.duration,
              scriptUrl: attribution?.name ?? null
            });
          }
        });

        longTaskObserver.observe({
          type: 'longtask',
          buffered: true
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
          __perfLensVitals: vitals,
          __perfLensLongTasks: longTasks
        });
      });

      await page.goto(url, {
        waitUntil: 'load',
        timeout: getRemainingAnalysisTime()
      });

      await page.waitForTimeout(Math.min(1000, getRemainingAnalysisTime()));

      if (resourceLimitError) {
        throw resourceLimitError;
      }

      const isCloudflareBlocked = await detectCloudflareBlock(page);

      if (isCloudflareBlocked) {
        throw new AnalysisError({
          code: 'CLOUDFLARE_BLOCKED',
          message: 'Website is protected by Cloudflare challenge',
          retryable: false
        });
      }

      stage = 'analysis';

      page.setDefaultTimeout(getRemainingAnalysisTime());

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

        const longTasks =
          (
            window as Window & {
              __perfLensLongTasks?: {
                startTime: number;
                duration: number;
                scriptUrl: string | null;
              }[];
            }
          ).__perfLensLongTasks ?? [];

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
            : null,

          longTasks
        };
      });

      if (resourceLimitError) {
        throw resourceLimitError;
      }

      const analysisDuration = Date.now() - startedAt;

      if (analysisDuration > analysisLimits.maxAnalysisDurationMs) {
        throw new AnalysisError({
          code: 'TIMEOUT',
          message: 'Website analysis timed out',
          retryable: true
        });
      }

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

      const javascript = analyzeJavaScript(normalizedResources);
      const longTasksResult = calculateLongTasks(result.longTasks);
      const dependencyGraph = buildDependencyGraph(normalizedResources, dependencies);

      const baseAnalysis = {
        url,
        analysisDuration,
        resources: normalizedResources,
        webVitals: result.webVitals,
        longTasks: longTasksResult,
        javascript,
        dependencyGraph
      };

      const issues = analyzePerformanceIssues(baseAnalysis, renderBlockingStyles);

      return {
        ...baseAnalysis,
        issues
      };
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      if (ssrfBlock) {
        throw ssrfBlock;
      }

      if (resourceLimitError) {
        throw resourceLimitError;
      }

      throw classifyPlaywrightError(error, stage);
    } finally {
      if (cdpSession) {
        await cdpSession.detach().catch(() => undefined);
      }

      if (browserContext) {
        await browserContext.close().catch(() => undefined);
      }

      if (browser) {
        await browser.close().catch(() => undefined);
      }
    }
  }
}
