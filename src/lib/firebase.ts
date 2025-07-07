// src/lib/firebase.ts

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, Timestamp } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// --- Initialize Firebase App ---
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// --- Initialize and Export Firebase Services ---
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

// --- Constants and Helpers ---

// User roles defined in the application
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const;

// A type created from the USER_ROLES object keys
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// List of super admin emails from environment variables
export const ADMIN_EMAILS: string[] = process.env.SUPER_ADMIN_EMAILS?.split(',') || [];

/**
 * Checks if a user's email corresponds to a super admin.
 * @param userEmail The email of the user to check.
 * @returns The user's role.
 */
export const getUserRole = (userEmail: string): UserRole => {
  if (ADMIN_EMAILS.includes(userEmail)) {
    return USER_ROLES.SUPER_ADMIN;
  }
  return USER_ROLES.USER;
};

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  NUTRITION_FACTS: 'nutrition_facts',
  MYTHS: 'myths',
  SEARCHES: 'searches',
  FAVORITES: 'favorites',
  HISTORY: 'history'
} as const;

// A type for the names of the collections
export type FirebaseCollections = typeof COLLECTIONS[keyof typeof COLLECTIONS];


// --- Firestore Document Interfaces ---

/** Base interface for all documents with common fields. */
export interface BaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  dietary_restrictions: string[];
}

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

export interface NutritionFactDocument extends BaseDocument {
  foodName: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
  source: string;
  verified: boolean;
}

export interface MythDocument extends BaseDocument {
  title: string;
  myth: string;
  fact: string;
  explanation: string;
  sources: string[];
  category: string;
  verified: boolean;
}

export interface SearchDocument extends BaseDocument {
  userId: string;
  query: string;
  results: any[];
  type: 'nutrition' | 'myth' | 'image';
}

export default app;