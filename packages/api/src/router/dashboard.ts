import { protectedProcedure, router } from '../trpc';
import { requireFeature } from '@template/billing';

export const dashboardRouter = router({
  analytics: protectedProcedure.query(({ ctx }) => {
    requireFeature(ctx.session, 'feature:advanced-analytics');
    return {
      conversionRate: 0.42,
      activeUsers: 1280
    };
  })
});

