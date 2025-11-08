# Testing Baseline

## Vitest

- Unit tests live under `tests/unit`. The initial suite (`billing.test.ts`) verifies plan capabilities.
- Run with `pnpm test:unit`. Tests share helpers from `@template/testing-utils` as the suite grows.

## Playwright & Maestro

- Placeholder directories (`tests/e2e-web`, `tests/e2e-mobile`) are ready for future flows. Add specs that cover authentication, plan upgrades, and key dashboard journeys.
- Configure environment bootstrapping in each suite to provision Clerk sessions and seed plan data via Prisma.

## Docs Gate

- `tooling/check-doc-updates.js` enforces that docs are updated when critical areas change. Run `pnpm docs:gen && pnpm docs:check` before opening a PR.

