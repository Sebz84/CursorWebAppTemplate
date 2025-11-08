'use client';

import { useEffect } from 'react';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  useEffect(() => {
    const applyAutocomplete = () => {
      const emailInput = document.querySelector<HTMLInputElement>('input[type="email"]');
      if (emailInput) {
        emailInput.setAttribute('autocomplete', 'email');
      }
      const passwordInput = document.querySelector<HTMLInputElement>('input[type="password"]');
      if (passwordInput) {
        passwordInput.setAttribute('autocomplete', 'current-password');
      }
    };

    applyAutocomplete();

    const observer = new MutationObserver(() => {
      applyAutocomplete();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-slate-900">
      <SignIn
        appearance={{ elements: { formButtonPrimary: 'bg-primary text-white' } }}
        afterSignInUrl="/dashboard"
        redirectUrl="/dashboard"
      />
    </main>
  );
}


