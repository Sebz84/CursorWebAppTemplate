# Authentication Slice

## Overview

The baseline authentication flow wires Clerk into both the Next.js PWA and the Hono backend. The backend verifies sessions via the shared `@template/auth` helpers, while the frontend renders login/register routes under `apps/web/app/(auth)`.

## Key Components

- `packages/auth/src/server.ts` — resolves the active session using Clerk, exposing `getCurrentSession`, `requireSession`, and `requireRole`.
- `packages/api/src/context.ts` — builds tRPC context by extracting the bearer token and loading the authenticated session.
- `apps/backend/src/server.ts` — mounts the tRPC router and exposes `/health`.
- `apps/web/app/(auth)/*` — Next.js sign-in/sign-up routes powered by `@clerk/nextjs`.
- `apps/web/providers/trpc-provider.tsx` (and `packages/hooks`) — React Query + tRPC provider that injects Clerk tokens into backend requests.

## Session Lifecycle

1. The Next.js app signs users in via Clerk (email/password by default). Clerk sets secure cookies for session continuity.
2. `TRPCProvider` (client-side) fetches Clerk tokens via `getToken` and forwards them to the backend, where `getCurrentSession` validates them.
3. Protected procedures (`protectedProcedure`) surface the authenticated user profile to clients. The dashboard consumes `trpc.user.me` for profile data.

## Extending the Slice

- Add additional profile fields by updating `signupFields` and mirroring the metadata mapping in `packages/auth/src/server.ts`.
- Enforce RBAC by wrapping procedures with `requireRole` or by adding dedicated middlewares in `packages/api`.
- Frontend state is provided by the shared hooks package; add new data hooks by exposing additional tRPC procedures.

