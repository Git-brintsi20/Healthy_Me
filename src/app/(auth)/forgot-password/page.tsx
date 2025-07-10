"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  RefreshCw
} from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(true)
  const { resetPassword, loading, error, clearError } = useAuth()
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setIsValidEmail(value === "" || validateEmail(value))
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setIsValidEmail(false)
      return
    }

    if (!validateEmail(email)) {
      setIsValidEmail(false)
      return
    }

    try {
      await resetPassword(email)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Password reset error:", error)
    }
  }

  const handleResendEmail = async () => {
    try {
      await resetPassword(email)
    } catch (error) {
      console.error("Resend email error:", error)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthy-green/5 via-background to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2 border-healthy-green/20 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-healthy-green/10 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="h-8 w-8 text-healthy-green" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-healthy-green">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  We've sent password reset instructions to your email
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-healthy-green/5 border border-healthy-green/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-healthy-green mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">
                      Email sent to:
                    </p>
                    <p className="text-muted-foreground break-all">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Next steps:</p>
                  <ul className="space-y-1 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-healthy-green">•</span>
                      <span>Check your inbox (and spam folder)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-healthy-green">•</span>
                      <span>Click the reset link in the email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-healthy-green">•</span>
                      <span>Create a new password</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleResendEmail}
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resend Email
                      </>
                    )}
                  </Button>

                  <Button asChild className="w-full bg-healthy-green hover:bg-healthy-green/90">
                    <Link href="/auth/login">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Link>
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthy-green/5 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Forgot Password?
              </CardTitle>
              <CardDescription className="text-base mt-2">
                No worries! Enter your email and we'll send you reset instructions
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                  className={`h-12 ${!isValidEmail ? 'border-destructive' : ''}`}
                  disabled={loading}
                />
                {!isValidEmail && (
                  <p className="text-sm text-destructive">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-healthy-green hover:bg-healthy-green/90"
                disabled={loading || !email.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending Reset Email...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reset Email
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button asChild variant="outline" className="w-full h-12">
                  <Link href="/auth/login">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Link>
                </Button>

                <Button asChild variant="ghost" className="w-full">
                  <Link href="/auth/register">
                    Don't have an account? Sign up
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <Card className="bg-muted/30 border-muted">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Need Help?</h3>
                <p className="text-xs text-muted-foreground">
                  If you're having trouble resetting your password, contact our support team
                </p>
                <Button asChild variant="link" className="text-xs h-auto p-0">
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}