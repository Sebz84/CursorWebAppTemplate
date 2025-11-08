import type { FeatureMap } from '@template/auth';
import type { AuthenticatedUser } from '@template/auth';
import { getPlanById } from './plans';

export const hasFeature = (user: AuthenticatedUser, featureKey: string) => {
  if (user.features[featureKey]) {
    return true;
  }
  const plan = getPlanById(user.planId);
  return plan.features.some((feature) => feature.key === featureKey);
};

export const getLimit = (user: AuthenticatedUser, limitKey: string): number | null => {
  const plan = getPlanById(user.planId);
  if (user.features[limitKey as keyof FeatureMap]) {
    return Number(user.features[limitKey as keyof FeatureMap]);
  }
  return plan.limits[limitKey] ?? null;
};

