import { publicProcedure, router } from '../trpc';

export const healthRouter = router({
  heartbeat: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: Date.now()
  }))
});

