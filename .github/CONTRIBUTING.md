# Contributing to Enigma Data QA Suite

Thank you for contributing. This guide covers the conventions all contributors — human and
AI agent alike — must follow when working in this repository.

---

## Prerequisites

- Node.js 18+, npm 9+
- `npm install` and `npx playwright install` completed
- TypeScript and ESLint passing before opening a PR:

```bash
npm run typecheck   # must exit 0
npm run lint        # must exit 0
```

---

## Architecture Rules

### Page Object Model

Every page or section of the target site gets its own class in `src/pages/`:

```
BasePage (base.page.ts)
  └── YourNewPage extends BasePage
```

Rules:
- Class filename: `<kebab-case>.page.ts`
- Class name: `<PascalCase>Page`
- All locators are `readonly Locator` properties declared on the class
- Constructor signature: `constructor(page: Page, config: SiteConfig)`
- Methods are user actions — no assertions inside page objects
- Register new page objects in `src/fixtures/site.fixture.ts`

### Tests

- Import `{ test, expect }` from `@fixtures/site.fixture` — never from `@playwright/test`
- Tag every test with at least one: `@smoke`, `@navigation`, `@forms`, `@functional`,
  `@visual`, `@responsive`
- Never hardcode URLs — use `baseURL` from the Playwright config or `siteConfig.url`
- Never submit forms, create accounts, or enter real credentials

### TypeScript

- Strict mode is on — no implicit `any`
- All page object properties must be typed
- Run `npm run typecheck` before every commit

---

## Development Workflow

```bash
# Run the full suite before opening a PR
npm test

# Run only the affected test category
npm run test:smoke
npm run test:navigation
npm run test:forms

# Update visual snapshots if UI changed intentionally
npm run baseline

# Open the HTML report after a test run
npm run report
```

---

## Branch and Commit Conventions

| Type | Branch prefix | Example |
|------|--------------|---------|
| New feature / test | `feat/` | `feat/pricing-page-tests` |
| Bug fix | `fix/` | `fix/nav-link-flaky-assertion` |
| Visual baseline update | `baseline/` | `baseline/homepage-hero` |
| Dependency updates | `chore/` | `chore/bump-playwright-1.45` |

Commit messages follow Conventional Commits:

```
feat(navigation): add hamburger menu toggle tests @navigation
fix(forms): correct selector for email validation error message
chore: bump @playwright/test to 1.45.0
```

---

## Pull Request Checklist

Before requesting review, confirm:

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes (or failures are documented in the PR)
- [ ] New page objects extend `BasePage`
- [ ] New tests use the custom fixture and are tagged correctly
- [ ] Visual baselines updated if screenshots changed intentionally
- [ ] `site.config.json` updated if nav items or feature flags changed

---

## AI Agent Contributors

This repository supports AI-assisted development via Claude Code. Agents read `CLAUDE.md`
(which imports `AGENTS.md`) for project context and architecture rules.

Before running `/generate-full-suite` or writing tests:
1. Confirm `site.config.json` is up-to-date — run `/analyze-site` if unsure
2. Fetch the live site with `WebFetch` to get real selectors before writing code
3. Follow the POM conventions above — agents must apply the same standards as humans

See `Skills.md` in the project root for the full list of available slash commands
and sub-agents.

---

## Do Not

- Submit any form in tests
- Create accounts or enter real credentials
- Hardcode the site URL anywhere in the codebase
- Put `expect()` assertions inside page object methods
- Use `page.waitForTimeout()` in tests
- Use `any` type without a justification comment
- Push directly to `main`
