"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  createSessionCookie,
  loginWithEmail as firebaseLoginWithEmail,
  loginWithGooglePopup,
  logoutUser,
  registerWithEmail,
  sendPasswordReset,
} from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sessionCreated = false;
    
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user && !sessionCreated) {
        sessionCreated = true;
        try {
          await createSessionCookie(user);
        } catch (error) {
          console.error("Error creating session:", error);
        }
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const user = await loginWithGooglePopup();
      if (user) {
        await createSessionCookie(user);
      }
    } catch (error: any) {
      // Don't throw error if user just closed the popup
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Login popup closed by user");
        return;
      }
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const user = await firebaseLoginWithEmail(email, password);
      if (user) {
        await createSessionCookie(user);
      }
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
      await registerWithEmail(email, password, displayName);
    } catch (error) {
      console.error("Error registering with email:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      await logoutUser();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordReset(email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
