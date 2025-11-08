import { PropsWithChildren, ReactNode } from 'react';

interface FeatureProps extends PropsWithChildren {
  enabled: boolean;
  fallback?: ReactNode;
}

export const Feature = ({ enabled, fallback, children }: FeatureProps) => {
  if (enabled) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6 text-sm text-slate-600 dark:border-primary/40 dark:bg-primary/15 dark:text-slate-200">
      {fallback ?? 'Upgrade your plan to access this feature.'}
    </div>
  );
};


