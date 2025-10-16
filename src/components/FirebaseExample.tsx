'use client';

import { useState } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { authUtils, firestoreUtils } from '@/lib/firebase-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from './UserProfile';

export default function FirebaseExample() {
  const { user, loading } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  const handleSignIn = async () => {
    try {
      const result = await authUtils.signInWithEmail(email, password);
      // Create or update user profile after successful sign in
      if (result.user) {
        await firestoreUtils.createDocument('userProfiles', {
          displayName: result.user.displayName || result.user.email?.split('@')[0] || 'User',
          email: result.user.email,
          lastLoginAt: new Date().toISOString(),
          provider: 'email'
        }, result.user.uid);
      }
      setMessage('Signed in successfully!');
    } catch (error: unknown) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
  };

  const handleSignUp = async () => {
    try {
      const result = await authUtils.createUserWithEmail(email, password);
      // Create user profile after successful sign up
      if (result.user) {
        await firestoreUtils.createDocument('userProfiles', {
          displayName: result.user.displayName || result.user.email?.split('@')[0] || 'User',
          email: result.user.email,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          provider: 'email'
        }, result.user.uid);
      }
      setMessage('Account created successfully!');
    } catch (error: unknown) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await authUtils.signOut();
      setMessage('Signed out successfully!');
    } catch (error: unknown) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await authUtils.signInWithGoogle();
      // Create or update user profile after successful Google sign in
      if (result.user) {
        // Check if profile exists, if not create it
        const existingProfile = await firestoreUtils.getDocument('userProfiles', result.user.uid);
        if (!existingProfile) {
          const profileData = {
            displayName: result.user.displayName || result.user.email?.split('@')[0] || 'User',
            email: result.user.email,
            photoURL: result.user.photoURL,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            provider: 'google'
          };
          await firestoreUtils.createDocument('userProfiles', profileData, result.user.uid);
        } else {
          const updateData = {
            displayName: result.user.displayName || result.user.email?.split('@')[0] || 'User',
            email: result.user.email,
            photoURL: result.user.photoURL,
            lastLoginAt: new Date().toISOString(),
            provider: 'google'
          };
          await firestoreUtils.updateDocument('userProfiles', result.user.uid, updateData);
        }
      }
      setMessage('Signed in with Google successfully!');
    } catch (error: unknown) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
  };

  const handleCreateDocument = async () => {
    if (!user) return;
    
    try {
      await firestoreUtils.createDocument('test-collection', {
        title: 'Test Document',
        content: 'This is a test document',
        createdAt: new Date().toISOString(),
        userId: user.uid
      });
      setMessage('Document created successfully!');
    } catch (error: unknown) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && showProfile) {
    return (
      <div className="space-y-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowProfile(false)}
            >
              ← Back to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
        <UserProfile />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Authentication</CardTitle>
          <CardDescription>
            {user ? `Welcome, ${user.displayName || user.email}!` : 'Please sign in to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSignIn}>Sign In</Button>
                <Button onClick={handleSignUp} variant="outline">Sign Up</Button>
                <Button onClick={handleGoogleSignIn} variant="secondary">
                  Sign in with Google
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium">{user.displayName || 'User'}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setShowProfile(true)}>
                  View Profile
                </Button>
                <Button onClick={handleCreateDocument} variant="outline">
                  Create Test Document
                </Button>
                <Button onClick={handleSignOut} variant="destructive">
                  Sign Out
                </Button>
              </div>
            </div>
          )}
          {message && (
            <div className="p-3 bg-gray-100 rounded-md text-sm">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
