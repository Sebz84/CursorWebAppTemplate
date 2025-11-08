import type { User } from '@clerk/clerk-expo';

export interface SessionUser extends Pick<User, 'id' | 'emailAddresses' | 'primaryEmailAddressId'> {
  role?: 'USER' | 'ADMIN';
}

export const getCurrentUser = async (): Promise<SessionUser | null> => {
  throw new Error('getCurrentUser not implemented yet');
};

export const withUser = async <T>(handler: (user: SessionUser) => Promise<T>) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthenticated');
  }
  return handler(user);
};

