---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.test.ts"
---

# Test File Rules

These rules apply when editing files in `tests/`.

## Imports

Always import from the custom fixture, never from `@playwright/test` directly:

```typescript
// CORRECT
import { test, expect } from '@fixtures/site.fixture';

// WRONG — do not do this
import { test, expect } from '@playwright/test';
```

## Test Structure

- Each spec file has one `test.describe()` block at the top level
- `test.describe` title format: `"<Page or Feature> @<tag>"`
- Each `test()` title must include at least one tag: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Use `test.beforeEach` for shared navigation — avoid duplicating `goto` calls
- Keep tests independent — no shared mutable state between tests

## Assertions

- Use `await expect(locator).toBeVisible()` over `expect(await locator.isVisible()).toBe(true)`
- Use role-based locators (`getByRole`, `getByLabel`) where possible before falling back to CSS
- Assert meaningful outcomes: visible element, correct text, correct URL — not just "no error thrown"

## What Tests Must NOT Do

- Submit any form (`page.click('button[type=submit]')`, `form.submit()`, etc.)
- Create user accounts or enter real credentials
- Hardcode absolute URLs — use `baseURL` via the fixture or `siteConfig.url`
- Use `page.waitForTimeout()` with values > 0

## Visual Tests

Visual tests using `toHaveScreenshot()` must:
- Run in a `test.describe` block tagged `@visual`
- Use a descriptive snapshot name: `await expect(page).toHaveScreenshot('homepage-hero.png')`
- Not be run on mobile viewport unless testing a mobile-specific layout

## Responsive Tests

Responsive tests must verify layout at each of the three viewports:
- Mobile: 390px wide (Pixel 5)
- Tablet: 768px wide (iPad Mini)
- Desktop: 1280px wide

The Playwright config defines separate projects for each — tests will run across all three
automatically. Add viewport-specific assertions only when behavior genuinely differs.
