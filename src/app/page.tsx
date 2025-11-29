'use client';

import AuthGate from '@/components/auth-gate';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '@/components/logo';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = dynamic(() => import('@/components/dashboard'), {
  loading: () => <DashboardSkeleton />,
});
const AuthForm = dynamic(() => import('@/components/auth-form'), {
  loading: () => <AuthFormSkeleton />,
});

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Logo className="h-16 w-16 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <AuthGate loggedIn={!!user} authUI={<AuthForm />}>
      <Dashboard />
    </AuthGate>
  );
}

const DashboardSkeleton = () => (
  <div className="flex min-h-screen w-full flex-col">
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="hidden h-6 w-24 sm:inline-block" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </header>
    <main className="flex-1 bg-background">
      <div className="mx-auto w-full max-w-[1400px] px-0 py-4 sm:px-0 sm:py-6 lg:px-0 lg:py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    </main>
  </div>
);

const AuthFormSkeleton = () => (
  <div className="container mx-auto flex min-h-screen max-w-[1400px] items-center justify-center bg-background px-4">
    <div className="w-full max-w-md">
      <div className="mb-6 flex justify-center">
        <Logo className="h-12 w-12 animate-pulse text-primary" />
      </div>
      <Skeleton className="h-[450px] w-full" />
    </div>
  </div>
);
