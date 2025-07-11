// src/types/auth.ts

import { User as FirebaseUser } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

// =================================================================
// USER ROLES AND PERMISSIONS
// =================================================================

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface UserPermissions {
  canCreateMyths: boolean;
  canEditMyths: boolean;
  canDeleteMyths: boolean;
  canManageUsers: boolean;
  canAccessAnalytics: boolean;
  canModerateContent: boolean;
}

// =================================================================
// USER TYPES
// =================================================================

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  dietary_restrictions: string[];
  units: 'metric' | 'imperial';
}

export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface AuthUser extends FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// =================================================================
// AUTHENTICATION STATE
// =================================================================

export interface AuthState {
  user: AuthUser | null;
  userDoc: UserDocument | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  permissions: UserPermissions;
}

export interface AuthContext extends AuthState {
  signOut: () => Promise<void>;
  updateUserDocument: (data: Partial<UserDocument>) => Promise<void>;
  refreshUserDocument: () => Promise<void>;
  checkPermission: (permission: keyof UserPermissions) => boolean;
}

// =================================================================
// FORM TYPES
// =================================================================

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ProfileFormData {
  displayName: string;
  photoURL?: string;
  preferences: UserPreferences;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// =================================================================
// VALIDATION TYPES
// =================================================================

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface AuthValidationRules {
  email: {
    required: boolean;
    pattern: RegExp;
    message: string;
  };
  password: {
    required: boolean;
    minLength: number;
    pattern?: RegExp;
    message: string;
  };
  displayName: {
    required: boolean;
    minLength: number;
    maxLength: number;
    message: string;
  };
}

// =================================================================
// AUTH RESPONSE TYPES
// =================================================================

export interface AuthApiResponse {
  success: boolean;
  user?: FirebaseUser;
  userDoc?: UserDocument;
  error?: AuthApiError;
  message?: string;
}

export interface AuthApiError {
  code: string;
  message: string;
  details?: any;
}

// =================================================================
// AUTH ACTIONS
// =================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface UpdateProfileData {
  displayName?: string;
  photoURL?: string;
  preferences?: Partial<UserPreferences>;
}

// =================================================================
// GUARD TYPES
// =================================================================

export interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: UserRole;
  requiredPermission?: keyof UserPermissions;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

// =================================================================
// UTILITY TYPES
// =================================================================

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthHelpers {
  isAdmin: (user: UserDocument | null) => boolean;
  isSuperAdmin: (user: UserDocument | null) => boolean;
  hasRole: (user: UserDocument | null, role: UserRole) => boolean;
  hasPermission: (user: UserDocument | null, permission: keyof UserPermissions) => boolean;
  getUserPermissions: (role: UserRole) => UserPermissions;
}

// =================================================================
// HOOK TYPES
// =================================================================

export interface UseAuthOptions {
  requireAuth?: boolean;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export interface UseAuthReturn extends AuthState {
  signOut: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  refreshUser: () => Promise<void>;
  checkPermission: (permission: keyof UserPermissions) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

// =================================================================
// CONSTANTS
// =================================================================

export const AUTH_ERRORS = {
  INVALID_EMAIL: 'auth/invalid-email',
  USER_DISABLED: 'auth/user-disabled',
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
} as const;

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  LOGIN_ERROR: 'Failed to log in',
  REGISTER_SUCCESS: 'Account created successfully',
  REGISTER_ERROR: 'Failed to create account',
  LOGOUT_SUCCESS: 'Successfully logged out',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully',
  PROFILE_UPDATE_ERROR: 'Failed to update profile',
  PASSWORD_RESET_SUCCESS: 'Password reset email sent',
  PASSWORD_RESET_ERROR: 'Failed to send password reset email',
} as const;

// =================================================================
// PERMISSION HELPERS
// =================================================================

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  [USER_ROLES.USER]: {
    canCreateMyths: false,
    canEditMyths: false,
    canDeleteMyths: false,
    canManageUsers: false,
    canAccessAnalytics: false,
    canModerateContent: false,
  },
  [USER_ROLES.ADMIN]: {
    canCreateMyths: true,
    canEditMyths: true,
    canDeleteMyths: true,
    canManageUsers: false,
    canAccessAnalytics: true,
    canModerateContent: true,
  },
  [USER_ROLES.SUPER_ADMIN]: {
    canCreateMyths: true,
    canEditMyths: true,
    canDeleteMyths: true,
    canManageUsers: true,
    canAccessAnalytics: true,
    canModerateContent: true,
  },
};

// =================================================================
// TYPE GUARDS
// =================================================================

export function isFirebaseUser(user: any): user is FirebaseUser {
  return user && typeof user.uid === 'string';
}

export function isUserDocument(doc: any): doc is UserDocument {
  return doc && typeof doc.uid === 'string' && typeof doc.email === 'string';
}

export function isValidUserRole(role: string): role is UserRole {
  return Object.values(USER_ROLES).includes(role as UserRole);
}

// =================================================================
// EXPORTS
// =================================================================

export type {
  FirebaseUser,
};