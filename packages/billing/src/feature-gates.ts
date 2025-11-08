import type { PlanKey } from './plans';
import { plans } from './plans';

export const hasFeature = (plan: PlanKey, featureKey: string) => {
  return plans[plan]?.features?.[featureKey] ?? false;
};

export const getLimit = (plan: PlanKey, limitKey: string) => {
  return plans[plan]?.limits?.[limitKey] ?? 0;
};

