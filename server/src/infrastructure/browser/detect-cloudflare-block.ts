import type { Page } from 'playwright';

export const detectCloudflareBlock = async (page: Page): Promise<boolean> => {
  return page.evaluate(() => {
    const title = document.title.toLowerCase();
    const bodyText = document.body?.innerText.toLowerCase() ?? '';

    const challengeSelectors = [
      '#challenge-form',
      '#cf-challenge-running',
      '.cf-browser-verification',
      '#cf-challenge-stage',
      'input[name="cf-turnstile-response"]',
      'iframe[src*="challenges.cloudflare.com"]'
    ];

    const hasChallengeElement = challengeSelectors.some((selector) =>
      document.querySelector(selector)
    );

    if (hasChallengeElement) {
      return true;
    }

    const challengePhrases = [
      'checking your browser',
      'verify you are human',
      'performing security verification',
      'enable javascript and cookies to continue'
    ];

    const hasChallengePhrase = challengePhrases.some((phrase) => bodyText.includes(phrase));

    const hasChallengeTitle =
      title.includes('just a moment') || title.includes('attention required');

    return hasChallengePhrase && hasChallengeTitle;
  });
};
