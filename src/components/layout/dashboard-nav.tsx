// src/components/layout/dashboard-nav.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { 
  Home, 
  Search, 
  HelpCircle, 
  History, 
  User, 
  Heart, 
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Star,
  TrendingUp,
  BookOpen,
  Shield
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
  isActive?: boolean;
}

interface DashboardNavProps {
  className?: string;
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Navigation items
  const mainNavItems: NavItem[] = [
    {
      href: '/dashboard',
      label: 'Home',
      icon: Home,
      description: 'Search nutrition facts and get AI insights'
    },
    {
      href: '/dashboard/myths',
      label: 'Myth Busting',
      icon: HelpCircle,
      description: 'Discover the truth about nutrition myths'
    },
    {
      href: '/dashboard/history',
      label: 'Search History',
      icon: History,
      description: 'View your past searches and analyses'
    },
    {
      href: '/dashboard/favorites',
      label: 'Favorites',
      icon: Heart,
      badge: favoriteCount > 0 ? favoriteCount.toString() : undefined,
      description: 'Your saved nutrition facts and myths'
    }
  ];

  const accountNavItems: NavItem[] = [
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: User,
      description: 'Manage your account settings'
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
      description: 'App preferences and notifications'
    }
  ];

  // Load favorite count from localStorage or API
  useEffect(() => {
    const loadFavoriteCount = () => {
      try {
        const favorites = localStorage.getItem('favorites');
        if (favorites) {
          const parsedFavorites = JSON.parse(favorites);
          setFavoriteCount(parsedFavorites.length || 0);
        }
      } catch (error) {
        console.error('Error loading favorites count:', error);
      }
    };

    loadFavoriteCount();
    // Listen for storage changes to update count
    window.addEventListener('storage', loadFavoriteCount);
    return () => window.removeEventListener('storage', loadFavoriteCount);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const NavLink = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => {
    const isActive = isActiveRoute(item.href);
    const Icon = item.icon;

    return (
      <Link 
        href={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group",
          "hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-primary text-primary-foreground shadow-sm"
        )}
      >
        <Icon className={cn(
          "w-5 h-5 transition-colors",
          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
        )} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium truncate">{item.label}</span>
            {item.badge && (
              <Badge variant={isActive ? "secondary" : "default"} className="text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {item.description && (
            <p className={cn(
              "text-xs truncate mt-0.5",
              isActive ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {item.description}
            </p>
          )}
        </div>
        <ChevronRight className={cn(
          "w-4 h-4 transition-transform opacity-0 group-hover:opacity-100",
          isActive && "opacity-100"
        )} />
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <nav className={cn(
        "fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-50 transition-transform duration-300 ease-in-out",
        "md:translate-x-0 md:static md:z-auto",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">HealthyME</h1>
                <p className="text-xs text-muted-foreground">AI Nutrition Assistant</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user?.displayName || user?.email || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {/* Main Navigation */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                  Main
                </p>
                <div className="space-y-1">
                  {mainNavItems.map((item) => (
                    <NavLink 
                      key={item.href} 
                      item={item} 
                      onClick={closeMobileMenu}
                    />
                  ))}
                </div>
              </div>

              {/* Account Navigation */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                  Account
                </p>
                <div className="space-y-1">
                  {accountNavItems.map((item) => (
                    <NavLink 
                      key={item.href} 
                      item={item} 
                      onClick={closeMobileMenu}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="p-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">This Month</span>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Searches</span>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Myths Busted</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Foods Analyzed</span>
                    <span className="font-medium">28</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <div className="mt-3 text-xs text-muted-foreground text-center">
              <p>Powered by Google Cloud AI</p>
              <div className="flex items-center justify-center mt-1">
                <Shield className="w-3 h-3 mr-1" />
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default DashboardNav;