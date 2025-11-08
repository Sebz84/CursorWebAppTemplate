'use client';

import Link from 'next/link';
import { plans } from '@template/billing';
import { useCurrentUser } from '@template/hooks';
import { useMemo } from 'react';

export default function BillingPage() {
  const { data } = useCurrentUser();
  const currentPlan = useMemo(() => plans.find((plan) => plan.id === data?.user?.planId), [data?.user?.planId]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">Billing &amp; subscription</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Manage the plan configuration from <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">packages/billing/src/plans.ts</code>.
        </p>
      </header>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-300">Current plan</p>
        <h3 className="text-xl font-semibold">{currentPlan?.name ?? 'Free'}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link
            href="/pricing"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:border-primary"
          >
            View plans
          </Link>
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-blue-600"
            onClick={() => alert('Stripe/Xendit billing portal goes here.')}
          >
            Manage subscription
          </button>
        </div>
      </section>
    </div>
  );
}


