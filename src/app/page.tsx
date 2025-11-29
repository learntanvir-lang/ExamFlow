'use client';

import AuthGate from '@/components/auth-gate';
import Dashboard from '@/components/dashboard';
import AuthForm from '@/components/auth-form';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '@/components/logo';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Logo className="h-16 w-16 animate-pulse text-primary" />
      </div>
    );
  }

  return <AuthGate loggedIn={!!user} authUI={<AuthForm />}>
    <Dashboard />
  </AuthGate>;
}