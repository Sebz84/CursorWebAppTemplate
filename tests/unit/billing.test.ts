import { describe, expect, it } from 'vitest';
import { hasFeature, getPlanById } from '@template/billing';
import type { AuthenticatedUser } from '@template/auth';

const baseUser = (planId: string): AuthenticatedUser => ({
  id: 'user_123' as AuthenticatedUser['id'],
  email: 'user@example.com',
  role: 'USER',
  planId,
  features: {}
});

describe('billing helpers', () => {
  it('allows pro feature when plan includes it', () => {
    const user = baseUser('pro');
    expect(hasFeature(user, 'feature:advanced-analytics')).toBe(true);
  });

  it('denies pro feature for free plan', () => {
    const user = baseUser('free');
    expect(hasFeature(user, 'feature:advanced-analytics')).toBe(false);
  });

  it('returns plan definition by id', () => {
    const plan = getPlanById('free');
    expect(plan.name).toBe('Free');
  });
});

