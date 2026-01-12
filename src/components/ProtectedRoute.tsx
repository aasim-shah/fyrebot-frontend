'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, tenant, token } = useAuthStore();

  useEffect(() => {
    // Debug logging
    console.log('ProtectedRoute check:', { isAuthenticated, hasTenant: !!tenant, hasToken: !!token });
    
    if (!isAuthenticated || !tenant || !token) {
      console.log('Redirecting to login - auth check failed');
      router.push('/login');
    }
  }, [isAuthenticated, tenant, token, router]);

  if (!isAuthenticated || !tenant || !token) {
    return null;
  }

  return <>{children}</>;
}
