'use client';

import { useState } from 'react';
import { Button } from '@/lib/common/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/common/ui/card';
import { authService } from '../auth/authService';
import { User } from 'firebase/auth';
import { Chrome, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User, isNewUser: boolean) => void;
  onLoginStart?: () => void;
}

export function LoginPage({ onLoginSuccess, onLoginStart }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    onLoginStart?.();

    try {
      const { user, isNewUser } = await authService.signInWithGoogle();
      onLoginSuccess(user, isNewUser);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">B</span>
          </div>
          <CardTitle className="text-2xl">Welcome to BeerBro</CardTitle>
          <CardDescription>
            Sign in to explore our collection of premium beverages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-12 text-base"
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Chrome className="mr-2 h-5 w-5" />
                Continue with Google
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
