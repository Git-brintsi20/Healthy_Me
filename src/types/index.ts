// src/types/index.ts

import { User as FirebaseUser } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { ReactNode } from 'react';

// =================================================================
// 1. USER & AUTHENTICATION TYPES
// =================================================================

/** User roles available in the application. Sourced from firebase.ts */
export type UserRole = 'user' | 'admin' | 'super_admin';

/** User preferences for theme, notifications, and diet. */
export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  dietary_restrictions: string[];
}

/** The structure of a user document stored in Firestore. */
export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** The state of the authentication context. */
export interface AuthState {
  user: FirebaseUser | null;
  userDoc: UserDocument | null;
  loading: boolean;
  error: string | null;
}

/** Interface for the authentication context provider from auth-context.tsx */
export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  updateUserDocument: (data: Partial<UserDocument>) => Promise<void>;
  refreshUserDocument: () => Promise<void>;
}

// =================================================================
// 2. NUTRITION TYPES
// =================================================================

/** Macronutrients breakdown. */
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

/** Full nutrition analysis from the Gemini API. */
export interface NutritionAnalysis {
  foodName: string;
  calories: number;
  macros: MacroNutrients;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
  healthBenefits: string[];
  allergens: string[];
  servingSize: string;
  confidence: number;
}

// =================================================================
// 3. MYTH-BUSTING TYPES
// =================================================================

/** The verdict for a myth analysis. */
export type MythVerdict = 'myth' | 'fact' | 'partially_true';

/** The structure of a myth analysis from the Gemini API. */
export interface MythAnalysis {
  claim: string;
  verdict: MythVerdict;
  explanation: string;
  scientificEvidence: string;
  sources: string[];
  confidence: number;
  category: string;
}

// =================================================================
// 4. IMAGE ANALYSIS TYPES
// =================================================================

/** Details of a single food item identified in an image. */
export interface FoodIdentification {
  name: string;
  confidence: number;
  description: string;
}

/** The result of an image analysis from the Gemini Vision API. */
export interface ImageAnalysisResult {
  identifiedFoods: FoodIdentification[];
  overallConfidence: number;
  suggestions: string[];
}

// =================================================================
// 5. API TYPES
// =================================================================

/** A standardized structure for API errors. */
export interface ApiError {
  message: string;
  code?: number;
}

/** A generic wrapper for all API responses. */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
  timestamp: string;
}

/** Request body for the /api/analyze-nutrition route. */
export interface NutritionRequest {
  foodItem: string;
  userId: string;
}

/** Request body for the /api/analyze-myth route. */
export interface MythRequest {
  claim: string;
  userId: string;
}

// =================================================================
// 6. SEARCH & DATABASE TYPES
// =================================================================

/** The type of search being performed. */
export type SearchType = 'nutrition' | 'myth' | 'image';

/** Base interface for all Firestore documents. */
export interface BaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** The structure of a search log document in Firestore. */
export interface SearchDocument extends BaseDocument {
  userId: string;
  query: string;
  results: any[];
  type: SearchType;
}

// =================================================================
// 7. COMPONENT PROPS TYPES
// =================================================================

/** Base props for any standard React component. */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

/** Props for the AuthGuard component to protect routes. */
export interface AuthGuardProps extends BaseComponentProps {
  requiredRole?: UserRole;
}

/** Props for the main SearchBar component. */
export interface SearchBarProps extends BaseComponentProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialQuery?: string;
}

/** Props for the versatile InfoCard component. */
export interface InfoCardProps extends BaseComponentProps {
  variant: 'nutrition' | 'myth' | 'recommendation';
  data: NutritionAnalysis | MythAnalysis | any;
  isLoading?: boolean;
}