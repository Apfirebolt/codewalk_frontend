'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function useRequireAdmin() {
  const { user, loading, initializeAuth } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure this only runs on the client side to avoid SSR mismatch
  useEffect(() => {
    setIsMounted(true);
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Wait until mounted and auth loading is finished
    if (!isMounted || loading) return;

    // If there is no user or role isn't admin, redirect
    if (!user || user.role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [isMounted, loading, user, router]);

  return {
    isAdmin: user?.role === 'admin',
    // Keep isLoading true until the component is mounted AND auth is done loading
    isLoading: !isMounted || loading,
    user,
  };
}