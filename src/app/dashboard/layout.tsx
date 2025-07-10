'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  Search, 
  BookOpen, 
  History, 
  Heart, 
  Settings, 
  Menu, 
  LogOut, 
  User 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Search', href: '/dashboard/search', icon: Search },
  { name: 'Myths', href: '/dashboard/myths', icon: BookOpen },
  { name: 'History', href: '/dashboard/history', icon: History },
  { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, userDoc, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen bg-background">
        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <Sidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {getPageTitle(pathname)}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                        <AvatarFallback>
                          {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.displayName || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
          <span className="text-xl font-bold text-white">HealthyME</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function getPageTitle(pathname: string): string {
  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  const titleMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'search': 'Search',
    'myths': 'Nutrition Myths',
    'history': 'Search History',
    'favorites': 'Favorites',
    'profile': 'Profile',
    'settings': 'Settings',
  };
  
  return titleMap[lastSegment] || 'Dashboard';
}