'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth/auth-provider';
import { toast } from 'sonner';
import { LogOut, Loader2 } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
  showConfirmation?: boolean;
  redirectTo?: string;
  className?: string;
}

export function LogoutButton({ 
  variant = 'ghost', 
  size = 'default', 
  showText = true,
  showConfirmation = true,
  redirectTo = '/',
  className = ''
}: LogoutButtonProps) {
  const { signOut, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast.success('Successfully signed out!');
      router.push(redirectTo);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectLogout = async () => {
    if (showConfirmation) {
      setIsDialogOpen(true);
    } else {
      await handleLogout();
    }
  };

  if (showConfirmation) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={className}
            disabled={loading}
            aria-label="Sign out"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {showText && 'Sign out'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDirectLogout}
      disabled={isLoading || loading}
      className={className}
      aria-label="Sign out"
    >
      {isLoading || loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {showText && 'Signing out...'}
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          {showText && 'Sign out'}
        </>
      )}
    </Button>
  );
}

// Dropdown Menu Item variant
interface LogoutMenuItemProps {
  showConfirmation?: boolean;
  redirectTo?: string;
  onLogout?: () => void;
}

export function LogoutMenuItem({ 
  showConfirmation = true, 
  redirectTo = '/',
  onLogout
}: LogoutMenuItemProps) {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast.success('Successfully signed out!');
      router.push(redirectTo);
      onLogout?.();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </>
      )}
    </DropdownMenuItem>
  );
}

export default LogoutButton;