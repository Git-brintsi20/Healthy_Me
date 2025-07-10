import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Image
            src="/images/logo.png"
            alt="HealthyME Logo"
            width={150}
            height={50}
            className="mx-auto mb-4"
            priority
          />
          <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
            Welcome to HealthyME
          </CardTitle>
          <p className="text-muted-foreground">
            Your AI-powered companion for nutrition facts and myth-busting
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Image
            src="/images/hero-nutrition.jpg"
            alt="Nutrition Hero"
            width={400}
            height={200}
            className="rounded-lg"
            priority
          />
          <p className="text-center text-sm text-muted-foreground">
            Discover accurate nutrition information and debunk myths with AI-driven insights.
          </p>
          <div className="flex space-x-4">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}