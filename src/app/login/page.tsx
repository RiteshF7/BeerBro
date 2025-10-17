'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPage } from '@/lib/storefront/components/LoginPage';
import { authService } from '@/lib/storefront/auth/authService';
import { User } from 'firebase/auth';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      // If user is already authenticated, redirect to home
      if (state.user && !state.loading) {
        router.push('/');
      }
    });

    return unsubscribe;
  }, [router]);

  const handleLoginSuccess = (user: User, isNewUser: boolean) => {
    // Redirect to home page after successful login
    router.push('/');
  };

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
}