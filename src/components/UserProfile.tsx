'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { authUtils, firestoreUtils } from '@/lib/firebase-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfileData {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: string;
  lastLoginAt: string;
}

export default function UserProfile() {
  const { user } = useFirebase();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');

  const loadUserProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Load user profile from Firestore
      const profileDoc = await firestoreUtils.getDocument('userProfiles', user.uid);
      
      if (profileDoc) {
        const profile = profileDoc as Record<string, unknown>; // Type assertion for Firestore document
        setProfileData({
          displayName: (profile.displayName as string) || user.displayName || '',
          bio: (profile.bio as string) || '',
          location: (profile.location as string) || '',
          website: (profile.website as string) || '',
          createdAt: (profile.createdAt as string) || new Date().toISOString(),
          lastLoginAt: (profile.lastLoginAt as string) || new Date().toISOString()
        });
        setFormData({
          displayName: (profile.displayName as string) || user.displayName || '',
          bio: (profile.bio as string) || '',
          location: (profile.location as string) || '',
          website: (profile.website as string) || '',
          email: user.email || '',
          currentPassword: '',
          newPassword: ''
        });
      } else {
        // Create initial profile if it doesn't exist
        const initialProfile = {
          displayName: user.displayName || '',
          bio: '',
          location: '',
          website: '',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        
        await firestoreUtils.createDocument('userProfiles', initialProfile, user.uid);
        setProfileData(initialProfile);
        setFormData({
          displayName: initialProfile.displayName,
          bio: initialProfile.bio,
          location: initialProfile.location,
          website: initialProfile.website,
          email: user.email || '',
          currentPassword: '',
          newPassword: ''
        });
      }
    } catch (error: unknown) {
      setMessage(`Error loading profile: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user, loadUserProfile]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Update Firebase Auth profile
      if (formData.displayName !== user.displayName) {
        await authUtils.updateUserProfile(user, {
          displayName: formData.displayName
        });
      }

      // Update Firestore profile
      const updatedProfile = {
        displayName: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        lastUpdatedAt: new Date().toISOString()
      };

      await firestoreUtils.updateDocument('userProfiles', user.uid, updatedProfile);
      
      // Update local state
      setProfileData(prev => prev ? { ...prev, ...updatedProfile } : null);
      setEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error: unknown) {
      setMessage(`Error updating profile: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      if (formData.currentPassword) {
        // Reauthenticate user before updating email
        await authUtils.reauthenticateUser(formData.currentPassword);
      }
      
      await authUtils.updateUserEmail(formData.email);
      setMessage('Email updated successfully!');
    } catch (error: unknown) {
      setMessage(`Error updating email: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      if (formData.currentPassword) {
        // Reauthenticate user before updating password
        await authUtils.reauthenticateUser(formData.currentPassword);
      }
      
      await authUtils.updateUserPassword(formData.newPassword);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      setMessage('Password updated successfully!');
    } catch (error: unknown) {
      setMessage(`Error updating password: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !formData.currentPassword) return;

    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      
      // Reauthenticate user before deleting account
      await authUtils.reauthenticateUser(formData.currentPassword);
      
      // Delete user profile from Firestore
      await firestoreUtils.deleteDocument('userProfiles', user.uid);
      
      // Delete user account
      await authUtils.deleteUserAccount();
      
      setMessage('Account deleted successfully!');
    } catch (error: unknown) {
      setMessage(`Error deleting account: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {user?.displayName || 'User Profile'}
              </h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </CardTitle>
          <CardDescription>
            Manage your account settings and profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Information */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Profile Information</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  disabled={!editing}
                  placeholder="Your location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  disabled={!editing}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                disabled={!editing}
                placeholder="Tell us about yourself..."
              />
            </div>

            {editing && (
              <Button onClick={handleUpdateProfile} disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            )}
          </div>

          {/* Security Settings */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium">Security Settings</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password for verification"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleUpdateEmail}
                  disabled={loading || !formData.currentPassword}
                >
                  Update Email
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleUpdatePassword}
                  disabled={loading || !formData.currentPassword || !formData.newPassword}
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-600">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={loading || !formData.currentPassword}
            >
              Delete Account
            </Button>
          </div>

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
