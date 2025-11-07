# Cursor Web & Mobile SaaS Golden Template

An AI-first, solopreneur-friendly template for building production-ready SaaS products across web (PWA) and native mobile from a single codebase. The stack is optimized for Cursor/AI agents: strict typing, declarative sources of truth, fast developer feedback, and minimal DevOps overhead.

## Highlights

- **Cross-platform**: Expo + Tamagui deliver web and native apps with a shared component library.
- **Type-safe contracts**: tRPC + Prisma + Zod provide end-to-end type safety between frontend and backend.
- **Managed services by default**: Clerk, Stripe/Xendit/XenPlatform, Supabase/Neon, Resend, Sentry, PostHog.
- **Docs-as-code**: Architecture, ADRs, and docs stay in sync via enforced CI gates.
- **AI-ready**: Clear module boundaries, reference feature pattern, deterministic scripts, and infrastructure automation.

## Repository Layout

```
apps/
  frontend/            Expo app (web + native) using expo-router
  backend/             Hono/Fastify server exposing tRPC, webhooks, jobs

packages/
  api/                 tRPC routers + Zod schemas
  auth/                Clerk helpers, RBAC, plan guards, signup config
  billing/             Stripe + Xendit/XenPlatform adapters, plan catalog
  communications/      Resend email templates, push helpers
  config/              Environment schemas, feature flags
  db/                  Prisma schema, migrations, seed data
  hooks/               Shared hooks (auth, plans, features)
  observability/       Sentry, pino logger, PostHog helpers
  testing-utils/       Mocks, factories, test environment helpers
  types/               Shared TypeScript types & DTOs
  ui/                  Tamagui tokens, layouts, components, Storybook stories

tests/                 Unit, integration, E2E web (Playwright), E2E mobile (Maestro)
docs/                  Extended documentation site/content
tooling/               Automation scripts (docs gate, generators, etc.)
.github/workflows/     CI/CD pipelines (docs gate, docs auto, etc.)
.devcontainer/         Reproducible dev environment definition
```

Full directory tree and responsibilities are documented in [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Tooling | TypeScript (strict), Turborepo, pnpm, TypeScript project references |
| Frontend | Expo (React Native) + expo-router |
| UI System | Tamagui, Storybook (every component ships with a story) |
| Backend | Node.js 20, Hono/Fastify, tRPC |
| Data | Prisma ORM, PostgreSQL (Supabase/Neon) |
| Authentication | Clerk |
| Billing | Stripe, Xendit, XenPlatform adapters |
| Communications | Resend (emails), push subscription store |
| Observability | Sentry, pino → Logtail/Better Stack, PostHog |
| Testing | Vitest, Playwright, Maestro |
| Docs & DX | Docs-as-code, Dev Container, Docker Compose previews |

See [`DECISIONS.md`](DECISIONS.md) for ADRs explaining each choice.

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env` and fill in secrets (Clerk, Stripe, Supabase/Neon, etc.).
   - Environment variables are validated via `packages/config`.

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
  - Web preview (Expo web or future Next.js): [http://localhost:3000](http://localhost:3000)
  - Storybook: [http://localhost:6006](http://localhost:6006)
  - Expo Web: [http://localhost:19006](http://localhost:19006)

## Scripts (Project “OS”)

```
pnpm dev:frontend        # Expo dev server (web + native)
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
pnpm test:e2e:mobile     # Maestro flows
pnpm test:changed        # Targeted tests via turbo filters

pnpm storybook           # Component library preview
pnpm preview             # Frontend production preview

pnpm billing:listen:stripe  # Stripe CLI webhook forward
pnpm billing:listen:xendit  # Xendit webhook forward via ngrok

pnpm docs:gen            # typedoc + Prisma ERD + route maps
pnpm docs:check          # Fail if docs are out of date
```

## Docs-as-Code Policy

- Changes touching critical areas (`prisma/schema.prisma`, tRPC routers, routes, config, UI, auth, billing) **must** update documentation in the same PR.
- Required updates:
  - [`ARCHITECTURE.md`](ARCHITECTURE.md)
  - [`DECISIONS.md`](DECISIONS.md) (new ADRs / updates)
  - `docs/**` (API summaries, feature guides, test docs)
- Enforced via `tooling/check-doc-updates.js` (pre-commit/CI) and GitHub workflows (`docs-gate`, `docs-auto`).

## Storybook Coverage

- Every exported UI component or screen must include a matching Storybook story.
- Maintain a global “Design System” story documenting tokens, typography, layout primitives, and component inventory.
- Treat Storybook as an authoritative source for visual documentation and regression checks.

## Testing Strategy

- **Unit/Integration**: Vitest (Node + DOM presets) with helpers from `packages/testing-utils`.
- **Web E2E**: Playwright flows covering auth, billing, and core features.
- **Mobile E2E**: Maestro scripts for critical journeys (login, purchases, etc.).
- **Webhooks & billing**: Fixtures in `packages/testing-utils` and integration tests in `apps/backend/tests`.

## Deployment Notes

- **Frontend (Expo)**: Expo EAS Build/Submit for native apps; Expo web export or optional Next.js integration later if SSR/SEO is needed.
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

## License

Specify your license here (MIT recommended for templates). Update this section once chosen.


