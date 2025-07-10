'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Shield,
  History,
  Heart,
  User,
  Settings,
  BarChart3,
  FileText,
  Plus,
  Zap,
  ChevronRight,
  LogOut,
  Home
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const mainNavigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview and quick access'
    },
    {
      name: 'Nutrition Search',
      href: '/dashboard',
      icon: Search,
      description: 'Analyze food and nutrition'
    },
    {
      name: 'Myth Busting',
      href: '/dashboard/myths',
      icon: Shield,
      description: 'Fact-check health claims'
    },
    {
      name: 'History',
      href: '/dashboard/history',
      icon: History,
      description: 'Your search history'
    },
    {
      name: 'Favorites',
      href: '/dashboard/favorites',
      icon: Heart,
      description: 'Saved items'
    },
  ];

  const accountNavigation = [
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: User,
      description: 'Manage your account'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      description: 'App preferences'
    },
  ];

  const adminNavigation = [
    {
      name: 'Admin Dashboard',
      href: '/admin/dashboard',
      icon: BarChart3,
      description: 'Admin overview'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: User,
      description: 'Manage users'
    },
    {
      name: 'Content',
      href: '/admin/content',
      icon: FileText,
      description: 'Manage content'
    },
  ];

  const quickActions = [
    {
      name: 'Analyze Food',
      href: '/dashboard?action=analyze',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Check Myth',
      href: '/dashboard/myths?action=check',
      icon: Shield,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
  ];

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`flex flex-col h-full bg-background border-r ${className}`}>
      {/* User Profile Section */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials(user.displayName || user.email || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.displayName || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          {role === 'admin' && (
            <Badge variant="secondary" className="text-xs">
              Admin
            </Badge>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.name}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="w-full justify-start h-8"
                >
                  <Link href={action.href}>
                    <div className={`mr-2 h-4 w-4 rounded-sm ${action.color} flex items-center justify-center`}>
                      <IconComponent className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs">{action.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="mb-6">
          <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Menu
          </h3>
          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <IconComponent className="mr-3 h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{item.name}</div>
                    <div className={`text-xs truncate ${
                      active ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {active && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <Separator className="my-4" />

        {/* Account Navigation */}
        <div className="mb-6">
          <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Account
          </h3>
          <nav className="space-y-1">
            {accountNavigation.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <IconComponent className="mr-3 h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{item.name}</div>
                    <div className={`text-xs truncate ${
                      active ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {active && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Navigation */}
        {role === 'admin' && (
          <>
            <Separator className="my-4" />
            <div className="mb-6">
              <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Administration
              </h3>
              <nav className="space-y-1">
                {adminNavigation.map((item) => {
                  const IconComponent = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <IconComponent className="mr-3 h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{item.name}</div>
                        <div className={`text-xs truncate ${
                          active ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                      // Code from where it was cut off

                      {active && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>
        )}
      </ScrollArea>

      {/* Logout Button */}
      <div className="p-3 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}