'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, tenant, token } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    const timer = setTimeout(() => setIsHydrated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Debug logging
    console.log('ProtectedRoute check:', { isAuthenticated, hasTenant: !!tenant, hasToken: !!token });
    
    if (!isAuthenticated || !tenant || !token) {
      console.log('Redirecting to login - auth check failed');
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, tenant, token, router]);

  // Show loading spinner while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated || !tenant || !token) {
    return null;
  }

  return <>{children}</>;
}
