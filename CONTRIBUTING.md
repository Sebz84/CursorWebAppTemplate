## Contributing Guide (Golden Template)

This project is optimized for a solo developer working alongside AI agents. Follow this guide to set up the environment, run the stack, add features, and keep documentation accurate. All contributions must adhere to the docs-as-code policy.

### Prerequisites
- Node.js 20+, pnpm, Git.
- Optional: Expo Go on device/emulator, Android Studio/Xcode for simulators.
- Accounts/keys: Vercel (optional), Supabase/Neon, Clerk, Stripe, Xendit/XenPlatform, Sentry, PostHog, Resend.

### Setup
1. Install dependencies
   ```
   pnpm install
   ```
2. Copy `.env.example` to `.env` and populate values.
3. Generate Prisma client
   ```
   pnpm db:generate
   ```
4. Run migrations & seed (optional)
   ```
   pnpm db:migrate
   pnpm db:seed
   ```
5. Start development
   ```
   pnpm dev:all
   ```

#### Optional: Dev Container
- Open the repo in a Dev Container (`.devcontainer/devcontainer.json`).
- Provides Node 20 toolchain + recommended extensions without polluting the host machine.

#### Optional: Docker Compose UI previews
```
docker compose up web storybook mobile-web
```
- Web app: http://localhost:3000
- Storybook: http://localhost:6006
- Mobile web (parked service awaiting Expo client): http://localhost:19006

### Workspace Layout (high level)
- `apps/web` — Next.js PWA (App Router + Tailwind/shadcn UI).
- `apps/backend` — Node server (Hono/Fastify) exposing tRPC, webhooks, jobs.
- `packages/api` — tRPC routers + Zod schemas.
- `packages/db` — Prisma schema, migrations, seed.
- `packages/ui` — Interface re-exports (delegates to `ui-web` today, `ui-mobile` later).
- `packages/ui-web` — Tailwind + shadcn components and stories.
- `packages/ui-mobile` — Tamagui components preserved for future Expo client.
- `packages/auth` — Clerk wrappers, guards, signup config.
- `packages/billing` — Stripe/Xendit/XenPlatform adapters & plan config.
- `packages/communications` — Resend emails, push helpers.
- `packages/config` — Zod env validation, feature flags.
- `packages/hooks`, `packages/types`, `packages/observability`, `packages/testing-utils` — shared logic.

### Scripts (project “OS”)
```
pnpm dev:web            # Next.js PWA dev server
pnpm dev:backend        # API server
pnpm dev:all            # Run both via turbo

pnpm db:generate         # Prisma generate
pnpm db:migrate          # Prisma migrate deploy/reset
pnpm db:seed             # Seed data

pnpm typecheck           # TypeScript across repo
pnpm lint                # ESLint
pnpm format              # Prettier
pnpm build               # Build all targets

pnpm test:unit           # Vitest
pnpm test:e2e:web        # Playwright
pnpm test:e2e:mobile     # Parked Maestro suite (Expo client TBD)
pnpm test:changed        # turbo-filtered changed targets

pnpm storybook           # UI library playground (packages/ui-web)
pnpm preview             # Preview web build

pnpm billing:listen:stripe  # Stripe CLI webhook forwarder
pnpm billing:listen:xendit  # ngrok forwarder for Xendit

pnpm docs:gen            # typedoc + prisma ERD + route maps
pnpm docs:check          # fail if docs out of date
```

### Docs-as-Code Policy (mandatory)
- Any change touching critical areas must update docs in the same PR:
  - `prisma/schema.prisma`
  - `packages/api/src/router/**`
  - `apps/**/app/**`
  - `packages/config/**`
  - `packages/ui/**`
  - `packages/auth/**`
  - `packages/billing/**`
- Required documentation updates:
  - `ARCHITECTURE.md`
  - `DECISIONS.md` (add/update ADRs when decisions change)
  - `docs/**` (API summaries, feature guides, testing notes)
- Enforced via `tooling/check-doc-updates.js` (pre-commit/CI) and docs auto-check workflow.

### Feature Workflow Checklist
1. **Design data model**
   - Update `prisma/schema.prisma`; run `pnpm db:migrate`.
   - Update seeds if necessary.
2. **Expose API**
   - Add/modify tRPC procedures with Zod validation in `packages/api`.
   - Apply auth/plan guards via `packages/auth` helpers.
3. **Implement UI**
   - Add/modify screens in `apps/web/app/**`.
   - Use components from `@template/ui` (implemented in `packages/ui-web`); every exported component/screen must include an accompanying Storybook story.
   - Update the global “Design System” story/docs page showcasing tokens, typography, and layout primitives when design changes.
4. **Enforce permissions**
   - Update plan/feature config in `packages/billing/plans.ts` as needed.
   - Ensure backend/client gating aligns with plan limits.
5. **Write tests**
   - Vitest unit/integration for new logic.
   - Playwright E2E (web). Maestro suite is parked until the Expo client returns.
6. **Observability**
   - Add logs (pino) and Sentry breadcrumbs for critical paths.
7. **Documentation**
   - Update `ARCHITECTURE.md`, `DECISIONS.md`, `docs/**` accordingly.
8. **Run the project OS**
   - `pnpm typecheck && pnpm lint && pnpm test:unit`
   - `pnpm test:e2e:web`
   - `pnpm docs:gen && pnpm docs:check`

### Authentication & Authorization
- Use helpers from `packages/auth`: `getCurrentUser`, `requireRole`, `requirePlan`, `withUser`.
- Protect Next.js routes with Clerk middleware (`apps/web/middleware.ts`) and guard tRPC procedures.

### Billing & Plans
- Central plan definitions: `packages/billing/plans.ts`.
- Provider abstraction handles Stripe, Xendit, XenPlatform.
- Webhooks located under `packages/billing/webhooks/**`; ensure they update subscriptions/plan state.

### Communications
- Emails (Resend) in `packages/communications/emails/*` with React templates.
- Push notification helpers store subscriptions and send targeted messages via backend.

### Observability
- Initialize Sentry via `packages/observability/sentry.ts`.
- Use `packages/observability/logger.ts` (pino) with request IDs.
- Track key product analytics via `packages/observability/posthog.ts`.

### PR Requirements
- All checks must pass (typecheck, lint, unit tests, E2E, docs gate, build as applicable).
- Attach screenshots/screencasts when UI changes.
- Provide testing notes (sandbox payments, auth flows) in PR body.

### Coding Standards
- Prefer descriptive names; avoid abbreviations without context.
- Early returns over deeply nested conditionals.
- Comments for rationale, invariants, edge cases.
- Keep shared code in packages to maximize reuse.
- Treat Storybook as authoritative documentation: keep stories in sync with runtime behavior and ensure visual regressions are captured.

### ADRs
- Consult `DECISIONS.md` for existing decisions.
- When altering a decision, add a new ADR section or update relevant entry.


