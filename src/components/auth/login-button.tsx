'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface LoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
  redirectTo?: string;
  className?: string;
}

export function LoginButton({ 
  variant = 'default', 
  size = 'default', 
  showText = true,
  redirectTo = '/dashboard',
  className = ''
}: LoginButtonProps) {
  const { loginWithGoogle, loading, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      toast.success('Successfully signed in!');
      router.push(redirectTo);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGoogleLogin}
      disabled={isLoading || loading}
      className={className}
      aria-label="Sign in with Google"
    >
      {isLoading || loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {showText && 'Signing in...'}
        </>
      ) : (
        <>
          <Icons.google className="mr-2 h-4 w-4" />
          {showText && 'Sign in with Google'}
        </>
      )}
    </Button>
  );
}

// Email Login Button Component
interface EmailLoginButtonProps {
  email: string;
  password: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export function EmailLoginButton({
  email,
  password,
  onSuccess,
  onError,
  disabled = false,
  className = ''
}: EmailLoginButtonProps) {
  const { loginWithEmail, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      onError?.('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await loginWithEmail({ email, password });
      toast.success('Successfully signed in!');
      onSuccess?.();
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in';
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="submit"
      onClick={handleEmailLogin}
      disabled={disabled || isLoading || loading || !email || !password}
      className={`w-full ${className}`}
      aria-label="Sign in with email"
    >
      {isLoading || loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        'Sign in'
      )}
    </Button>
  );
}

// Social Login Buttons Container
interface SocialLoginButtonsProps {
  redirectTo?: string;
  className?: string;
}

export function SocialLoginButtons({ 
  redirectTo = '/dashboard',
  className = ''
}: SocialLoginButtonsProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <LoginButton 
        variant="outline" 
        size="default" 
        redirectTo={redirectTo}
        className="w-full"
      />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginButton;