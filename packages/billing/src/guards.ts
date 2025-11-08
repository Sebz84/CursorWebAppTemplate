import { TRPCError } from '@trpc/server';
import type { AuthenticatedSession } from '@template/auth';
import { hasFeature, getLimit } from './features';

export const requireFeature = (session: AuthenticatedSession, featureKey: string) => {
  if (!hasFeature(session.user, featureKey)) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Feature unavailable for current plan' });
  }
};

export const enforceLimit = (session: AuthenticatedSession, limitKey: string, currentUsage: number) => {
  const limit = getLimit(session.user, limitKey);
  if (limit !== null && currentUsage >= limit) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `You have reached the limit for ${limitKey}`
    });
  }
};

