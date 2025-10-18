'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginPage } from '@/lib/storefront/components/LoginPage';
import { authService } from '@/lib/storefront/auth/authService';
import { User } from 'firebase/auth';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      // If user is already authenticated, redirect to intended destination or home
      if (state.user && !state.loading) {
        const returnUrl = searchParams.get('returnUrl') || '/';
        router.push(returnUrl);
      }
    });

    return unsubscribe;
  }, [router, searchParams]);

  const handleLoginSuccess = (user: User, isNewUser: boolean) => {
    // Redirect to intended destination or home page after successful login
    const returnUrl = searchParams.get('returnUrl') || '/';
    router.push(returnUrl);
  };

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
}