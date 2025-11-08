import Link from 'next/link';
import { plans } from '@template/billing';

export const dynamic = 'force-static';

export default function PricingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-16">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Pricing that grows with you</h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-300">
          Plans are defined in <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">
            packages/billing/src/plans.ts
          </code>{' '}
          so Cursor can expand them with new features.
        </p>
      </header>
      <section className="flex flex-wrap justify-center gap-6">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:bg-slate-800"
          >
            <div>
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="text-3xl font-bold">
                {plan.price === 0
                  ? 'Free'
                  : new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: plan.currency ?? 'USD'
                    }).format((plan.price ?? 0) / 100)}
              </p>
            </div>
            <ul className="flex-1 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {plan.features.map((feature) => (
                <li key={feature.key} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{feature.description}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/sign-in"
              className="rounded-md bg-primary px-4 py-2 text-center font-semibold text-primary-foreground hover:bg-blue-600"
            >
              Get started
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}


