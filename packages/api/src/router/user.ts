import { protectedProcedure, router } from '../trpc';

export const userRouter = router({
  me: protectedProcedure.query(({ ctx }) => ({
    user: ctx.session.user
  }))
});

