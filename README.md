# Cursor Web & Mobile SaaS Golden Template

An AI-first, solopreneur-friendly template for building production-ready SaaS products across web (PWA) and native mobile from a single codebase. The stack is optimized for Cursor/AI agents: strict typing, declarative sources of truth, fast developer feedback, and minimal DevOps overhead.

## Highlights

- **PWA-first**: Next.js 14 App Router ships installable PWAs quickly; shared UI layer keeps the door open for Expo/native later.
- **Type-safe contracts**: tRPC + Prisma + Zod provide end-to-end type safety between frontend and backend.
- **Managed services by default**: Clerk, Stripe/Xendit/XenPlatform, Supabase/Neon, Resend, Sentry, PostHog.
- **Docs-as-code**: Architecture, ADRs, and docs stay in sync via enforced CI gates.
- **AI-ready**: Clear module boundaries, reference feature pattern, deterministic scripts, and infrastructure automation.

## Repository Layout

```
apps/
  web/                Next.js 14 App Router PWA (Tailwind + shadcn/ui)
  backend/            Hono/Fastify server exposing tRPC, webhooks, jobs

packages/
  api/                tRPC routers + Zod schemas
  auth/               Clerk helpers, RBAC, plan guards, signup config
  billing/            Stripe + Xendit/XenPlatform adapters, plan catalog
  communications/     Resend email templates, push helpers
  config/             Environment schemas, feature flags
  db/                 Prisma schema, migrations, seed data
  hooks/              Shared hooks (React Query + tRPC client helpers)
  observability/      Sentry, pino logger, PostHog helpers
  testing-utils/      Mocks, factories, test environment helpers
  types/              Shared TypeScript types & DTOs
  ui/                 Interface exports (re-exporting active implementation)
  ui-web/             Tailwind + Radix/shadcn components + Storybook stories
  ui-mobile/          Tamagui components preserved for future Expo client

tests/                Unit, integration, Playwright web E2E (mobile suite parked)
docs/                 Extended documentation site/content
tooling/              Automation scripts (docs gate, generators, etc.)
.github/workflows/    CI/CD pipelines (docs gate, docs auto, etc.)
.devcontainer/        Reproducible dev environment definition
```

Full directory tree and responsibilities are documented in [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Tooling | TypeScript (strict), Turborepo, pnpm, TypeScript project references |
| Frontend | Next.js 14 (App Router) PWA |
| UI System | Tailwind CSS + Radix UI/shadcn (Storybook coverage) |
| Backend | Node.js 20, Hono/Fastify, tRPC |
| Data | Prisma ORM, PostgreSQL (Supabase/Neon) |
| Authentication | Clerk |
| Billing | Stripe, Xendit, XenPlatform adapters |
| Communications | Resend (emails), push subscription store |
| Observability | Sentry, pino → Logtail/Better Stack, PostHog |
| Testing | Vitest, Playwright (Maestro suite parked) |
| Docs & DX | Docs-as-code, Dev Container, Docker Compose previews |

See [`DECISIONS.md`](DECISIONS.md) for ADRs explaining each choice.

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment**
   - Create a `.env` file in the repo root and populate the required keys. Environment variables are validated via `packages/config` at runtime.
   - Minimal local development template:

     ```bash
     NODE_ENV=development
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
     CLERK_SECRET_KEY=sk_test_your_key
     NEXT_PUBLIC_API_URL=http://localhost:3001/trpc
     DATABASE_URL=postgresql://user:password@localhost:5432/app
     PAYMENT_PROVIDER=stripe
     STRIPE_SECRET_KEY=sk_test_stripe
     STRIPE_WEBHOOK_SECRET=whsec_test
     XENDIT_SECRET_KEY=xe_test
     XENDIT_WEBHOOK_TOKEN=xe_wh_test
     RESEND_API_KEY=re_test
     SENTRY_DSN=
     POSTHOG_API_KEY=
     ```

3. **Generate Prisma client & migrate**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed   # optional demo data
   ```

4. **Run everything**
   ```bash
   pnpm dev:all
   ```

### Optional Development Flows

- **Dev Container**: Open the repo using `.devcontainer/devcontainer.json` for a reproducible Node 20 environment.
- **Docker Compose previews**:
  ```bash
  docker compose up web storybook mobile-web
  ```
  - Next.js PWA: [http://localhost:3000](http://localhost:3000)
  - Storybook: [http://localhost:6006](http://localhost:6006)
  - Mobile preview service is parked (kept for future Expo reactivation): [http://localhost:19006](http://localhost:19006)

### Progressive Web App & Push Notifications

The web client follows the [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps) and ships with service workers, a manifest, and push notifications pre-wired:

1. **Generate VAPID keys** for Web Push once per environment:
   ```bash
   npm install -g web-push
   web-push generate-vapid-keys
   ```
   Copy the output into your `.env` file (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_CONTACT_EMAIL`).

2. **Run the web app over HTTPS** in development when testing push notifications:
   ```bash
   pnpm --filter web dev -- --experimental-https
   ```

3. **Enable notifications from the dashboard**: open the “Progressive Web App” card, subscribe, and send a test push. iOS devices get inline instructions for adding the app to the home screen.

Service worker logic lives in `apps/web/public/sw.js`, push server actions in `apps/web/app/actions.ts`, and security headers in `apps/web/next.config.js`.

## Scripts (Project “OS”)

```
pnpm dev:web             # Next.js PWA dev server
pnpm dev:backend         # tRPC backend server
pnpm dev:all             # Both via Turborepo

pnpm db:generate         # Prisma generate
pnpm db:migrate          # Prisma migrate deploy/reset
pnpm db:seed             # Seed data

pnpm typecheck           # Repo-wide TypeScript check
pnpm lint                # ESLint
pnpm format              # Prettier
pnpm build               # Build all packages/apps

pnpm test:unit           # Vitest
pnpm test:e2e:web        # Playwright E2E suite
pnpm test:e2e:mobile     # Parked (placeholder until Expo client returns)
pnpm test:changed        # Targeted tests via turbo filters

pnpm storybook           # Component library preview
pnpm preview             # Next.js production preview

pnpm billing:listen:stripe  # Stripe CLI webhook forward
pnpm billing:listen:xendit  # Xendit webhook forward via ngrok

pnpm docs:gen            # typedoc + Prisma ERD + route maps
pnpm docs:check          # Fail if docs are out of date
```

### Baseline Feature Slice

- **Authentication** (`@template/auth`, `apps/backend`, `apps/web/app/(auth)/*`)
  - Clerk session validation lives in `packages/auth/src/server.ts` and powers tRPC context via `packages/api`.
  - Next.js sign-in/sign-up routes embed Clerk components and redirect into the protected dashboard.
- **Protected dashboard** (`apps/web/app/(dashboard)/dashboard/page.tsx`)
  - Uses the shared `AppLayout` from `@template/ui` (implemented in `packages/ui-web`) and the `useCurrentUser` hook from `@template/hooks`.
  - Fetches `trpc.dashboard.analytics`—a protected procedure that enforces plan features server-side.
- **Plan & feature gating** (`@template/billing` + `@template/ui/Feature`)
  - `packages/billing/src/plans.ts` defines Free/Pro plans, feature keys, and limits.
  - `Feature` component renders upgrade messaging when the current session lacks the required capability.
- **Reference docs & stories**
  - `packages/ui-web/stories/AppLayout.stories.tsx` documents the base layout.
  - `docs/features/auth.md` and `docs/features/gating.md` describe the flows without inspecting code.

## Docs-as-Code Policy

- Changes touching critical areas (`prisma/schema.prisma`, tRPC routers, routes, config, UI, auth, billing) **must** update documentation in the same PR.
- Required updates:
  - [`ARCHITECTURE.md`](ARCHITECTURE.md)
  - [`DECISIONS.md`](DECISIONS.md) (new ADRs / updates)
  - `docs/**` (API summaries, feature guides, test docs)
- Enforced via `tooling/check-doc-updates.js` (pre-commit/CI) and GitHub workflows (`docs-gate`, `docs-auto`).

## Storybook Coverage

- Every exported UI component or screen must include a matching Storybook story (`packages/ui-web/stories/*`).
- Maintain a global “Design System” story documenting tokens, typography, layout primitives, and component inventory.
- Treat Storybook as an authoritative source for visual documentation and regression checks.

## Testing Strategy

- **Unit/Integration**: Vitest (Node + DOM presets) with helpers from `packages/testing-utils`.
- **Web E2E**: Playwright flows covering auth, billing, and core features.
- **Mobile E2E**: Maestro scripts are parked (`tests/e2e-mobile`) until the Expo client returns.
- **Webhooks & billing**: Fixtures in `packages/testing-utils` and integration tests in `apps/backend/tests`.

## Deployment Notes

- **Frontend (Next.js PWA)**: Deploy to Vercel (recommended) or any Node host that supports Next.js (`next build && next start`).
- **Backend**: Deploy to Vercel functions, Fly.io, Render, or Railway. Ensure secrets mirror `.env.example`.
- **Database**: Supabase or Neon. Run Prisma migrations (`pnpm db:migrate`) on deploy.
- **Secrets**: Manage via platform secret stores (never commit `.env`).
- **Monitoring**: Sentry (errors), Logtail/Better Stack (logs), PostHog (product analytics/feature flags).

## Contributing Workflow

1. Create a branch; run `pnpm install` if needed.
2. Implement feature following the checklist in [`CONTRIBUTING.md`](CONTRIBUTING.md): data model → API → UI → tests → observability → docs.
3. Run the project OS scripts (`typecheck`, `lint`, `test:*`, `docs:gen`, `docs:check`).
4. Commit and push; open a PR. CI enforces docs-as-code and test suites.

## Further Reading

- [`ARCHITECTURE.md`](ARCHITECTURE.md): Full system map, directory tree, baseline features, tech stack rationale.
- [`DECISIONS.md`](DECISIONS.md): Architectural Decision Records (ADRs).
- [`docs/`](docs/): Deep dives, guides, generated API docs (after `pnpm docs:gen`).
- [`docs/architecture/cross-platform.md`](docs/architecture/cross-platform.md): How to reintroduce the Expo/mobile client when needed.

## License

Specify your license here (MIT recommended for templates). Update this section once chosen.


