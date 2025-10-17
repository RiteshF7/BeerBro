'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/lib/common/ui/button';
import { Input } from '@/lib/common/ui/input';
import { Label } from '@/lib/common/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/common/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/lib/common/ui/avatar';
import { Badge } from '@/lib/common/ui/badge';
import { authService, UserProfile } from '@/lib/storefront/auth/authService';
import { User } from 'firebase/auth';
import { ArrowLeft, Save, User as UserIcon, Mail, Phone, Calendar, Camera } from 'lucide-react';
import { Header } from '@/lib/storefront/components/Header';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      if (state.user && state.profile) {
        setUser(state.user);
        setProfile(state.profile);
        setFormData({
          displayName: state.profile.displayName || '',
          email: state.profile.email || '',
          phone: state.profile.phone || '',
          dateOfBirth: state.profile.dateOfBirth || ''
        });
        setLoading(false);
      } else if (!state.loading && !state.user) {
        // User not authenticated, redirect to home
        router.push('/');
      }
    });

    return unsubscribe;
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid birth date';
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    setSaving(true);
    try {
      await authService.updateUserProfile(user.uid, formData);
      // Profile will be updated via the auth service subscription
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Prepare user data for header
  const userForHeader = user && profile ? {
    name: profile.displayName,
    email: profile.email,
    avatar: profile.photoURL
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={() => {}}
        cartItems={0}
        user={userForHeader}
        onSignOut={handleSignOut}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Profile Header */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.photoURL} alt={profile.displayName} />
                    <AvatarFallback className="text-2xl">
                      {profile.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <CardTitle className="text-2xl">{profile.displayName}</CardTitle>
                  <CardDescription className="flex items-center justify-center space-x-2 mt-2">
                    <Badge variant={profile.status === 'active' ? 'default' : 'secondary'}>
                      {profile.status}
                    </Badge>
                    <Badge variant="outline">
                      {profile.role}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Full Name *
                    </Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="Enter your full name"
                      className={errors.displayName ? 'border-red-500' : ''}
                    />
                    {errors.displayName && (
                      <p className="text-sm text-red-500">{errors.displayName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={errors.dateOfBirth ? 'border-red-500' : ''}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
