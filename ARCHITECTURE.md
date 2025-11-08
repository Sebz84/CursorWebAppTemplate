## Golden Template Architecture (AI‑Native, Solopreneur‑Centric)

This document is the canonical map of the system: boundaries, sources of truth, contracts, and workflows. It is optimized for AI agents (Cursor) and a single developer to move fast with confidence.

### Core Principles
- Solopreneur-first: managed services by default; minimize infra/ops.
- AI-first: strict types, clear boundaries, single sources of truth.
- True cross-platform: web (PWA) + native mobile from day one.
- Production-ready: auth, billing, DB, observability, testing included.
- Maintainable and scalable: clean module boundaries; zero rewrites.

### Repository Architecture (Monorepo)
- Turborepo + pnpm workspaces; TypeScript project references.
- Top-level layout overview:
  - `apps/web` (Next.js 14 App Router PWA)
  - `apps/backend` (Fastify/Hono + tRPC server, jobs, webhooks)
  - `packages/ui` (interface exports), `packages/ui-web` (Tailwind + shadcn implementation), `packages/ui-mobile` (Expo/Tamagui placeholder)
  - Other `packages/*` (API, DB, auth, billing, config, hooks, etc.)
  - `tests/*` (unit, integration, Playwright web E2E, parked mobile E2E)
  - `docs/*` (extended documentation site/content)
  - `tooling/*` (automation scripts, generators)
  - Root configs: `turbo.json`, `pnpm-workspace.yaml`, `.env.example`, `.github/workflows/*`, etc.

#### Monorepo Directory Tree

```
.
├── apps/
│   ├── web/                        # Next.js PWA
│   │   ├── app/                    # App Router routes
│   │   │   ├── (public)/           # Landing, pricing
│   │   │   ├── (auth)/             # Clerk-hosted auth routes
│   │   │   └── (dashboard)/dashboard/  # Protected dashboard + account
│   │   ├── providers/              # Client providers (Clerk, tRPC, React Query)
│   │   ├── middleware.ts           # Clerk route protection
│   │   ├── public/                 # PWA manifest, icons, service worker output
│   │   ├── tailwind.config.ts      # Tailwind configuration
│   │   └── package.json
│   │
│   └── backend/                     # API server (Hono/Fastify + tRPC)
│       ├── src/
│       │   ├── index.ts             # Entrypoint/bootstrap
│       │   ├── server.ts            # Server factory, middleware
│       │   ├── env.ts               # Backend env validation
│       │   ├── router/              # tRPC wiring (imports from packages/api)
│       │   ├── procedures/          # Backend-only procedures/jobs
│       │   ├── jobs/                # CRON / queue workers
│       │   ├── webhooks/            # Stripe/Xendit, Clerk handlers
│       │   └── middleware/          # Auth, rate limits, logging
│       ├── tests/                   # Integration tests for backend
│       └── package.json
│
├── packages/
│   ├── api/                         # tRPC routers (shared)
│   ├── db/                          # Prisma schema, migrations, client
│   ├── auth/                        # Identity helpers, RBAC, plan guards
│   ├── billing/                     # Stripe/Xendit/XenPlatform adapters
│   ├── communications/              # Emails (Resend), push notifications
│   ├── config/                      # Env schemas, feature flags, constants
│   ├── types/                       # Shared TS types & DTOs
│   ├── ui/                          # UI interface re-exporting the active implementation
│   ├── ui-web/                      # Tailwind + shadcn components, tokens, Storybook stories
│   ├── ui-mobile/                   # Tamagui components preserved for future Expo client
│   ├── hooks/                       # Cross-app hooks (auth, plan, feature)
│   ├── observability/               # Logging, Sentry, analytics helpers
│   └── testing-utils/               # Testing factories, mocks, fixtures
│
├── tests/
│   ├── unit/                        # Vitest unit tests
│   ├── integration/                 # Shared integration suites
│   ├── e2e-web/                     # Playwright specs
│   └── e2e-mobile/                  # Maestro flows & configs
│
├── docs/                            # Extended documentation
│   ├── architecture/
│   ├── features/
│   ├── api/                         # Generated TypeDoc output
│   └── testing/
│
├── tooling/                         # Scripts & automation
│   ├── check-doc-updates.js
│   ├── prisma-erd.js
│   ├── generate-resource.ts
│   └── lint-staged.config.mjs
│
├── .github/workflows/               # CI/CD pipelines
├── .devcontainer/                   # Dev container definition
├── .vscode/                         # Workspace recommendations
├── scripts/                         # Optional shell scripts (start, seed, deploy)
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── tsconfig.base.json
├── package.json
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── DECISIONS.md
└── .env.example
```

### Canonical Sources of Truth (must stay current)
- Database: `prisma/schema.prisma`
- API: `packages/api/src/router/**` (tRPC + Zod)
- Types: `packages/types/**`
- Design system: `packages/ui-web/src/**` (Tailwind/shadcn components, tokens) and `packages/ui-mobile/src/theme/tamagui.config.ts`
- Routing: `apps/web/app/**`
- Environment & config: `packages/config/env.ts`
- Observability: `packages/observability/**`

### Tech Stack Summary

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Language & Tooling | TypeScript (strict mode), Turborepo, pnpm, TypeScript project references | End-to-end type safety, fast builds with remote caching, single package manager, minimal boilerplate for AI agents. |
| Frontend App | Next.js 14 (App Router) PWA | File-based routing, SSR/SSG, PWA installability, first-class web tooling, fast MVP iterations. |
| UI System | Tailwind CSS + Radix UI/shadcn + Storybook | Accessible component primitives, utility styling, Storybook coverage; shared tokens enable future Expo implementation. |
| Backend App | Node.js 20 + Hono/Fastify + tRPC | Lightweight HTTP server, high-performance routing, type-safe RPC shared with frontend, simple deployment footprint. |
| Data Layer | Prisma ORM + PostgreSQL (Supabase/Neon managed) | Declarative schema (`schema.prisma`), migrations, generated types, managed serverless Postgres for zero-ops. |
| Authentication | Clerk | Managed auth with MFA/social login, prebuilt components, strong TypeScript SDK, reduces security surface. |
| Billing | Stripe + Xendit + XenPlatform adapters | Global + SEA coverage, marketplace payouts, pluggable providers under shared interface. |
| Communications | Resend (emails), Push subscription store via backend | Simple API for transactional emails with React templates, backend retains push tokens for user-specific notifications. |
| Observability | Sentry, pino → Logtail/Better Stack, PostHog | Unified error tracking, structured logging with request IDs, product analytics & feature flags. |
| Testing | Vitest (unit/integration), Playwright (web E2E), Maestro (mobile E2E) | Fast feedback loops, cross-platform coverage, automation-friendly for CI and AI agents. |
| Documentation | Docs-as-code (ARCHITECTURE.md, CONTRIBUTING.md, DECISIONS.md, docs/*) + TypeDoc | Single source of truth for architecture/decisions, generated API docs, enforced via CI gates. |
| Dev Experience | Dev Container, Docker Compose previews, `tooling/*` scripts | Reproducible environment, one-command UI previews, automation for docs gate and resource scaffolding. |

### Contracts and Validation
- All API inputs/outputs defined via Zod; colocated with tRPC procedures.
- Import Prisma-generated types; never duplicate domain types manually.
- Shared branded types in `packages/types` for IDs, currencies, etc.

### Authentication and Authorization
- Auth provider: Clerk (managed, multi-tenant ready).
- `packages/auth` exports: `getCurrentUser()`, `requireRole(role)`, `withUser(handler)`.
- Zod schemas: `User`, `Session`. Role model and helpers; guard middleware for tRPC.

### Payments, Subscriptions, and Marketplace
- Providers:
  - Stripe (primary for subscriptions, Checkout, Billing Portal).
  - Xendit (SEA local rails: cards, eWallets, VA, retail outlets, BNPL).
  - XenPlatform (marketplace/split payouts to sub-accounts via Xendit).
- `packages/billing`:
  - Provider-agnostic interfaces: `BillingProvider`, `MarketplaceProvider`.
  - Adapters: `providers/stripe`, `providers/xendit`, `providers/xenplatform`.
  - Selection by `PAYMENT_PROVIDER` env (per-tenant override supported).
  - Webhooks isolated per provider; normalize to shared domain events.
- Capabilities:
  - Subscriptions (Stripe), one-time, invoices.
  - Local rails (Xendit), marketplace onboarding, KYC, payouts, splits (XenPlatform).
- Environment keys (validated in `packages/config/env.ts`):
  - `PAYMENT_PROVIDER=stripe|xendit` (default `stripe`)
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*`
  - `XENDIT_SECRET_KEY`, `XENDIT_PUBLIC_KEY`, `XENDIT_WEBHOOK_TOKEN`, `XENDIT_PLATFORM_SECRET`

### Environment and Configuration
- Validation:
- All env validation is handled by `packages/config` (`@t3-oss/env-core`).
- `.env.example` includes all keys with comments and sensible defaults (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_API_URL`, etc.).
- Separate environments: local, preview, production; region-aware config.

### Testing Strategy
- Unit/Integration: Vitest (Node + DOM presets).
- E2E Web: Playwright (auth helpers, seeded DB).
- E2E Mobile: Maestro (login, purchase, core flows).
- Scripts for fast feedback: `test:changed` via Turborepo filters.
- Contract tests for provider webhooks (Stripe/Xendit) using fixtures.

### Observability and Analytics
- Errors: Sentry (web + server) with sampling and source maps.
- Logging: `pino` with transport to Logtail/Better Stack; request ID correlation.
- Metrics: lightweight counters/histograms (optional OTLP).
- Product analytics + flags: PostHog (server + client helpers).

### CI/CD and Deployment
- Frontend: Expo EAS Build/Submit (internal + store channels) and Expo Web deployment.
- Backend: Deploy to Vercel serverless functions, Fly.io, Render, or Railway.
- Database: Supabase or Neon (managed Postgres), migrations via Prisma.
- CI (GitHub Actions): `turbo run typecheck lint test build` with remote cache.
- Secrets via platform; never store secrets in repo.

### Docs‑as‑Code (Mandatory Policy)
- Any change to critical areas must include docs updates in the same PR.
- Critical areas: `prisma/schema.prisma`, `packages/api/src/router/**`, `apps/**/app/**`, `packages/config/**`, `packages/ui/**`, `packages/auth/**`, `packages/billing/**`.
- Required updates: `ARCHITECTURE.md`, `DECISIONS.md` (ADRs), `docs/**` (API summaries, features, testing notes).
- Enforcement: pre-commit + CI gates; auto-generated docs (TypeDoc, Prisma ERD, route maps) rebuilt in CI; PRs fail if outputs are stale.

### Developer Workflow (Scripts as the “OS”)
- Common scripts (wired through Turbo):
- `dev:web`, `dev:backend`, `dev:all`
  - `db:generate`, `db:migrate`, `db:seed`
  - `typecheck`, `lint`, `format`, `build`
  - `test:unit`, `test:e2e:web`, `test:e2e:mobile`, `test:changed`
  - `storybook`, `preview`
  - `billing:listen:stripe`, `billing:listen:xendit`
  - `docs:gen`, `docs:check`
- Pre-commit hooks: `eslint --fix`, `prettier`, `typecheck`, docs gate.

### UI Preview and Isolated Execution
- UI previews:
  - Storybook (`packages/ui-web/stories`) documents reusable web components for fast iteration.
  - Next.js dev server (`web` Docker service) previews the PWA (SSR/ISR/RSC) locally.
  - The `mobile-web` Docker service is parked until the Expo client returns; keep the stub for parity.
- Isolation & reproducibility:
  - Dev Container (`.devcontainer/devcontainer.json`) provides a consistent Node toolchain in Docker.
  - Docker Compose (`docker-compose.yml`) spins up preview services without installing Node locally:
    - `web` → http://localhost:3000
    - `storybook` → http://localhost:6006
    - `mobile-web` → http://localhost:19006 (parked)
  - All commands run inside containers; results are reproducible across machines.

### Security Baselines
- Secure headers for web; CSRF where applicable.
- Webhook signature verification; idempotency on payment flows.
- Prisma access patterns; consider RLS (Supabase) where appropriate.
- Secret rotation and platform-managed environment variables.
- Dependency scanning in CI; lockfile integrity.

### Performance Defaults
- Use React Server Components/Server Actions where they simplify data fetching.
- Connection pooling (Neon/Supabase); Prisma Accelerate/pgBouncer if needed.
- Edge caching for public data when using serverless/edge deployments.
- Image optimization via Next.js built-in image component.

### Internationalization and Localization
- Currency localization and formatting per provider/country.
- PWA locale routing handled via Next.js App Router. Shared strings/config reside in `packages/config` and `packages/ui-web` for Tailwind tokens.

### Feature Scaffolding (AI‑Friendly)
- `pnpm gen:resource` (planned) generates:
  - Prisma model + migration
  - tRPC router + Zod schemas + auth middleware
  - Frontend screen (Expo) + shared component
  - Unit/integration tests + Playwright + Maestro flows
  - Storybook story, docs stub

### Reference Feature (Golden Example)
- Included end-to-end slice demonstrating:
  - Model, migration, seed
  - tRPC endpoints + Zod validation + auth
  - Next.js page + shared `@template/ui` component
  - Vitest + Playwright tests (mobile suite parked but documented)
  - Storybook story
  - Docs section and ADR if needed

### Access Control
- Simple role model with `requireRole()` guard; per-procedure middleware.
- Audit fields on sensitive tables; log admin actions.

### Cost and Operational Controls
- Kill switches for expensive features (AI calls, heavy jobs).
- Rate limits on auth and billing endpoints.
- Scheduled clean-ups for test data in preview environments.

### Baseline Features & Behaviors (Prebuilt)

1) Core User & Authentication System

- User Registration
  - Public sign-up lives in `apps/web/app/(auth)/sign-up/[[...signUp]]/page.tsx` leveraging Clerk-hosted components.
  - Signup fields remain configurable via `packages/auth/src/signup-fields.ts` with per-field `enabled`/`required` flags.
  - Email/password is the default method; Clerk handles secure hashing/storage.
- User Login
  - Login flow is rendered at `apps/web/app/(auth)/sign-in/[[...signIn]]/page.tsx`.
  - PWA sessions persist via Clerk cookies/tokens across reloads.
- User Logout
  - Dashboard layout (`apps/web/app/(dashboard)/dashboard/layout.tsx`) shows a Logout action wired to `signOut`.
- Session Management
  - Next.js middleware (`apps/web/middleware.ts`) + backend guards (`packages/auth`) restrict protected pages and APIs.
  - `getCurrentUser()` (server) and `useCurrentUser()` (client) expose the authenticated user.
- Role-Based Access Control (RBAC)
  - `User.role` enum (Prisma) continues to support `USER` and `ADMIN`.
  - `requireRole` guard remains the backend enforcement point for admin-only actions.

2) Subscription & Monetization System

- Subscription Plans
  - Plans remain centralized in `packages/billing/plans.ts` (name, price, granted features/limits).
  - New users default to the `Free` plan on registration.
- Plan Selection & Checkout
  - `/pricing` (`apps/web/app/(public)/pricing/page.tsx`) lists plans and links to hosted checkout (Stripe/Xendit).
  - Provider abstraction in `packages/billing` supports Stripe by default with Xendit/XenPlatform adapters.
  - `SIGNUP_REQUIRE_PLAN` toggles whether users must pick a plan during sign-up.
- Subscription Management
  - `/dashboard/account/billing` (`apps/web/app/(dashboard)/dashboard/account/billing/page.tsx`) surfaces plan status and opens the billing portal.
  - Billing webhooks (Stripe/Xendit) update subscription state, normalized in `packages/billing/webhooks/*`.

3) Feature Flagging & Permissions

- Permission-Gated Features
  - Permissions and limits defined in `packages/billing/plans.ts` and linked to each plan (e.g., `feature:enable-advanced-analytics`, `limit:max-projects:5`).
  - Backend enforcement via `requireFeature('feature-key')` in `packages/api/src/router/dashboard.ts` and limit checks in shared utilities.
  - Frontend gating with the `Feature` component in `packages/ui-web/src/components/Feature.tsx` (surfaced via `@template/ui`) plus React Query hooks from `packages/hooks` to toggle UI for ineligible users.

4) User Interface & Experience (UI/UX)

- Core Layout
  - Dashboard shell lives in `packages/ui-web/src/components/AppLayout.tsx` (exposed via `@template/ui`).
  - Header exposes profile/logout actions; extend with navigation when modules expand.
- Internationalization (i18n)
  - Web is pre-configured with `en` and `de`; translations live under `packages/ui-web` (extend via Tailwind tokens) and `packages/config` for locales.
- Progressive Web App (PWA)
  - Manifest (`apps/web/public/manifest.json`), security headers, and service worker (`apps/web/public/sw.js`) follow the official Next.js PWA guide. Push opt-in is surfaced from the dashboard card.
- Push Notifications
  - Web push subscriptions are captured via server actions (`apps/web/app/actions.ts`). A demo in-memory store keeps the latest subscription and `web-push` sends test payloads; wire to a database for production persistence.
- Storybook Coverage
  - Every exported UI component/screen ships with a colocated Storybook story (`packages/ui-web/stories/*`).
  - Maintain a design system story demonstrating tokens/typography/layout primitives (see `packages/ui-web/stories/AppLayout.stories.tsx`).

5) Production-Readiness & Developer Experience

- End-to-End Error Handling
  - User-facing: standardized toast/inline errors for expected API failures (e.g., invalid credentials, expired subscription).
  - Silent client errors: a global error boundary captures unexpected errors and sends them to a backend logging endpoint.
  - Backend logging: `pino` logs with Sentry for critical paths.
- Transactional Emails (Resend)
  - Resend is the transactional email provider.
  - Welcome and password reset email templates live in `packages/communications/emails/*`.
  - Mailing helpers respect environment configuration and provide a test sandbox.
- Testing
  - Unit/integration via Vitest; Playwright covers web E2E. Maestro scripts are parked (`tests/e2e-mobile`) until the Expo client returns.
- Documentation
  - `README.md` describes architecture, configuration of all features, and run/deploy procedures. Docs-as-code policy is enforced in CI.
  - `/docs/architecture/cross-platform.md` captures the plan for reintroducing the Expo/mobile client.


