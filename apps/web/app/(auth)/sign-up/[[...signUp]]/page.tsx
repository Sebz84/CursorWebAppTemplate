'use client';

import { useEffect } from 'react';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  useEffect(() => {
    const applyAutocomplete = () => {
      const emailInput = document.querySelector<HTMLInputElement>('input[type="email"]');
      if (emailInput) {
        emailInput.setAttribute('autocomplete', 'email');
      }

      const passwordInput = document.querySelector<HTMLInputElement>('input[type="password"]');
      if (passwordInput) {
        passwordInput.setAttribute('autocomplete', 'new-password');
      }

      const firstNameInput = document.querySelector<HTMLInputElement>('input[name="first_name"], input[placeholder*="First name" i]');
      if (firstNameInput) {
        firstNameInput.setAttribute('autocomplete', 'given-name');
      }

      const lastNameInput = document.querySelector<HTMLInputElement>('input[name="last_name"], input[placeholder*="Last name" i]');
      if (lastNameInput) {
        lastNameInput.setAttribute('autocomplete', 'family-name');
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
      <SignUp
        appearance={{ elements: { formButtonPrimary: 'bg-primary text-white' } }}
        afterSignUpUrl="/dashboard"
        redirectUrl="/dashboard"
      />
    </main>
  );
}


