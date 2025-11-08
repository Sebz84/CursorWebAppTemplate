import pino from 'pino';
import * as Sentry from '@sentry/node';

let sentryInitialized = false;

export const initSentry = (dsn?: string) => {
  if (sentryInitialized || !dsn) {
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0
  });

  sentryInitialized = true;
};

export const logger = pino({
  name: 'cursor-template',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true
          }
        }
});

export const withErrorLogging = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    logger.error({ err: error }, 'operation failed');
    if (sentryInitialized) {
      Sentry.captureException(error);
    }
    throw error;
  }
};
export * from './logger';
export * from './sentry';
export * from './posthog';
export * from './logger';
export * from './sentry';
export * from './posthog';

