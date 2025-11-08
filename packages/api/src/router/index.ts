import { router } from '../trpc';
import { healthRouter } from './health';
import { userRouter } from './user';
import { dashboardRouter } from './dashboard';

export const appRouter = router({
  health: healthRouter,
  user: userRouter,
  dashboard: dashboardRouter
});

export type AppRouter = typeof appRouter;

