import type { TAnalysisInput, IResource } from '@shared/contracts/analysis';
import { analyzePerformanceIssues } from './analyze-performance-issues';

const imageUrl = 'https://example.com/hero.png';
const scriptUrl = 'https://example.com/app.js';
const stylesheetUrl = 'https://example.com/app.css';

const createResource = (url: string, type: IResource['type'], size: number): IResource => ({
  url,
  type,
  size,
  duration: 100,
  startTime: 100,
  responseEnd: 200,
  transferSize: size + 300
});

const createAnalysis = (overrides: Partial<TAnalysisInput> = {}): TAnalysisInput => ({
  url: 'https://example.com',
  analysisDuration: 1000,
  resources: [],
  webVitals: {
    lcp: null,
    inp: null,
    cls: null,
    fcp: null,
    ttfb: null
  },
  longTasks: {
    count: 0,
    totalBlockingTime: 0,
    tasks: []
  },
  javascript: {
    totalSize: 0,
    count: 0,
    largestScripts: []
  },
  dependencyGraph: {
    nodes: [],
    edges: []
  },
  ...overrides
});

let failures = 0;

const check = (name: string, actual: boolean, expected: boolean): void => {
  const passed = actual === expected;

  console.log(`${passed ? 'PASS' : 'FAIL'}: ${name}`);

  if (!passed) {
    failures += 1;
    console.error(`  Ожидалось: ${expected}, получено: ${actual}`);
  }
};

const getIssues = (analysis: TAnalysisInput, blockingStyles = new Set<string>()) =>
  analyzePerformanceIssues(analysis, blockingStyles);

const hasIssue = (
  analysis: TAnalysisInput,
  title: string,
  blockingStyles = new Set<string>()
): boolean => getIssues(analysis, blockingStyles).some((issue) => issue.title === title);

// 1. Границы LCP: порог 2500 ms, строго больше.

for (const [value, expected] of [
  [2499, false],
  [2500, false],
  [2501, true]
] as const) {
  const analysis = createAnalysis({
    webVitals: {
      lcp: {
        value,
        element: 'img',
        resourceUrl: imageUrl
      },
      inp: null,
      cls: null,
      fcp: null,
      ttfb: null
    }
  });

  check(`LCP ${value} ms`, hasIssue(analysis, 'LCP is above 2.5 seconds'), expected);
}

// 2. Границы размера LCP-ресурса: 500 * 1024 байт.
// При точном совпадении с порогом issue уже создаётся.

for (const [size, expected] of [
  [500 * 1024 - 1, false],
  [500 * 1024, true],
  [500 * 1024 + 1, true]
] as const) {
  const analysis = createAnalysis({
    resources: [createResource(imageUrl, 'image', size)],
    webVitals: {
      lcp: {
        value: 1500,
        element: 'img',
        resourceUrl: imageUrl
      },
      inp: null,
      cls: null,
      fcp: null,
      ttfb: null
    }
  });

  check(`Размер LCP-ресурса ${size} байт`, hasIssue(analysis, 'Large LCP resource'), expected);
}

// 3. Границы длительности long task: строго больше 200 ms.

for (const [duration, expected] of [
  [199, false],
  [200, false],
  [201, true]
] as const) {
  const analysis = createAnalysis({
    longTasks: {
      count: 1,
      totalBlockingTime: Math.max(0, duration - 50),
      tasks: [
        {
          startTime: 100,
          duration,
          scriptUrl,
          blockingTime: Math.max(0, duration - 50)
        }
      ]
    }
  });

  check(`Long task ${duration} ms`, hasIssue(analysis, 'Long JavaScript task'), expected);
}

// 4. Границы общего размера JavaScript: порог 1 MiB.
// При точном совпадении с порогом issue создаётся.

for (const [size, expected] of [
  [1024 * 1024 - 1, false],
  [1024 * 1024, true],
  [1024 * 1024 + 1, true]
] as const) {
  const analysis = createAnalysis({
    javascript: {
      totalSize: size,
      count: 1,
      largestScripts: [createResource(scriptUrl, 'script', size)]
    }
  });

  check(
    `JavaScript payload ${size} байт`,
    hasIssue(analysis, 'Large JavaScript payload'),
    expected
  );
}

// 5. Render-blocking CSS: замечание зависит от URL в Set.

const stylesheet = createResource(stylesheetUrl, 'stylesheet', 20 * 1024);

const stylesheetAnalysis = createAnalysis({
  resources: [stylesheet]
});

check(
  'CSS без отметки render-blocking',
  hasIssue(stylesheetAnalysis, 'Render-blocking stylesheet detected'),
  false
);

check(
  'CSS с отметкой render-blocking',
  hasIssue(stylesheetAnalysis, 'Render-blocking stylesheet detected', new Set([stylesheetUrl])),
  true
);

// 6. Повторяющиеся ресурсы в списке не должны автоматически
// создавать одинаковые ID, если движок выдаёт оба замечания.

const duplicateTaskAnalysis = createAnalysis({
  longTasks: {
    count: 2,
    totalBlockingTime: 400,
    tasks: [
      {
        startTime: 100,
        duration: 250,
        scriptUrl,
        blockingTime: 200
      },
      {
        startTime: 100,
        duration: 300,
        scriptUrl,
        blockingTime: 200
      }
    ]
  }
});

const duplicateTaskIssues = getIssues(duplicateTaskAnalysis).filter(
  (issue) => issue.title === 'Long JavaScript task'
);

const taskIds = duplicateTaskIssues.map((issue) => issue.id);

check(
  'ID долгих задач уникальны даже при совпадающих startTime и scriptUrl',
  new Set(taskIds).size === taskIds.length,
  true
);

console.log('\nИтог:', failures === 0 ? 'все проверки пройдены' : `${failures} ошибок`);

if (failures > 0) {
  process.exitCode = 1;
}
