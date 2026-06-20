---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

These rules apply when editing files in `src/pages/`.

- Every class must extend `BasePage` from `./base.page`
- All locators must be `readonly Locator` properties declared on the class body
- Constructor must match `constructor(page: Page, config: SiteConfig)` — same signature as BasePage
- Methods represent user actions (click, fill, navigate, hover) — never assertions
- Do not call `expect()` anywhere in a page object file
- Do not use `page.waitForTimeout()` — use `waitForSelector` or rely on Playwright auto-waiting
- Export the class as a named export (not default export)
- File naming: `<kebab-case-name>.page.ts`
- Class naming: `<PascalCase>Page`

Example correct structure:

```typescript
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@types/site-config.types';

export class ExamplePage extends BasePage {
  readonly heroHeading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1');
    this.ctaButton = page.getByRole('link', { name: /get started/i });
  }

  async clickCta(): Promise<void> {
    await this.ctaButton.click();
  }
}
```
