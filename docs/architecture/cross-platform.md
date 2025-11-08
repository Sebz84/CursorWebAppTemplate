# Cross-Platform Strategy

This template now ships a PWA-first frontend (`apps/web`, Next.js 14 + Tailwind + shadcn/ui). The architecture keeps the path open to reintroduce an Expo/React Native client with minimal churn.

## Shared Foundations

- **Contracts**: tRPC procedures, Prisma models, and shared hooks (`packages/hooks`) remain platform agnostic.
- **Design tokens**: Tailwind tokens live in `packages/ui-web`; the same tokens can seed Tamagui/NativeWind in `packages/ui-mobile`.
- **UI interface**: `@template/ui` re-exports the active implementation. Today it points to `packages/ui-web`; when the Expo client returns, add `packages/ui-mobile` components and switch via platform-specific entry points or bundler aliases.
- **Billing/Auth**: Clerk + Stripe/Xendit integrations stay in shared packages so both web and native clients reuse the same helpers.

## When Bringing Back Expo

1. Scaffold `apps/mobile` with Expo + expo-router.
2. Implement UI primitives in `packages/ui-mobile` (Tamagui or NativeWind) that conform to the same interface exported by `@template/ui`.
3. Re-enable Maestro flows (`tests/e2e-mobile`) and update Docker services/documentation.
4. Provide a platform-specific TRPC provider (either reuse the old implementation or add `packages/hooks/src/provider.native.tsx`).
5. Update documentation (Architecture, README, feature guides) and ADRs to describe the hybrid setup.

Keep this document updated whenever UI abstractions or platform boundaries change so Cursor and future contributors understand how to toggle between web and native clients.


