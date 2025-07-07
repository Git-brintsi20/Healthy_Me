'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { USER_ROLES, type UserRole } from '@/lib/firebase';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requiredRole,
  fallback,
  redirectTo = '/login'
}: AuthGuardProps) {
  const { user, userDoc, loading } = useAuth();
  const router = useRouter();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    router.push(redirectTo);
    return null;
  }

  // If authentication is not required and user is logged in, redirect to dashboard
  if (!requireAuth && user) {
    router.push('/dashboard');
    return null;
  }

  // Check role-based access
  if (requiredRole && userDoc) {
    const hasRequiredRole = checkUserRole(userDoc.role, requiredRole);
    
    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// Helper function to check if user has required role
function checkUserRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [USER_ROLES.USER]: 0,
    [USER_ROLES.ADMIN]: 1,
    [USER_ROLES.SUPER_ADMIN]: 2,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export default AuthGuard;