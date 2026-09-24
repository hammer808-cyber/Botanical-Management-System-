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
    const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
      Promise.race([
        promise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
        ),
      ]);

    // Failsafe: never trap the user on the spinner. If auth is still
    // unresolved after 12s, drop the gate (Login shows, as before the
    // anonymous change). A late auth event still corrects the screen below.
    const failsafe = setTimeout(() => {
      console.warn('Auth init still pending after 12s; releasing the loading gate.');
      setLoading(false);
    }, 12000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser && !anonAttempted.current) {
        // No login screen: silently create a per-device anonymous identity
        // so every visitor gets persistent per-user storage with zero friction.
        anonAttempted.current = true;
        try {
          await withTimeout(signInAnonymously(auth), 10000, 'Anonymous sign-in');
          return; // onAuthStateChanged refires with the new user; finish there.
        } catch (error) {
          console.error('Anonymous sign-in failed (is the Anonymous provider enabled in the Firebase console?):', error);
        }
      }
      // Ensure a profile doc exists for signed-in (non-anonymous) users.
      // Skipped for anonymous users: the Firestore user rules require a
      // valid email, which anonymous identities don't have.
      // Best-effort only: handleFirestoreError re-throws by design, so a
      // failure here must never break app init (that was the infinite
      // spinner). The 12s failsafe above is the backstop.
      if (currentUser && !currentUser.isAnonymous) {
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await withTimeout(getDoc(userRef), 8000, 'User doc read');
          if (!userDoc.exists()) {
            await withTimeout(
              setDoc(userRef, {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
                isPro: false,
                createdAt: serverTimestamp(),
              }),
              8000,
              'User doc write',
            );
          }
        } catch (error) {
          try {
            handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}`);
          } catch (handlerError) {
            console.error('Non-fatal: user profile doc could not be ensured.', handlerError);
          }
        }
      }
      clearTimeout(failsafe);
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      clearTimeout(failsafe);
      unsubscribe();
    };
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
