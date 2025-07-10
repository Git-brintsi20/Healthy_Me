'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import Link from 'next/link';

export default function AdminPage() {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
              Admin Panel
            </CardTitle>
            <p className="text-muted-foreground">
              Welcome, {user?.displayName || 'Admin'}! Manage HealthyME content and users.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Indicator */}
            <div>
              <p className="text-sm text-muted-foreground">
                Role: <span className="font-medium capitalize">{role}</span>
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild variant="outline">
                <Link href="/admin/dashboard">Dashboard Overview</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/users">Manage Users</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/content">Content Management</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/analytics">Analytics</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/moderation">Moderation Queue</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/settings">Admin Settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}