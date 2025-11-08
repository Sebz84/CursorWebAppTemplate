## Decisions and ADRs

This log captures architectural decisions for traceability. Keep entries concise—Decision, Rationale, Consequences. When behavior or technology choices change, update the relevant ADR and reference it in the PR description.

### Index
- ADR-001: Monorepo with Turborepo and pnpm
- ADR-002: Expo (frontend) + Tamagui UI system
- ADR-003: Standalone backend with Hono/Fastify + tRPC
- ADR-004: Prisma + PostgreSQL (Supabase/Neon)
- ADR-005: Clerk for authentication
- ADR-006: Stripe + Xendit + XenPlatform for billing/marketplace
- ADR-007: Resend for transactional email
- ADR-008: Observability stack (Sentry, pino, PostHog)
- ADR-009: Docs-as-code enforcement
- ADR-010: Testing stack (Vitest, Playwright, Maestro)
- ADR-011: Next.js PWA frontend with Tailwind + shadcn/ui

---

### ADR-001: Monorepo with Turborepo and pnpm
**Decision**: Use a single Turborepo-managed monorepo with pnpm workspaces and TypeScript project references.
**Rationale**: Maximizes code sharing, enables remote caching, keeps tooling simple for a solopreneur, and is AI-friendly.
**Consequences**: Requires minimal Turborepo configuration but all packages must expose scripts for the build graph.

### ADR-002: Expo (frontend) + Tamagui UI system
**Decision**: Build the primary client as an Expo app using expo-router, with Tamagui as the shared UI system.
**Rationale**: Single codebase for web + native, cross-platform components, strong developer velocity.
**Consequences**: Web SSR features are deferred; optionally introduce Next.js later if SSR/SEO is required. (Superseded by ADR-011.)

### ADR-003: Standalone backend with Hono/Fastify + tRPC
**Decision**: Provide a dedicated backend app using Hono or Fastify with tRPC adapters.
**Rationale**: Enables type-safe API shared with frontend, handles webhooks, jobs, and provides deployment flexibility independent of the frontend.
**Consequences**: Additional deployment surface; requires environment separation and runtime monitoring.

### ADR-004: Prisma + PostgreSQL (Supabase/Neon)
**Decision**: Use Prisma ORM with managed Postgres (Supabase/Neon).
**Rationale**: Declarative schema, migrations, generated types, zero-ops managed database.
**Consequences**: Dependent on managed service availability; requires connection pooling at scale.

### ADR-005: Clerk for authentication
**Decision**: Integrate Clerk for authentication, sessions, MFA, and social logins.
**Rationale**: Production-ready auth with minimal maintenance, solid TypeScript SDK, prebuilt components.
**Consequences**: Vendor dependency and usage-based pricing; must handle multi-tenant configuration carefully.

### ADR-006: Stripe + Xendit + XenPlatform for billing/marketplace
**Decision**: Abstract billing with adapters for Stripe (default), Xendit, and XenPlatform.
**Rationale**: Covers global + SEA payment methods and marketplace payouts via XenPlatform, while keeping provider swap simple.
**Consequences**: Multiple webhook integrations and normalization layer add complexity; thorough testing required.

### ADR-007: Resend for transactional email
**Decision**: Use Resend for transactional emails (welcome, password reset, etc.).
**Rationale**: Simple API, React templating, good DX for solopreneurs.
**Consequences**: Email deliverability tied to Resend infrastructure; monitor quotas and reputation.

### ADR-008: Observability stack (Sentry, pino, PostHog)
**Decision**: Standardize on Sentry for errors, pino for structured logs (forwarded to Logtail/Better Stack), and PostHog for product analytics/feature flags.
**Rationale**: Managed services, fast setup, strong TypeScript integrations.
**Consequences**: Must configure sampling/log forwarding, incurs subscription costs.

### ADR-009: Docs-as-code enforcement
**Decision**: Require documentation updates alongside critical code changes, enforced pre-commit and in CI.
**Rationale**: Keeps sources of truth current for AI agents and future development.
**Consequences**: PRs may be blocked until docs are updated; intended to maintain accuracy.

### ADR-010: Testing stack (Vitest, Playwright, Maestro)
**Decision**: Use Vitest for unit/integration tests, Playwright for web E2E, Maestro for mobile E2E.
**Rationale**: Modern tooling with TypeScript support, good automation story, works well with Expo + tRPC architecture.
**Consequences**: Requires fixture management and environment seeding; integrate into CI pipelines.

### ADR-011: Next.js PWA frontend with Tailwind + shadcn/ui
**Decision**: Replace the Expo frontend with a Next.js 14 App Router PWA styled via Tailwind CSS and shadcn/ui (Radix primitives).
**Rationale**: PWAs ship faster for MVPs, simplify debugging (no simulators), preserve type-safe contracts, and keep Cursor-effective docs. Tailwind + shadcn speeds up UI work and aligns with the existing Tailwind project.
**Consequences**: Native UI lives in `@template/ui-mobile` until Expo returns, mobile E2E tests are parked, and PWA manifest/service worker maintenance becomes part of the workflow.

---

### How to add or update an ADR
1. Append a new section with the next sequential number and title.
2. Follow the format: Decision, Rationale, Consequences.
3. Reference the ADR ID in commit/PR messages and update `ARCHITECTURE.md` if the system map changes.


