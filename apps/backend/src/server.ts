import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { appRouter, createContext } from '@template/api';
import { initSentry, logger } from '@template/observability';
import { env } from './env';

export const createServer = () => {
  initSentry(process.env.SENTRY_DSN);

  const app = new Hono();

  app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

  app.use(
    '/trpc/*',
    trpcServer({
      router: appRouter,
      createContext: async (opts) =>
        createContext({ authorizationHeader: opts.req.header('authorization') })
    })
  );

  app.onError((err, c) => {
    logger.error({ err }, 'Unhandled backend error');
    return c.json({ message: 'Internal Server Error' }, 500);
  });

  return app;
};

export const start = async () => {
  const { serve } = await import('@hono/node-server');
  const app = createServer();
  serve({
    fetch: app.fetch,
    port: env.PORT,
    hostname: '0.0.0.0'
  });
  logger.info({ port: env.PORT }, 'Backend server listening');
};
