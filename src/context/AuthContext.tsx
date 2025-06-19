
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  signInWithPopup, // Changed from createUserWithEmailAndPassword, signInWithEmailAndPassword
  type User 
} from 'firebase/auth';
import { auth, GoogleAuthProvider } from '@/lib/firebase'; // Import GoogleAuthProvider
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  signInWithGoogle: () => Promise<User | null>; // New method
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result.user;
    } catch (e: any) {
      console.error("Google Sign-In Raw Error Object:", e);
      
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      if (e.code) {
        switch (e.code) {
          case 'auth/popup-closed-by-user':
            errorMessage = 'Sign-in process was cancelled by the user.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Google Sign-In is not enabled. Please check your Firebase project configuration.';
            break;
          case 'auth/invalid-credential':
          case 'auth/user-disabled':
          case 'auth/account-exists-with-different-credential':
             errorMessage = e.message || `An authentication error occurred (Code: ${e.code}).`;
            break;
          default: // Covers 'auth/internal-error' and other less common Firebase errors
            errorMessage = e.message ? `Google Sign-In Error: ${e.message}` : `An unexpected error occurred during Google Sign-In (Code: ${e.code || 'unknown'}). Ensure your Firebase project and Authorized Domains are correctly configured.`;
        }
      } else if (e.message) { // Non-Firebase specific errors or when code is not present
        errorMessage = e.message.includes("the requested action is invalid") 
            ? "The sign-in action is invalid. Ensure the domain is authorized in Firebase for mobile/web access."
            : `Google Sign-In Error: ${e.message}`;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      router.push('/'); // Redirect to home after logout
    } catch (e: any) {
      setError(e.message || 'Failed to log out');
      console.error("Logout error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

