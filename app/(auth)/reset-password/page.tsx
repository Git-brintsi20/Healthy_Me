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
import { Loader2, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [emailSent, setEmailSent] = React.useState(false)
  const { resetPassword, user } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setLoading(true)
    try {
      await resetPassword(email)
      setEmailSent(true)
      toast.success("Password reset email sent! Check your inbox.")
    } catch (error: any) {
      console.error("Reset password error:", error)
      
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email address")
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address")
      } else {
        toast.error(error.message || "Failed to send reset email. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <Link href="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary hover:bg-primary/90 transition-colors">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </Link>
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Check your email
            </CardTitle>
            <CardDescription>
              We&apos;ve sent a password reset link to:
            </CardDescription>
            <p className="text-sm font-medium text-foreground pt-2">
              {email}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="text-sm font-medium">Next steps:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Check your email inbox</li>
                <li>Click the reset link (valid for 1 hour)</li>
                <li>Create a new password</li>
                <li>Sign in with your new password</li>
              </ol>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setEmailSent(false)}
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
              >
                try again
              </button>
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <Link href="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary hover:bg-primary/90 transition-colors">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </Link>
          <CardTitle className="text-2xl font-bold text-center">
            Reset password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                autoFocus
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
                  Sending reset link...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/login" className="w-full">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </Link>
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
