import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { auth, googleProvider, signInAnonymously, signInWithPopup, signOut, onAuthStateChanged, User, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Anonymous sign-in is attempted once per page load. If the Anonymous
  // provider isn't enabled in the Firebase console yet, this stays false
  // and the app falls back to the Login screen as before.
  const anonAttempted = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser && !anonAttempted.current) {
        // No login screen: silently create a per-device anonymous identity
        // so every visitor gets persistent per-user storage with zero friction.
        anonAttempted.current = true;
        try {
          await signInAnonymously(auth);
          return; // onAuthStateChanged refires with the new user; finish there.
        } catch (error) {
          console.error('Anonymous sign-in failed (is the Anonymous provider enabled in the Firebase console?):', error);
        }
      }
      if (currentUser) {
        // Ensure user document exists in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              isPro: false,
              createdAt: serverTimestamp(),
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}`);
        }
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, loading, signIn, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
