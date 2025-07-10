'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Sun, 
  Moon, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  Heart,
  History,
  Shield,
  Search
} from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, role, loginWithGoogle, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Search },
    { name: 'Myths', href: '/dashboard/myths', icon: Shield },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
  ];

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">H</span>
            </div>
            <span className="text-xl font-bold text-foreground">HealthyME</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 px-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Authentication */}
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Admin Badge */}
              {role === 'admin' && (
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  Admin
                </Badge>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials(user.displayName || user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.displayName && (
                        <p className="font-medium">{user.displayName}</p>
                      )}
                      {user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  {role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <Button
              variant="outline"
              size="sm"
              className="md:hidden h-9 w-9 px-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}