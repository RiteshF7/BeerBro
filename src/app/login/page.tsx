'use client';

import { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginPage } from '@/lib/storefront/components/LoginPage';
import { authService } from '@/lib/storefront/auth/authService';
import { User } from 'firebase/auth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      // Only redirect if user is already authenticated when page loads (not during login flow)
      if (state.user && !state.loading && !isLoggingIn && !hasCheckedAuth) {
        setHasCheckedAuth(true);
        const returnUrl = searchParams.get('returnUrl') || '/';
        router.push(returnUrl);
      } else if (!state.user && !state.loading) {
        setHasCheckedAuth(true);
      }
    });

    return unsubscribe;
  }, [router, searchParams, isLoggingIn, hasCheckedAuth]);

  const handleLoginSuccess = (_user: User, _isNewUser: boolean) => {
    setIsLoggingIn(false);
    // Redirect to intended destination or home page after successful login
    const returnUrl = searchParams.get('returnUrl') || '/';
    router.push(returnUrl);
  };

  return <LoginPage onLoginSuccess={handleLoginSuccess} onLoginStart={() => setIsLoggingIn(true)} />;
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}