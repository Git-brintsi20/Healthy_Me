// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Import your providers and your SUPERIOR error boundary
import { ThemeProvider } from '@/components/common/theme-provider'; // Make sure this path is correct
import { AuthProvider } from '@/components/auth/auth-provider'; // For Step 5
import ErrorBoundary from '@/components/common/error-boundary'; // Use default import

const inter = Inter({ subsets: ['latin'] });

// --- Improved Metadata ---
export const metadata: Metadata = {
  // Use a template for page titles for better SEO
  title: {
    template: '%s | HealthyME',
    default: 'HealthyME - AI-Powered Nutrition & Myth-Busting',
  },
  description: 'Your personal AI nutrition co-pilot, built to fact-check your food and your feed.',
  // PWA and SEO metadata
  manifest: '/manifest.json',
  metadataBase: new URL('https://your-production-url.com'), // Replace with your actual domain
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Add suppressHydrationWarning for next-themes compatibility
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        {/*
          Wrap the entire application in your ErrorBoundary.
          We'll give it the 'critical' level since it's at the root.
        */}
        <ErrorBoundary level="critical" enableRetry={false} showReportButton={true}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* The AuthProvider is for later steps, but this is where it goes */}
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}