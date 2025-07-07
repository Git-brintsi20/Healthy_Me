import { AuthGuard } from '@/components/auth/auth-guard';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-bold">HealthyME</span>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-muted-foreground hover:text-foreground">
                  Features
                </a>
                <a href="#about" className="text-muted-foreground hover:text-foreground">
                  About
                </a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
              <div className="w-full max-w-md">
                {children}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">H</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  © 2025 HealthyME. All rights reserved.
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="#privacy" className="text-xs text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </a>
                <a href="#terms" className="text-xs text-muted-foreground hover:text-foreground">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}