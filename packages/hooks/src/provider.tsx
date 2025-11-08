import { PropsWithChildren, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useAuth } from '@clerk/nextjs';
import { trpc } from './trpc';

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/trpc';

export const TRPCProvider = ({ children }: PropsWithChildren) => {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: getApiUrl(),
            async headers() {
              let token: string | null | undefined;
              if (getToken) {
                try {
                  token = await getToken({ template: 'integration_fallback' });
                } catch (error) {
                  console.warn(
                    '[hooks] Failed to fetch Clerk token with template "integration_fallback", falling back to default template.',
                    error
                  );
                  token = await getToken().catch((fallbackError) => {
                    console.error('[hooks] Failed to fetch Clerk token without template.', fallbackError);
                    return null;
                  });
                }
              }

              return token
                ? {
                    authorization: `Bearer ${token}`
                  }
                : {};
            }
          })
        ]
      }),
    [getToken]
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

