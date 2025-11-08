import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
    DATABASE_URL: z.string().url().describe('PostgreSQL connection string'),
    PAYMENT_PROVIDER: z.enum(['stripe', 'xendit']).default('stripe'),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    XENDIT_SECRET_KEY: z.string().optional(),
    XENDIT_WEBHOOK_TOKEN: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    SENTRY_DSN: z.string().optional(),
    POSTHOG_API_KEY: z.string().optional()
  },
  clientPrefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
      .string()
      .min(1, 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required'),
    NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001/trpc')
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
});

export type RuntimeEnv = typeof env;

export const getRuntimeEnv = () => env;

