import { withUser } from './server-clerk';

export type Role = 'USER' | 'ADMIN';

export const requireRole = async <T>(role: Role, handler: () => Promise<T>) => {
  return withUser(async user => {
    if (user.role !== role) {
      throw new Error('Forbidden');
    }
    return handler();
  });
};

export const requirePlan = async <T>(plan: string, handler: () => Promise<T>) => {
  return withUser(async () => {
    // Placeholder enforcement. Real plan check is implemented later.
    if (!plan) {
      throw new Error('Plan requirement missing');
    }
    return handler();
  });
};

