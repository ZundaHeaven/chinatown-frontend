import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthGuard = (redirectTo: string = '/login', requireAuth: boolean = true) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, router, redirectTo, requireAuth]);

  return { isAuthenticated, isLoading };
};