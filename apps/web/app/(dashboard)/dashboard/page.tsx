'use client';

import { Feature } from '@template/ui';
import { trpc, useCurrentUser } from '@template/hooks';
import { hasFeature } from '@template/billing';
import { NotificationsCard } from './pwa-panel';

export default function DashboardPage() {
  const { data, isLoading } = useCurrentUser();
  const analytics = trpc.dashboard.analytics.useQuery(undefined, {
    enabled: !!data?.user && hasFeature(data.user, 'feature:advanced-analytics'),
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return <div className="py-12 text-sm text-slate-500">Loading your workspace…</div>;
  }

  const user = data?.user;

  return (
    <div className="flex flex-col gap-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Welcome back {user?.email ?? ''}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">Current plan: {user?.planId ?? 'free'}</p>
      </section>

      <Feature enabled={!!user && hasFeature(user, 'feature:advanced-analytics')}>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <header className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Advanced Analytics</h3>
            <span className="text-xs font-medium uppercase tracking-wide text-primary">Pro</span>
          </header>
          {analytics.isLoading ? (
            <p className="text-sm text-slate-500">Crunching numbers…</p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-200">
              <li>Conversion rate: {(analytics.data?.conversionRate ?? 0) * 100}%</li>
              <li>Active users: {analytics.data?.activeUsers ?? 0}</li>
            </ul>
          )}
        </div>
      </Feature>

      <NotificationsCard />
    </div>
  );
}


