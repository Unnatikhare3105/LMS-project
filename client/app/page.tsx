'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/src/hooks/useAppSelector';

export default function Page() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((s: any) => s.auth.isAuthenticated);
  const token = useAppSelector((s: any) => s.auth.token);

  useEffect(() => {
    const hasToken = Boolean(token || (typeof window !== 'undefined' && localStorage.getItem('token')));
    router.replace(hasToken ? '/dashboard' : '/auth');
  }, [isAuthenticated, token, router]);

  return null;
}