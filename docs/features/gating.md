# Plan & Feature Gating

## Overview

Feature access is centrally defined in `@template/billing`. Plans describe the capabilities and limits granted to each subscriber. Both backend procedures and frontend components consume the same helpers to keep enforcement consistent.

## Plan Catalog

- `packages/billing/src/plans.ts` contains the Free and Pro plan definitions used across the stack.
- Each plan specifies feature keys (e.g. `feature:advanced-analytics`) and optional numeric limits (`limit:max-projects`).
- `getPlanById` resolves plan metadata for a user session.

## Enforcement Helpers

- `hasFeature(user, key)` — checks the current plan and user-specific overrides.
- `requireFeature(session, key)` — throws a `TRPCError` when a protected backend procedure is accessed without the capability.
- `Feature` component (`packages/ui-web/src/components/Feature.tsx`, re-exported via `@template/ui`) renders upgrade messaging client-side when a capability is missing.

## Reference Implementation

- `packages/api/src/router/dashboard.ts` exposes `analytics`, a protected tRPC query that calls `requireFeature` before returning analytics payloads.
- `apps/web/app/(dashboard)/dashboard/page.tsx` calls `trpc.dashboard.analytics` and wraps the UI in the `Feature` component.
- Plans are surfaced on the landing pricing page via `apps/web/app/(public)/pricing/page.tsx`.

## Extending the Slice

- Add new plan tiers by extending `plans` and updating documentation. Regenerate docs with `pnpm docs:gen`.
- For per-user overrides (e.g. trial upgrades), store feature toggles in Clerk public metadata or the application database and merge them into the `features` map.
- Use `enforceLimit(session, limitKey, usage)` to guard write APIs that must respect allocation ceilings.

