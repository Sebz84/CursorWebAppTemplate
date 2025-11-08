# API Overview

The API is powered by tRPC and lives in the shared `@template/api` package. Procedures are hosted by the Hono backend (`apps/backend`).

## Context

- `packages/api/src/context.ts` builds request context with the active Clerk session (if present).
- Authentication metadata is shared with downstream procedures via `protectedProcedure` in `packages/api/src/trpc.ts`.

## Routers

- `health` — `/trpc/health.heartbeat` responds with status and timestamp.
- `user` — `/trpc/user.me` returns the authenticated profile and plan metadata.
- `dashboard` — `/trpc/dashboard.analytics` serves analytics data when the session has `feature:advanced-analytics`.

## Adding Procedures

1. Define inputs/output schemas with Zod.
2. Use `publicProcedure` for unauthenticated endpoints or `protectedProcedure` plus `requireFeature`/`requireRole` for gated operations.
3. Compose routers in `packages/api/src/router` and register them in `appRouter`.
4. Consume the new procedure via `trpc.<namespace>.<procedure>` in the hooks package or directly in apps.

