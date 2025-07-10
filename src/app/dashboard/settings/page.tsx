'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { updateUserDocument } from '@/lib/db';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { UserDocument } from '@/types';

interface SettingsPageProps {
  className?: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
  searchHistoryVisible: boolean;
  shareData: boolean;
}

export default function SettingsPage({ className }: SettingsPageProps) {
  const { user, userDoc, refreshUserDocument } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Settings state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: false,
    marketing: false
  });
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisible: true,
    searchHistoryVisible: false,
    shareData: false
  });

  // Initialize settings from userDoc
  useEffect(() => {
    if (userDoc?.preferences) {
      setTheme(userDoc.preferences.theme || 'light');
      setNotifications({
        email: userDoc.preferences.notifications ?? true,
        push: userDoc.preferences.pushNotifications ?? false,
        marketing: userDoc.preferences.marketing ?? false
      });
      setPrivacy({
        profileVisible: userDoc.preferences.profileVisible ?? true,
        searchHistoryVisible: userDoc.preferences.searchHistoryVisible ?? false,
        shareData: userDoc.preferences.shareData ?? false
      });
    }
  }, [userDoc]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    // Apply theme immediately
    const root = document.documentElement;
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', newTheme);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!user || !userDoc) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: Partial<UserDocument> = {
        preferences: {
          ...userDoc.preferences,
          theme,
          notifications: notifications.email,
          pushNotifications: notifications.push,
          marketing: notifications.marketing,
          profileVisible: privacy.profileVisible,
          searchHistoryVisible: privacy.searchHistoryVisible,
          shareData: privacy.shareData
        }
      };

      await updateUserDocument(user.uid, updateData);
      await refreshUserDocument();
      
      setSuccess('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      // In a real app, you'd call an API endpoint to handle account deletion
      // This would include deleting user data from Firestore and Firebase Auth
      alert('Account deletion is not implemented in this demo');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userDoc) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and privacy settings
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the appearance of the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <div className="flex space-x-2">
                {['light', 'dark', 'system'].map((themeOption) => (
                  <Button
                    key={themeOption}
                    variant={theme === themeOption ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeChange(themeOption as 'light' | 'dark' | 'system')}
                  >
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Control how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
              { key: 'push', label: 'Push Notifications', description: 'Receive browser notifications' },
              { key: 'marketing', label: 'Marketing Emails', description: 'Receive promotional content' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Button
                  variant={notifications[key as keyof NotificationSettings] ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleNotificationChange(
                    key as keyof NotificationSettings,
                    !notifications[key as keyof NotificationSettings]
                  )}
                >
                  {notifications[key as keyof NotificationSettings] ? 'On' : 'Off'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>
            Control your privacy and data sharing preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { key: 'profileVisible', label: 'Public Profile', description: 'Make your profile visible to others' },
              { key: 'searchHistoryVisible', label: 'Search History', description: 'Allow others to see your search history' },
              { key: 'shareData', label: 'Data Sharing', description: 'Help improve the app by sharing anonymous data' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Button
                  variant={privacy[key as keyof PrivacySettings] ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePrivacyChange(
                    key as keyof PrivacySettings,
                    !privacy[key as keyof PrivacySettings]
                  )}
                >
                  {privacy[key as keyof PrivacySettings] ? 'On' : 'Off'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            View your account details and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Account Type</p>
                <Badge variant="outline" className="mt-1">
                  {userDoc.role}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(userDoc.createdAt.toDate()).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Save Settings Button */}
      <Button
        onClick={handleSaveSettings}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Saving...
          </>
        ) : (
          'Save Settings'
        )}
      </Button>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}