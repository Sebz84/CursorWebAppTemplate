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
  - `apps/frontend` (Expo + expo-router; web + native clients)
  - `apps/backend` (Fastify/Hono + tRPC server, jobs, webhooks)
  - `packages/*` (shared logic: API, DB, UI, auth, billing, etc.)
  - `tests/*` (unit, integration, E2E web, E2E mobile suites)
  - `docs/*` (extended documentation site/content)
  - `tooling/*` (automation scripts, generators)
  - Root configs: `turbo.json`, `pnpm-workspace.yaml`, `.env.example`, `.github/workflows/*`, etc.

#### Monorepo Directory Tree

```
.
├── apps/
│   ├── frontend/                    # Expo app (web + native)
│   │   ├── app/                     # expo-router routes
│   │   │   ├── (public)/            # Landing / marketing pages
│   │   │   ├── (auth)/              # Login, register, reset
│   │   │   └── (dashboard)/         # Authenticated routes & nested layouts
│   │   ├── components/              # App-scoped components
│   │   ├── features/                # Domain feature slices
│   │   ├── hooks/                   # App-specific hooks
│   │   ├── assets/                  # Fonts, images, icons
│   │   ├── app.config.ts            # Expo config (per env)
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
│   ├── ui/                          # Tamagui components, themes, Storybook (every component ships with a story)
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
- Design system: `packages/ui/tamagui.config.ts` (+ tokens)
- Routing: `apps/frontend/app/**`
- Environment & config: `packages/config/env.ts`
- Observability: `packages/observability/**`

### Tech Stack Summary

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Language & Tooling | TypeScript (strict mode), Turborepo, pnpm, TypeScript project references | End-to-end type safety, fast builds with remote caching, single package manager, minimal boilerplate for AI agents. |
| Frontend App | Expo (React Native) + expo-router | Single codebase for web + native, file-based routing, ecosystem aligned with React Native tooling, easy EAS deployment. |
| UI System | Tamagui + Storybook | Cross-platform components compiled for native & web, typed variants, theme tokens, Storybook for isolated UI previews. |
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
  - Frontend: `@t3-oss/env-nextjs` (web-specific) as needed
  - Backend/shared: `@t3-oss/env-core`
- `.env.example` includes all keys with comments and sensible defaults.
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
  - `dev:frontend`, `dev:backend`, `dev:all`
  - `db:generate`, `db:migrate`, `db:seed`
  - `typecheck`, `lint`, `format`, `build`
  - `test:unit`, `test:e2e:web`, `test:e2e:mobile`, `test:changed`
  - `storybook`, `preview`
  - `billing:listen:stripe`, `billing:listen:xendit`
  - `docs:gen`, `docs:check`
- Pre-commit hooks: `eslint --fix`, `prettier`, `typecheck`, docs gate.

### UI Preview and Isolated Execution
- UI previews:
  - Storybook serves all reusable UI components (web + RN via Tamagui) for fast iteration.
  - Expo Web (`mobile-web` Docker service) renders mobile screens in the browser for quick checks.
  - When Next.js is added, the `web` Docker service previews full web pages and server components.
- Isolation & reproducibility:
  - Dev Container (`.devcontainer/devcontainer.json`) provides a consistent Node toolchain in Docker.
  - Docker Compose (`docker-compose.yml`) spins up preview services without installing Node locally:
    - `web` → http://localhost:3000 (future Next.js or Expo web)
    - `storybook` → http://localhost:6006
    - `mobile-web` → http://localhost:19006
  - All commands run inside containers; results are reproducible across machines.

### Security Baselines
- Secure headers for web; CSRF where applicable.
- Webhook signature verification; idempotency on payment flows.
- Prisma access patterns; consider RLS (Supabase) where appropriate.
- Secret rotation and platform-managed environment variables.
- Dependency scanning in CI; lockfile integrity.

### Performance Defaults
- Optimize Expo screens with memoization and Suspense where applicable.
- Connection pooling (Neon/Supabase); Prisma Accelerate/pgBouncer if needed.
- Edge caching for public data when using serverless/edge deployments.
- Image optimization via Expo asset pipeline.

### Internationalization and Localization
- Currency localization and formatting per provider/country.
- i18n library for strings; shared copy where possible in `packages/ui`.

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
  - Expo screen + shared component
  - Vitest + Playwright + Maestro tests
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
  - Dedicated registration page/screen exists in `apps/frontend/app/(auth)/register`.
  - Signup form is configurable via `packages/auth/config/signup-fields.ts` with per-field `enabled`/`required` flags.
  - Email/Password is the default registration method (Clerk-managed); passwords are securely hashed server-side by the provider.
- User Login
  - Dedicated login page/screen exists in `apps/frontend/app/(auth)/login`.
  - Persistent sessions ("Remember Me") are enabled via Clerk session configuration; users remain signed in across restarts.
- User Logout
  - Accessible logout is present in the user menu (web header/mobile account menu) and wired to Clerk sign-out.
- Session Management
  - Protected routes and procedures enforced via `packages/auth/withUser`, `requireRole`, and plan guard `requirePlan`.
  - Current user is accessible on server via `getCurrentUser()` and on client via provided hooks.
- Role-Based Access Control (RBAC)
  - `User.role` enum includes `USER` and `ADMIN` in the Prisma schema.
  - Backend guards restrict role-only actions (e.g., admin dashboard procedures).

2) Subscription & Monetization System

- Subscription Plans
  - Plans defined centrally in `packages/billing/plans.ts` (name, price(s), granted features/limits).
  - Default `Free` plan is assigned on signup.
- Plan Selection & Checkout
  - Pricing page at `apps/frontend/app/(public)/pricing` shows available plans and triggers checkout.
  - Provider abstraction in `packages/billing` (Stripe default; Xendit/XenPlatform supported, pluggable architecture).
  - Config flag `SIGNUP_REQUIRE_PLAN` controls whether plan selection is required at signup.
- Subscription Management
  - Account/Billing page at `apps/frontend/app/(dashboard)/account/billing` (hidden if only Free plan exists) exposes manage/upgrade/downgrade/cancel.
  - Webhooks from the billing provider update subscription status; events normalized under `packages/billing/webhooks/*`.

3) Feature Flagging & Permissions

- Permission-Gated Features
  - Permissions and limits defined in `packages/billing/plans.ts` and linked to each plan (e.g., `feature:enable-advanced-analytics`, `limit:max-projects:5`).
  - Backend enforcement via `requireFeature('feature-key')` and limit checks in tRPC middleware.
  - Frontend gating with a `Feature` component/HOC and helpers to hide/disable UI for ineligible users.

4) User Interface & Experience (UI/UX)

- Core Layout
  - Authenticated layout with configurable navigation (top/bottom) in `packages/ui/layouts/AppLayout`.
  - User account menu includes: profile settings, account/billing, logout.
- Internationalization (i18n)
  - Web and mobile are pre-configured with `en` and `de`.
  - Locale-aware routing via expo-router segments; simple language switcher.
  - Translations live in `packages/ui/i18n/*`; documented add-language workflow.
- Progressive Web App (PWA)
  - Expo Web config includes service worker and manifest for installable PWA.
- Push Notifications
  - Opt-in flow provided; subscriptions stored in DB; backend endpoint supports user-targeted notifications.
- Storybook Coverage
  - Every exported UI component/screen must ship with a colocated Storybook story.
  - Maintain an overarching “Design System” story (or docs page) demonstrating global tokens, typography, and layout primitives.

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
  - Unit/integration via Vitest; E2E via Playwright (web) and Maestro (mobile); fixtures for billing/auth and webhook payloads.
- Documentation
  - `README.md` describes architecture, configuration of all features, and run/deploy procedures. Docs-as-code policy is enforced in CI.


