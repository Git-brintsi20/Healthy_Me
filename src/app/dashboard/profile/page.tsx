'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { User, Mail, Calendar, Settings, Save, Camera } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface ProfileFormData {
  displayName: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    dietary_restrictions: string[];
  };
}

const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Low-Carb',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Diabetic-Friendly',
];

export default function ProfilePage() {
  const { user, userDoc, updateUserDocument } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    email: '',
    preferences: {
      theme: 'light',
      notifications: true,
      dietary_restrictions: [],
    },
  });

  // Initialize form data when user document is loaded
  useEffect(() => {
    if (user && userDoc) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        preferences: {
          theme: userDoc.preferences.theme || 'light',
          notifications: userDoc.preferences.notifications ?? true,
          dietary_restrictions: userDoc.preferences.dietary_restrictions || [],
        },
      });
    }
  }, [user, userDoc]);

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferenceChange = (field: keyof ProfileFormData['preferences'], value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const handleDietaryRestrictionToggle = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dietary_restrictions: prev.preferences.dietary_restrictions.includes(restriction)
          ? prev.preferences.dietary_restrictions.filter(r => r !== restriction)
          : [...prev.preferences.dietary_restrictions, restriction],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: formData.displayName,
      });

      // Update Firestore user document
      await updateUserDocument({
        displayName: formData.displayName,
        preferences: formData.preferences,
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userDoc) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                  <AvatarFallback className="text-2xl">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
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
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold">{user.displayName || 'User'}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{userDoc.role}</Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {userDoc.createdAt.toDate().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed from this page.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Preferences</span>
                </CardTitle>
                <CardDescription>
                  Customize your app experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred theme.
                    </p>
                  </div>
                  <Select
                    value={formData.preferences.theme}
                    onValueChange={(value: 'light' | 'dark') => 
                      handlePreferenceChange('theme', value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about new content.
                    </p>
                  </div>
                  <Switch
                    checked={formData.preferences.notifications}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange('notifications', checked)
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label>Dietary Restrictions</Label>
                  <p className="text-sm text-muted-foreground">
                    Select any dietary restrictions that apply to you.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {DIETARY_RESTRICTIONS.map((restriction) => (
                      <label
                        key={restriction}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.preferences.dietary_restrictions.includes(restriction)}
                          onChange={() => handleDietaryRestrictionToggle(restriction)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{restriction}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
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
          </div>
        </form>
      </div>
    </div>
  );
}