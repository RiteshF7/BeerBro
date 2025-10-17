'use client';

import { useEffect, useState } from 'react';
import { authService, AuthState, UserProfile } from '../auth/authService';
import { User } from 'firebase/auth';
import { LoginPage } from './LoginPage';
import { UserProfileForm } from './UserProfileForm';
import { Loader2 } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  });
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      setAuthState(state);
      
      // If user is authenticated but profile is incomplete, show profile form
      if (state.user && state.profile && !state.profile.isProfileComplete) {
        setShowProfileForm(true);
      } else if (state.user && state.profile && state.profile.isProfileComplete) {
        setShowProfileForm(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleLoginSuccess = (user: User, isNewUser: boolean) => {
    if (isNewUser) {
      setShowProfileForm(true);
    }
  };

  const handleProfileComplete = async (profileData: Partial<UserProfile>) => {
    if (!authState.user) return;

    try {
      await authService.updateUserProfile(authState.user.uid, profileData);
      setShowProfileForm(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSkipProfile = () => {
    setShowProfileForm(false);
  };

  // Show loading spinner while checking authentication
  if (authState.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!authState.user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show profile form if user is authenticated but profile is incomplete
  if (showProfileForm && authState.user) {
    return (
      <UserProfileForm
        user={authState.user}
        onComplete={handleProfileComplete}
        onSkip={handleSkipProfile}
      />
    );
  }

  // Show main content if user is authenticated and profile is complete
  return <>{children}</>;
}
