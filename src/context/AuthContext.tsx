
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
      console.error("Google Sign-In Raw Error Object:", e); // Log the full error object
      
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
            errorMessage = 'Google Sign-In is not enabled for this Firebase project. Please check your Firebase console.';
            break;
          case 'auth/invalid-credential':
          case 'auth/user-disabled':
          case 'auth/account-exists-with-different-credential':
            errorMessage = e.message || 'An authentication error occurred.';
            break;
          default:
            // For "auth/internal-error" or other generic/uncommon Firebase errors, 
            // or "the requested action is invalid" which doesn't have a specific Firebase code but is often related to config.
            errorMessage = `An error occurred (Code: ${e.code || 'unknown'}): ${e.message || 'Please check console for details and ensure your Firebase project is correctly configured (e.g., Authorized Domains for mobile access).'}`;
        }
      } else if (e.message && e.message.includes("the requested action is invalid")) {
        // Catching the specific string if no code is present
         errorMessage = "The sign-in action is invalid. This often means the domain you're using on mobile isn't authorized in your Firebase project settings.";
      } else if (e.message) {
        errorMessage = e.message;
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

