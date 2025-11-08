'use client';

import { useAuth } from '@clerk/nextjs';
import { AppLayout } from '@template/ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();

  return (
    <AppLayout title="Dashboard" onLogout={() => signOut?.()}>
      {children}
    </AppLayout>
  );
}


