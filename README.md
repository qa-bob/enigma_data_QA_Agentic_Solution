# Enigma Data — QA Automation Suite

Playwright + TypeScript regression test suite for **[enigmadata.net](https://enigmadata.net/)**.
Uses a **Page Object Model (POM)** architecture with **OOP** class inheritance, and is structured
for both human contributors and AI-agent execution via Claude Code.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Running Tests](#running-tests)
- [Architecture](#architecture)
- [Test Coverage](#test-coverage)
- [Using with Claude Code](#using-with-claude-code)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [CI/CD](#cicd)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/<org>/enigma_data_QA_Agentic_Solution.git
cd enigma_data_QA_Agentic_Solution

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Verify the target site URL
cat site.config.json   # should show https://enigmadata.net

# 5. Run the smoke suite to confirm everything works
npm run test:smoke
```

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18+ | LTS recommended |
| npm | 9+ | Comes with Node.js |
| Git | Any | For source control |
| Claude Code CLI | Latest | Optional — for AI-assisted test generation |

No browser installation is required beyond `npx playwright install`.

---

## Running Tests

```bash
# All tests (headless, all viewports)
npm test

# By category
npm run test:smoke          # @smoke — site availability and basic load
npm run test:navigation     # @navigation — links, menus, routing
npm run test:forms          # @forms — form fields, validation (no submission)
npm run test:visual         # @visual — screenshot regression
npm run test:responsive     # @responsive — mobile/tablet/desktop layout

# Development helpers
npm run test:headed         # Run with a visible browser window
npm run baseline            # Re-capture visual regression snapshots
npm run report              # Open the HTML test report
npm run typecheck           # TypeScript check — run before committing
npm run lint                # ESLint
```

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `SITE_URL` | Override the target URL without editing site.config.json | From site.config.json |
| `CI` | Set by GitHub Actions — enables stricter mode (forbidOnly, retries=1, workers=2) | unset |

---

## Architecture

### Page Object Model (POM)

Every page or major section of the site has its own TypeScript class in `src/pages/`.
Tests never call `page.locator()` directly — they always go through a page object.

```
BasePage                        ← abstract base: navigate(), waitForLoad(), etc.
  ├── HomePage                  ← home page interactions
  ├── NavigationPage            ← nav menu, link extraction
  ├── ContactFormPage           ← contact form fields and validation
  └── <DiscoveredPage>Page      ← one class per additional site page
```

### OOP Principles Applied

- **Inheritance:** All page objects inherit shared behavior from `BasePage`
- **Encapsulation:** Locators are `readonly` properties; implementation details are private
- **Single Responsibility:** Each class owns one page or section
- **Separation of Concerns:** Page objects contain actions; spec files contain assertions

### Custom Fixtures

`src/fixtures/site.fixture.ts` extends Playwright's `test` object with pre-constructed
page objects and the loaded `SiteConfig`. Import `{ test, expect }` from the fixture in
every spec file:

```typescript
import { test, expect } from '@fixtures/site.fixture';

test('homepage loads @smoke', async ({ homePage }) => {
  expect(await homePage.getTitle()).toContain('Enigma');
});
```

---

## Test Coverage

| Suite | Tag | What it tests |
|-------|-----|---------------|
| Smoke | `@smoke` | Site reachability, page title, no JS console errors |
| Navigation | `@navigation` | All nav links reachable (no 4xx), menu open/close, active states |
| Forms | `@forms` | Required field validation, placeholder text, accessible labels — no submission |
| Functional | `@functional` | CTAs, accordions, modals, pricing, video embeds, content sections |
| Visual | `@visual` | Full-page screenshot regression for each viewport |
| Responsive | `@responsive` | No horizontal overflow at 390px, 768px, 1280px |

Tests run across three Playwright projects:

| Project | Viewport | Device |
|---------|----------|--------|
| `chromium-desktop` | 1280×720 | Desktop Chrome |
| `mobile-chrome` | 390×844 | Pixel 5 |
| `tablet` | 768×1024 | iPad Mini |

---

## Using with Claude Code

This repository is set up for AI-assisted test generation with [Claude Code](https://claude.ai/code).

### Setup

Install the Claude Code CLI:

```bash
# macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

Then open a session from the project root:

```bash
claude
```

Claude reads `CLAUDE.md` (which imports `AGENTS.md`) at session start — project context,
architecture rules, and contributor guidelines are automatically loaded.

### Available Slash Commands

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Crawl the live site and update `site.config.json` |
| `/generate-full-suite` | Analyze site + generate complete POM and tests |
| `/run-smoke` | Run smoke tests and report results |
| `/update-baseline` | Refresh visual regression screenshots |
| `/generate-report` | Show a structured test results summary |

See `Skills.md` for full documentation of all skills and sub-agents.

### Specialized Sub-Agents

`.claude/agents/` contains two specialized agents Claude delegates to automatically:

- **`site-analyzer`** — crawls the live site and produces a populated `site.config.json`
- **`test-generator`** — reads the config and generates site-specific Playwright tests

---

## Project Structure

```
enigma_data_QA_Agentic_Solution/
├── site.config.json               ← target URL, feature flags, expected nav items
├── playwright.config.ts           ← browser projects, baseURL, reporters
├── global-setup.ts                ← pre-suite reachability check
├── tsconfig.json                  ← strict TypeScript + path aliases
├── package.json                   ← npm scripts and devDependencies
├── CLAUDE.md                      ← Claude Code instructions (imports AGENTS.md)
├── AGENTS.md                      ← shared agent instructions (all AI tools)
├── Skills.md                      ← slash command & sub-agent documentation
│
├── src/
│   ├── pages/
│   │   ├── base.page.ts           ← BasePage base class
│   │   ├── home.page.ts           ← HomePage
│   │   ├── navigation.page.ts     ← NavigationPage
│   │   └── contact.page.ts        ← ContactFormPage
│   ├── fixtures/
│   │   └── site.fixture.ts        ← custom Playwright test fixtures
│   ├── utils/
│   │   ├── link-checker.ts        ← HTTP link status helper
│   │   └── visual-helper.ts       ← screenshot utilities
│   └── types/
│       └── site-config.types.ts   ← SiteConfig interface + loader
│
├── tests/
│   ├── smoke/                     ← @smoke tests
│   ├── navigation/                ← @navigation tests
│   ├── forms/                     ← @forms tests
│   ├── functional/                ← @functional tests
│   ├── visual/                    ← @visual tests
│   ├── responsive/                ← @responsive tests
│   └── custom/                    ← @custom site-specific tests
│
├── .claude/
│   ├── agents/
│   │   ├── site-analyzer.md       ← site-analyzer sub-agent definition
│   │   └── test-generator.md      ← test-generator sub-agent definition
│   ├── commands/
│   │   ├── analyze-site.md        ← /analyze-site skill
│   │   ├── generate-full-suite.md ← /generate-full-suite skill
│   │   ├── run-smoke.md           ← /run-smoke skill
│   │   ├── update-baseline.md     ← /update-baseline skill
│   │   └── generate-report.md     ← /generate-report skill
│   ├── rules/
│   │   ├── page-objects.md        ← rules for src/pages/**/*.ts
│   │   └── tests.md               ← rules for tests/**/*.spec.ts
│   └── settings.json              ← project permissions
│
└── .github/
    ├── CONTRIBUTING.md
    ├── pull_request_template.md
    ├── CODEOWNERS
    └── workflows/
        └── playwright.yml         ← GitHub Actions CI
```

---

## Contributing

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full contributor guide.

**Quick rules:**

- Follow the POM architecture — every new page gets its own class in `src/pages/`
- Never hardcode URLs, submit forms, or create test accounts
- Run `npm run typecheck && npm run lint` before opening a PR
- Tag every test with at least one category tag (`@smoke`, `@navigation`, etc.)
- Keep page object methods action-oriented — no `expect()` calls inside page objects

---

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions.
See `.github/workflows/playwright.yml` for the full configuration.

The pipeline runs:
1. TypeScript compilation check
2. ESLint
3. Full Playwright test suite (headless, Ubuntu)

Test artifacts (HTML report, trace files, screenshots) are uploaded on failure for
debugging.

---

*Part of the Phoenix Startup QA Agentic Solutions project.*
