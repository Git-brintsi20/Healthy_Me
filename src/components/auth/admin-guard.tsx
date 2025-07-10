'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getAuth } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (loading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      try {
        // Get ID token result to check custom claims
        const auth = getAuth();
        const idTokenResult = await auth.currentUser?.getIdTokenResult();
        const role = idTokenResult?.claims.role;

        if (!role || !['admin', 'super_admin'].includes(role)) {
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/dashboard');
      } finally {
        setChecking(false);
      }
    };

    checkAdminStatus();
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <CardTitle>Verifying Access</CardTitle>
            <CardDescription>Checking administrative privileges...</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don&apos;t have permission to access this area.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              This section is restricted to administrators only.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-primary hover:underline"
            >
              Return to Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}