import * as Sentry from '@sentry/node';
import { browserTracingIntegration, replayIntegration } from '@sentry/react';

let initialized = false;

export const initSentry = (dsn?: string) => {
  if (initialized || !dsn) return;

  Sentry.init({
    dsn,
    tracesSampleRate: 0.2,
    integrations: [browserTracingIntegration(), replayIntegration()]
  });

  initialized = true;
};

export const getSentry = () => Sentry;
import * as Sentry from '@sentry/node';

let sentryInitialized = false;

export const initSentry = (dsn?: string) => {
  if (sentryInitialized) {
    return;
  }

  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1
  });

  sentryInitialized = true;
};

export { Sentry };

