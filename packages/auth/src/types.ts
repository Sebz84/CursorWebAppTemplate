import type { Role, UserId } from '@template/types';

export type PlanId = 'free' | 'pro' | string;

export type FeatureMap = Record<string, boolean>;

export interface AuthenticatedUser {
  id: UserId;
  email: string;
  role: Role;
  planId: PlanId;
  features: FeatureMap;
}

export interface AuthenticatedSession {
  user: AuthenticatedUser;
  sessionId: string;
}

