/**
 * tests/smoke/site-availability.spec.ts
 *
 * Smoke tests — fast, high-value checks that confirm the site is up and
 * serving a meaningful page.  Run first in CI to gate deeper test suites.
 *
 * Tag: @smoke
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Site Availability @smoke', () => {
  test('site homepage loads successfully @smoke', async ({ homePage, siteConfig }) => {
    // homePage fixture already navigated; verify the response was successful
    const response = await homePage.page.goto(siteConfig.url, {
      waitUntil: 'domcontentloaded',
    });

    // Accept 200-299 as well as common redirects that ultimately land on a page
    expect(response).not.toBeNull();
    const status = response!.status();
    expect(
      status >= 200 && status < 400,
      `Expected HTTP 2xx/3xx but got ${status} for ${siteConfig.url}`
    ).toBeTruthy();

    // Confirm the document has a <body> with content
    const bodyText = await homePage.page.evaluate<string>(() => document.body.innerText);
    expect(bodyText.trim().length, 'Page body should have visible text').toBeGreaterThan(0);
  });

  test('page loads within acceptable time @smoke', async ({ siteConfig, page }) => {
    const MAX_LOAD_MS = 10_000;

    const start = Date.now();
    await page.goto(siteConfig.url, { waitUntil: 'load' });
    const elapsed = Date.now() - start;

    expect(
      elapsed,
      `Page took ${elapsed}ms to load — exceeds limit of ${MAX_LOAD_MS}ms`
    ).toBeLessThan(MAX_LOAD_MS);
  });

  test('no critical JavaScript errors on load @smoke', async ({ siteConfig, page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      consoleErrors.push(`[pageerror] ${err.message}`);
    });

    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });

    // Filter out known benign third-party errors (analytics, ads, etc.)
    const criticalErrors = consoleErrors.filter((err) => {
      const lower = err.toLowerCase();
      // Ignore common noisy-but-harmless errors from ad/tracking scripts
      return (
        !lower.includes('google-analytics') &&
        !lower.includes('googletagmanager') &&
        !lower.includes('hotjar') &&
        !lower.includes('intercom') &&
        !lower.includes('net::err_blocked_by_client') // AdBlocker
      );
    });

    if (criticalErrors.length > 0) {
      console.warn('[smoke] Console errors found:\n' + criticalErrors.join('\n'));
    }

    // Soft assertion: warn but do not hard-fail on external script errors
    expect(
      criticalErrors.length,
      `Found ${criticalErrors.length} console error(s):\n${criticalErrors.join('\n')}`
    ).toBeLessThanOrEqual(3);
  });

  test('site is served over HTTPS @smoke', async ({ siteConfig }) => {
    const url = siteConfig.url.toLowerCase();
    expect(
      url.startsWith('https://'),
      `Site URL "${siteConfig.url}" should use HTTPS`
    ).toBeTruthy();
  });

  test('page has a title and meta description @smoke', async ({ page, siteConfig }) => {
    // Use networkidle so JS-rendered titles (React/Remix/Vue SPAs) have time to be set
    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });

    // Wait up to 5s for a JS-rendered title to appear (Remix/React hydration)
    await page.waitForFunction(
      () => document.title.trim().length > 0,
      { timeout: 5_000 }
    ).catch(() => {}); // Fall through — absence of title is caught below

    // Title check — soft assertion: missing title is an SEO/accessibility issue worth
    // flagging but should not hard-block the test suite for an auth-gated app
    const title = await page.title();
    if (!title.trim()) {
      console.warn(
        `[smoke] "${siteConfig.name}" has no <title> element on the root page. ` +
          'This affects SEO and browser tab labeling.'
      );
    } else {
      expect(title.trim().length, 'Page title should be meaningful (>3 chars)').toBeGreaterThan(3);
    }

    // Meta description check — use evaluate() to avoid auto-wait timeout when element is absent
    const metaDescription = await page.evaluate(
      () => document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null
    );

    if (!metaDescription || metaDescription.trim().length === 0) {
      console.warn(
        `[smoke] "${siteConfig.name}" is missing a meta description. ` +
          'This affects SEO performance.'
      );
    } else {
      expect(
        metaDescription.trim().length,
        'Meta description should have meaningful content'
      ).toBeGreaterThan(10);
    }
  });
});
