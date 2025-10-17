/**
 * Admin Console Hook
 * 
 * This hook provides state management and actions for the admin console.
 * It centralizes admin-specific state and provides methods to interact with it.
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/lib/common/contexts/FirebaseContext';
import { isAdmin } from '@/lib/auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AdminConsoleState, AdminConsoleContextValue } from '../types';

/**
 * Custom hook for admin console state management
 * 
 * @returns AdminConsoleContextValue - State and actions for admin console
 */
export function useAdminConsole(): AdminConsoleContextValue {
  const { user, loading } = useFirebase();
  const router = useRouter();
  
  const [state, setState] = useState<AdminConsoleState>({
    user: null,
    isLoading: true,
    error: null,
    activePage: '/admin/dashboard',
    sidebarCollapsed: false
  });

  /**
   * Set the current user
   */
  const setUser = useCallback((user: typeof state.user) => {
    setState(prev => ({ ...prev, user }));
  }, []);

  /**
   * Set loading state
   */
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  /**
   * Set active page
   */
  const setActivePage = useCallback((page: string) => {
    setState(prev => ({ ...prev, activePage: page }));
  }, []);

  /**
   * Toggle sidebar collapsed state
   */
  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  }, []);

  /**
   * Sign out the current user
   */
  const handleSignOut = useCallback(async () => {
    try {
      if (auth) {
        await signOut(auth);
        router.push('/');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  }, [router, setError]);

  // Update user state when Firebase user changes
  useEffect(() => {
    if (loading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setUser(null);
      setLoading(false);
      router.push('/');
      return;
    }

    if (!isAdmin(user)) {
      setUser(null);
      setLoading(false);
      router.push('/');
      return;
    }

    setUser(user);
    setLoading(false);
  }, [user, loading, router, setUser, setLoading]);

  return {
    state,
    actions: {
      setUser,
      setLoading,
      setError,
      setActivePage,
      toggleSidebar,
      signOut: handleSignOut
    }
  };
}