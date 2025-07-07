'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, COLLECTIONS, getUserRole, type UserDocument } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userDoc: UserDocument | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  updateUserDocument: (data: Partial<UserDocument>) => Promise<void>;
  refreshUserDocument: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create or update user document in Firestore
  const createOrUpdateUserDoc = async (user: User): Promise<UserDocument> => {
    const userRef = doc(db, COLLECTIONS.USERS, user.uid);
    
    try {
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        // Update existing user document
        const existingData = userSnap.data() as UserDocument;
        const updatedData: Partial<UserDocument> = {
          email: user.email || existingData.email,
          displayName: user.displayName || existingData.displayName,
          photoURL: user.photoURL || existingData.photoURL,
          updatedAt: new Date(),
        };
        
        await updateDoc(userRef, updatedData);
        return { ...existingData, ...updatedData } as UserDocument;
      } else {
        // Create new user document
        const newUserDoc: UserDocument = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: getUserRole(user.email || ''),
          createdAt: new Date(),
          updatedAt: new Date(),
          preferences: {
            theme: 'light',
            notifications: true,
            dietary_restrictions: [],
          },
        };
        
        await setDoc(userRef, newUserDoc);
        return newUserDoc;
      }
    } catch (error) {
      console.error('Error creating/updating user document:', error);
      throw error;
    }
  };

  // Update user document
  const updateUserDocument = async (data: Partial<UserDocument>): Promise<void> => {
    if (!user) return;
    
    try {
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };
      
      await updateDoc(userRef, updateData);
      
      // Update local state
      setUserDoc(prev => prev ? { ...prev, ...updateData } : null);
    } catch (error) {
      console.error('Error updating user document:', error);
      setError('Failed to update user profile');
      throw error;
    }
  };

  // Refresh user document from Firestore
  const refreshUserDocument = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserDoc(userSnap.data() as UserDocument);
      }
    } catch (error) {
      console.error('Error refreshing user document:', error);
      setError('Failed to refresh user data');
    }
  };

  // Sign out user
  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setUserDoc(null);
      setError(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        setError(null);
        
        if (user) {
          setUser(user);
          // Create or update user document
          const userDocument = await createOrUpdateUserDoc(user);
          setUserDoc(userDocument);
        } else {
          setUser(null);
          setUserDoc(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setError('Authentication error occurred');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Context value
  const value: AuthContextType = {
    user,
    userDoc,
    loading,
    error,
    signOut: handleSignOut,
    updateUserDocument,
    refreshUserDocument,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;