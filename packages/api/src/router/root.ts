import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const appRouter = router({
  health: publicProcedure.query(() => ({
    ok: true,
    timestamp: new Date().toISOString()
  })),
  echo: publicProcedure.input(z.object({ message: z.string() })).query(({ input }) => ({
    message: input.message
  }))
});

export type AppRouter = typeof appRouter;

