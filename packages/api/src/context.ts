import type { AuthenticatedSession } from '@template/auth';
import { getCurrentSession } from '@template/auth';

export interface CreateContextOptions {
  authorizationHeader?: string | null;
}

export interface Context {
  session: AuthenticatedSession | null;
  sessionToken: string | null;
}

const extractBearer = (header?: string | null) => {
  if (!header) {
    return null;
  }
  const matches = header.match(/Bearer (.*)/i);
  return matches ? matches[1] : header;
};

export const createContext = async ({ authorizationHeader }: CreateContextOptions): Promise<Context> => {
  const sessionToken = extractBearer(authorizationHeader);
  const session = await getCurrentSession(sessionToken);
  return { session, sessionToken };
};

export type ContextFactory = typeof createContext;

