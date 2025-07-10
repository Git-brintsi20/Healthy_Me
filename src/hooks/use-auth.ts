'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth, getUserRole, USER_ROLES } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

export function useAuth() {
  const [user, loading, firebaseError] = useAuthState(auth);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const role = idTokenResult.claims.role || getUserRole(user.email || '');
          setAuthState((prev) => ({ ...prev, user, role, loading: false }));
        } catch (error) {
          setAuthState((prev) => ({ ...prev, user, role: null, loading: false }));
        }
      } else {
        setAuthState((prev) => ({ ...prev, user: null, role: null, loading: false }));
      }
    };
    fetchRole();
  }, [user, loading]);

  const setError = (error: string | null) => {
    setAuthState((prev) => ({ ...prev, error }));
  };

  const loginWithEmail = async ({ email, password }: LoginData): Promise<User> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role || getUserRole(email);
      setAuthState((prev) => ({ ...prev, user, role, loading: false }));
      return user;
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      throw error;
    }
  };

  const registerWithEmail = async ({ email, password, displayName }: RegisterData): Promise<User> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName });
      const role = email === process.env.ADMIN_EMAIL ? USER_ROLES.ADMIN : getUserRole(email);
      setAuthState((prev) => ({ ...prev, user, role, loading: false }));
      return user;
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<User> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const provider = new GoogleAuthProvider();
      provider.addScope('email profile');
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role || getUserRole(user.email || '');
      setAuthState((prev) => ({ ...prev, user, role, loading: false }));
      return user;
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await sendPasswordResetEmail(auth, email);
      setAuthState((prev) => ({ ...prev, loading: false }));
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      throw error;
    }
  };

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const user = auth.currentUser;
      if (!user) throw new Error('No user is currently signed in');
      await updateProfile(user, data);
      setAuthState((prev) => ({ ...prev, loading: false }));
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    ...authState,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    resetPassword,
    updateUserProfile,
    clearError,
  };
}

function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing the process.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by the browser.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in popup request was cancelled.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
}