# Skills & Slash Commands

This repository ships with Claude Code skills (slash commands) in `.claude/commands/`.
All skills are available when working in this repo with Claude Code.

---

## Available Skills

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Navigates to the live site, inspects its structure, and outputs a fully-populated
`site.config.json` with discovered nav items, form presence, industry, and feature flags.

**When to use:** First run on a new site, or after a site redesign to verify the config is
still accurate.

```
/analyze-site
/analyze-site https://enigmadata.net
```

---

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

Analyzes the live site end-to-end, then generates or updates the complete POM class hierarchy
and test suite to cover every discoverable page and feature.

**When to use:** Initial test suite generation, or after a major site update.

```
/generate-full-suite
```

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Runs the `@smoke` test subset and reports results inline.

**When to use:** Quick health check after any change.

```
/run-smoke
```

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Re-captures visual regression snapshots for all `@visual` tests. Use this when intentional
UI changes cause screenshot diffs.

```
/update-baseline
```

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

Parses `test-results/results.json` and displays a structured pass/fail summary with
per-suite breakdown and suggested next steps.

```
/generate-report
```

---

## Sub-Agents

These specialized agents run in their own context window to keep exploration output out of
the main conversation.

### `site-analyzer`

**File:** `.claude/agents/site-analyzer.md`

Crawls a live website and produces a valid, fully-populated `site.config.json`.
Invoked automatically when running `/analyze-site` or when onboarding a new site.

### `test-generator`

**File:** `.claude/agents/test-generator.md`

Reads a populated `site.config.json` and generates site-specific Playwright test files
for unique functionality not covered by the generic suite. Output lands in `tests/custom/`.

---

## Adding New Skills

1. Create `.claude/commands/<skill-name>.md`
2. Write instructions in plain Markdown — Claude follows them when the skill is invoked
3. Register it in this file under the appropriate section
4. Document it in `CLAUDE.md` Slash Commands table

Skills can also live under `.claude/skills/<skill-name>/SKILL.md` (the newer Skills format)
and support additional frontmatter: `description` (for auto-invocation) and
dynamic context injection (`` !`command` `` lines that run a shell command inline).
