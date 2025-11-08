import { clerkClient, type Session, type ClerkClient } from '@clerk/clerk-sdk-node';
import { z } from 'zod';
import { env } from '@template/config';
import type { Role } from '@template/types';
import type { AuthenticatedSession, AuthenticatedUser } from './types';

type ResolvedSession = Pick<Session, 'id' | 'userId'>;

const roleSchema = z.enum(['USER', 'ADMIN']);

const getClerkClient = (client?: ClerkClient) => {
  if (client) {
    return client;
  }
  if (!process.env.CLERK_SECRET_KEY && env.CLERK_SECRET_KEY) {
    process.env.CLERK_SECRET_KEY = env.CLERK_SECRET_KEY;
  }
  return clerkClient;
};

const buildUser = (session: ResolvedSession, metadata: Record<string, unknown>): AuthenticatedUser => {
  const role = roleSchema.safeParse(metadata.role).data ?? 'USER';
  const planId = typeof metadata.planId === 'string' ? metadata.planId : 'free';
  const features = (metadata.features as Record<string, boolean>) ?? {};

  return {
    id: session.userId as AuthenticatedUser['id'],
    email: typeof metadata.email === 'string' ? metadata.email : '',
    role,
    planId,
    features
  };
};

export const getCurrentSession = async (
  sessionToken: string | null,
  client?: ClerkClient
): Promise<AuthenticatedSession | null> => {
  if (!sessionToken) {
    return null;
  }

  const resolvedClient = getClerkClient(client);
  const session = await resolvedClient.sessions.getSession(sessionToken);
  if (!session) {
    return null;
  }

  const user = await resolvedClient.users.getUser(session.userId);

  return {
    sessionId: session.id,
    user: buildUser(session, {
      email: user?.emailAddresses?.[0]?.emailAddress,
      role: user?.publicMetadata?.role,
      planId: user?.publicMetadata?.planId,
      features: user?.publicMetadata?.features
    })
  };
};

export const requireSession = async (
  sessionToken: string | null,
  client?: ClerkClient
): Promise<AuthenticatedSession> => {
  const session = await getCurrentSession(sessionToken, client);
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
};

export const requireRole = (role: Role) => async (
  sessionToken: string | null,
  client?: ClerkClient
) => {
  const session = await requireSession(sessionToken, client);
  if (session.user.role !== role) {
    throw new Error('Forbidden');
  }
  return session;
};

export const withUser = <Args extends unknown[], Return>(
  handler: (session: AuthenticatedSession, ...args: Args) => Promise<Return>
) => {
  return async (sessionToken: string | null, ...args: Args) => {
    const session = await requireSession(sessionToken);
    return handler(session, ...args);
  };
};

