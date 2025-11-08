export type Branded<T, Brand extends string> = T & { readonly __brand: Brand };

export type UserId = Branded<string, 'UserId'>;

export type Role = 'USER' | 'ADMIN';
export const USER_ROLES = ['USER', 'ADMIN'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type PlanId = 'free' | 'pro' | 'business';

export type FeatureFlag =
  | 'feature:advanced-analytics'
  | 'feature:priority-support'
  | 'feature:team-collaboration';

export interface PlanLimit {
  key: `limit:${string}`;
  value: number;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice?: number;
  features: FeatureFlag[];
  limits: PlanLimit[];
}

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  planId: PlanId;
  features: FeatureFlag[];
}

export interface FeatureGateContext {
  user: SessionUser | null;
  loading: boolean;
}

export interface FeatureGateResult {
  enabled: boolean;
  reason?: string;
}
export type Branded<T, Brand extends string> = T & { readonly __brand: Brand };

export type ID<T extends string> = Branded<string, `${T}Id`>;

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

