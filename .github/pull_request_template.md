## Summary

<!-- What does this PR change? One or two sentences. -->

## Type of change

- [ ] New test(s)
- [ ] Updated/fixed test(s)
- [ ] New page object(s)
- [ ] Visual baseline update
- [ ] Framework / config change
- [ ] Documentation

## Test coverage added or changed

<!-- List the test files and categories affected. -->

| File | Tags | Description |
|------|------|-------------|
| `tests/.../xxx.spec.ts` | `@smoke` | |

## Pre-merge checklist

- [ ] `npm run typecheck` passes (exit 0)
- [ ] `npm run lint` passes (exit 0)
- [ ] `npm test` passes, or failures are explained below
- [ ] New page objects extend `BasePage` with `readonly Locator` properties
- [ ] Tests import from `@fixtures/site.fixture` — not from `@playwright/test`
- [ ] No form submissions, account creation, or hardcoded URLs in new tests
- [ ] Visual baselines updated if screenshots changed intentionally (`npm run baseline`)
- [ ] `site.config.json` updated if nav items or feature flags changed

## Test results

<!-- Paste output from npm test or a link to the CI run. -->

```
Passed:  X
Failed:  X
Flaky:   X
```

## Notes for reviewer

<!-- Anything else the reviewer should know. -->
