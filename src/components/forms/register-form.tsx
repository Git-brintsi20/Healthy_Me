'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { createUserDocument } from '@/lib/db';
import { Eye, EyeOff, Mail, User, Lock, UserPlus, Chrome } from 'lucide-react';

interface RegisterFormProps {
  className?: string;
}

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  dietary_restrictions: string[];
  acceptTerms: boolean;
}

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Low-Carb',
  'Pescatarian',
  'Halal',
  'Kosher'
];

export default function RegisterForm({ className }: RegisterFormProps) {
  const { registerWithEmail, loginWithGoogle, loading, error, clearError } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    dietary_restrictions: [],
    acceptTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<RegisterFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific errors when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Clear auth errors
    if (error) clearError();
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(restriction)
        ? prev.dietary_restrictions.filter(r => r !== restriction)
        : [...prev.dietary_restrictions, restriction]
    }));
  };

  const validateForm = (): boolean => {
    const errors: Partial<RegisterFormData> = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Display name validation
    if (!formData.displayName.trim()) {
      errors.displayName = 'Display name is required';
    } else if (formData.displayName.trim().length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Register user with Firebase Auth
      const user = await registerWithEmail({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName.trim()
      });

      // Create user document in Firestore
      await createUserDocument(user.uid, {
        email: formData.email,
        displayName: formData.displayName.trim(),
        photoURL: '',
        role: 'user',
        preferences: {
          theme: 'light',
          notifications: true,
          dietary_restrictions: formData.dietary_restrictions
        }
      });

      // Redirect to dashboard or home page
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      // Error is handled by useAuth hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await loginWithGoogle();
      
      // Create user document in Firestore (will be handled by AuthProvider)
      // but we can set default dietary restrictions here if needed
      await createUserDocument(user.uid, {
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: 'user',
        preferences: {
          theme: 'light',
          notifications: true,
          dietary_restrictions: []
        }
      });

      router.push('/dashboard');
    } catch (err) {
      console.error('Google sign-in error:', err);
      // Error is handled by useAuth hook
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join HealthyMe and start your wellness journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Google Sign Up */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <Chrome className="w-4 h-4 mr-2" />
            Sign up with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="displayName"
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="Enter your display name"
                className="pl-10"
                required
              />
            </div>
            {formErrors.displayName && (
              <p className="text-sm text-destructive">{formErrors.displayName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className="pl-10"
                required
              />
            </div>
            {formErrors.email && (
              <p className="text-sm text-destructive">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a password"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-sm text-destructive">{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-sm text-destructive">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Dietary Restrictions (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Dietary Restrictions <span className="text-muted-foreground">(Optional)</span>
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {DIETARY_OPTIONS.map((option) => (
                <div
                  key={option}
                  onClick={() => toggleDietaryRestriction(option)}
                  className="cursor-pointer"
                >
                  <Badge
                    variant={
                      formData.dietary_restrictions.includes(option)
                        ? 'default'
                        : 'outline'
                    }
                    className="w-full justify-center hover:bg-primary/20 transition-colors text-xs"
                  >
                    {option}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
              I accept the{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {formErrors.acceptTerms && (
            <p className="text-sm text-destructive">{formErrors.acceptTerms}</p>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Already have an account?</span>{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}