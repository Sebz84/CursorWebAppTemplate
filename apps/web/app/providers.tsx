'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { PropsWithChildren } from 'react';
import { TRPCProvider } from '../providers/trpc-provider';

export const Providers = ({ children }: PropsWithChildren) => (
  <ClerkProvider
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    afterSignInUrl="/dashboard"
    afterSignUpUrl="/dashboard"
  >
    <TRPCProvider>{children}</TRPCProvider>
  </ClerkProvider>
);


