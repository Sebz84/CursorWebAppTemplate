import { PropsWithChildren } from 'react';

export interface AppLayoutProps extends PropsWithChildren {
  title?: string;
  onLogout?: () => void;
}

export const AppLayout = ({ children, title, onLogout }: AppLayoutProps) => (
  <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h1 className="text-lg font-semibold">{title ?? 'Dashboard'}</h1>
      {onLogout ? (
        <button
          type="button"
          onClick={onLogout}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-blue-600"
        >
          Logout
        </button>
      ) : null}
    </header>
    <main className="flex-1 overflow-y-auto px-6 py-8">{children}</main>
  </div>
);


