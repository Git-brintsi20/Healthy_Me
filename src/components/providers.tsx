'use client';

import React from 'react';
import { ThemeProvider } from '@/components/common/theme-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { TooltipProvider } from '@/components/ui/tooltip';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: "toast",
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Component to wrap specific app sections that need additional providers
interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <div className="relative flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
}

// Dashboard-specific providers wrapper
interface DashboardProvidersProps {
  children: React.ReactNode;
}

export function DashboardProviders({ children }: DashboardProvidersProps) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// Admin-specific providers wrapper
interface AdminProvidersProps {
  children: React.ReactNode;
}

export function AdminProviders({ children }: AdminProvidersProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// Auth pages providers wrapper
interface AuthProvidersProps {
  children: React.ReactNode;
}

export function AuthProviders({ children }: AuthProvidersProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {children}
      </div>
    </div>
  );
}

// Loading providers wrapper
interface LoadingProvidersProps {
  children: React.ReactNode;
}

export function LoadingProviders({ children }: LoadingProvidersProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {children}
      </div>
    </div>
  );
}

// Error providers wrapper
interface ErrorProvidersProps {
  children: React.ReactNode;
}

export function ErrorProviders({ children }: ErrorProvidersProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20">
      <div className="text-center max-w-md mx-auto px-4">
        {children}
      </div>
    </div>
  );
}

// Context providers for specific features
interface FeatureProvidersProps {
  children: React.ReactNode;
}

export function FeatureProviders({ children }: FeatureProvidersProps) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}

// Combined providers for the entire app
interface RootProvidersProps {
  children: React.ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <Providers>
      <AppProviders>
        {children}
      </AppProviders>
    </Providers>
  );
}

export default Providers;