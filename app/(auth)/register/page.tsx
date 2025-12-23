"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { Loader2, Sparkles } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const { registerWithEmail, loginWithGoogle, user } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await registerWithEmail(email, password, displayName || undefined)
      toast.success("Account created successfully! Welcome to HealthyME!")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration error:", error)
      
      // Handle specific Firebase auth errors
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please sign in instead.")
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address")
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Use at least 6 characters.")
      } else {
        toast.error(error.message || "Failed to create account. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
      toast.success("Successfully signed up with Google!")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google signup error:", error)
      toast.error(error.message || "Failed to sign up with Google")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <Link href="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary hover:bg-primary/90 transition-colors">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </Link>
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Join HealthyME and start your wellness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">
                Display Name <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
            >
              Sign in
            </Link>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            <Link href="/" className="hover:underline">
              Back to home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
