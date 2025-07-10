'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { updateUserDocument } from '@/lib/db';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserDocument } from '@/types';

interface ProfileFormProps {
  className?: string;
}

interface ProfileFormData {
  displayName: string;
  email: string;
  dietary_restrictions: string[];
  bio?: string;
}

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Low-Carb',
  'Pescatarian',
  'Halal',
  'Kosher'
];

export default function ProfileForm({ className }: ProfileFormProps) {
  const { user, userDoc, refreshUserDocument } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    email: '',
    dietary_restrictions: [],
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form data when userDoc is available
  useEffect(() => {
    if (userDoc) {
      setFormData({
        displayName: userDoc.displayName || '',
        email: userDoc.email || '',
        dietary_restrictions: userDoc.preferences?.dietary_restrictions || [],
        bio: userDoc.bio || ''
      });
    }
  }, [userDoc]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(restriction)
        ? prev.dietary_restrictions.filter(r => r !== restriction)
        : [...prev.dietary_restrictions, restriction]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userDoc) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update Firebase Auth profile if display name changed
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: formData.displayName
        });
      }

      // Update Firestore user document
      const updateData: Partial<UserDocument> = {
        displayName: formData.displayName,
        bio: formData.bio,
        preferences: {
          ...userDoc.preferences,
          dietary_restrictions: formData.dietary_restrictions
        }
      };

      await updateUserDocument(user.uid, updateData);
      await refreshUserDocument();
      
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userDoc) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your personal information and dietary preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              {userDoc.photoURL ? (
                <img 
                  src={userDoc.photoURL} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-primary">
                  {formData.displayName.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Profile picture is managed through your Google account
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Display Name
              </label>
              <Input
                id="displayName"
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="Enter your display name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed here
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.bio?.length || 0}/500 characters
            </p>
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Dietary Restrictions
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {DIETARY_OPTIONS.map((option) => (
                <div
                  key={option}
                  onClick={() => toggleDietaryRestriction(option)}
                  className="cursor-pointer"
                >
                  <Badge
                    variant={
                      formData.dietary_restrictions.includes(option)
                        ? 'default'
                        : 'outline'
                    }
                    className="w-full justify-center hover:bg-primary/20 transition-colors"
                  >
                    {option}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Click to toggle dietary restrictions
            </p>
          </div>

          {/* Account Info */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Account Type:</span>
                <Badge variant="outline" className="ml-2">
                  {userDoc.role}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Member Since:</span>
                <span className="ml-2">
                  {new Date(userDoc.createdAt.toDate()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}